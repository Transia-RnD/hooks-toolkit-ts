import 'dotenv/config'
import { encode } from '@transia/ripple-binary-codec'
import { BaseResponse } from '@transia/xrpl/dist/npm/models/methods/baseMethod'
import { getFeeEstimateXrp } from '@transia/xrpl/dist/npm/sugar'
import { assert } from 'chai'
import omit from 'lodash/omit'
import throttle from 'lodash/throttle'
import {
  Client,
  Wallet,
  Transaction,
  type SubmitResponse,
  TimeoutError,
  NotConnectedError,
  unixTimeToRippleTime,
  TxResponse,
  TransactionMetadata,
} from '@transia/xrpl'
import { hashSignedTx } from '@transia/xrpl/dist/npm/utils/hashes'
import { appLogger } from '../logger'

interface ServerStateRPCResult {
  state: {
    validated_ledger: {
      reserve_base: number // Account Reserve fee
      reserve_inc: number // Owner Reserve fee
    }
  }
}

export function generateRandomDestinationTag(): number {
  return Math.floor(Math.random() * 4294967295)
}

export async function serverStateRPC(client: Client): Promise<BaseResponse> {
  const request = {
    command: 'server_state',
  }
  return await client.request(request)
}

export async function accountReserveFee(client: Client): Promise<number> {
  const { result } = await serverStateRPC(client)
  return (result as ServerStateRPCResult).state.validated_ledger?.reserve_base
}

export async function ownerReserveFee(client: Client): Promise<number> {
  const { result } = await serverStateRPC(client)
  return (result as ServerStateRPCResult).state.validated_ledger?.reserve_inc
}

export async function getTransactionFee(
  client: Client,
  transaction: Transaction
): Promise<string> {
  const copyTx = JSON.parse(JSON.stringify(transaction))
  copyTx.Fee = `0`
  copyTx.SigningPubKey = ``

  const preparedTx = await client.autofill(copyTx)

  const tx_blob = encode(preparedTx)

  const result = await getFeeEstimateXrp(client, tx_blob)

  return result
}

export async function prepareTransactionV3(
  client: Client,
  transaction: Transaction
) {
  if (!transaction.Fee) {
    transaction.Fee = await getTransactionFee(client, transaction)
  }
}

async function sendLedgerAccept(client: Client): Promise<unknown> {
  return client.connection.request({ command: 'ledger_accept' })
}

/**
 * Throttles an async function in a way that can be awaited.
 * By default throttle doesn't return a promise for async functions unless it's invoking them immediately.
 *
 * @param func - async function to throttle calls for.
 * @param wait - same function as lodash.throttle's wait parameter. Call this function at most this often.
 * @returns a promise which will be resolved/ rejected only if the function is executed, with the result of the underlying call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Proper
function asyncThrottle<F extends (...args: any[]) => Promise<unknown>>(
  func: F,
  wait?: number
): (...args: Parameters<F>) => ReturnType<F> {
  const throttled = throttle((resolve, reject, args: Parameters<F>) => {
    func(...args)
      .then(resolve)
      .catch(reject)
  }, wait)
  const ret = (...args: Parameters<F>): ReturnType<F> =>
    new Promise((resolve, reject) => {
      throttled(resolve, reject, args)
    }) as ReturnType<F>
  return ret
}

const throttledLedgerAccept = asyncThrottle(sendLedgerAccept, 1000)

export async function ledgerAccept(
  client: Client,
  retries?: number,
  shouldThrottle?: boolean
): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    const ledgerAcceptFunc = shouldThrottle
      ? throttledLedgerAccept
      : sendLedgerAccept
    ledgerAcceptFunc(client)
      .then(resolve)
      .catch((error) => {
        if (retries === undefined) {
          setTimeout(() => {
            resolve(ledgerAccept(client, 10))
          }, 1000)
        } else if (retries > 0) {
          setTimeout(() => {
            resolve(ledgerAccept(client, retries - 1))
          }, 1000)
        } else {
          reject(error)
        }
      })
  })
}

/**
 * Attempt to get the time after which we can check for the escrow to be finished.
 * Sometimes the ledger close_time is in the future, so we need to wait for it to catch up.
 *
 * @param targetTime - The target wait time, before accounting for current ledger time.
 * @param minimumWaitTimeMs - The minimum wait time in milliseconds.
 * @param maximumWaitTimeMs - The maximum wait time in milliseconds.
 * @returns The wait time in milliseconds.
 */
export function calculateWaitTimeForTransaction(
  targetTime: number,
  minimumWaitTimeMs = 5000,
  maximumWaitTimeMs = 20000
): number {
  const currentTimeUnixMs = Math.floor(new Date().getTime())
  const currentTimeRippleSeconds = unixTimeToRippleTime(currentTimeUnixMs)
  const closeTimeCurrentTimeDiffSeconds = currentTimeRippleSeconds - targetTime
  const closeTimeCurrentTimeDiffMs = closeTimeCurrentTimeDiffSeconds * 1000
  return Math.max(
    minimumWaitTimeMs,
    Math.min(
      Math.abs(closeTimeCurrentTimeDiffMs) + minimumWaitTimeMs,
      // Maximum wait time of 20 seconds
      maximumWaitTimeMs
    )
  )
}

export function subscribeDone(client: Client): void {
  client.removeAllListeners()
}

export async function submitTransaction({
  client,
  transaction,
  wallet,
  retry = { count: 5, delayMs: 1000 },
}: {
  client: Client
  transaction: Transaction
  wallet: Wallet
  retry?: {
    count: number
    delayMs: number
  }
}): Promise<SubmitResponse> {
  let response: SubmitResponse
  try {
    response = await client.submit(transaction, { wallet })

    // Retry if another transaction finished before this one
    while (
      ['tefPAST_SEQ', 'tefMAX_LEDGER'].includes(
        response.result.engine_result
      ) &&
      retry.count > 0
    ) {
      // eslint-disable-next-line no-param-reassign -- we want to decrement the count
      retry.count -= 1
      // eslint-disable-next-line no-await-in-loop, no-promise-executor-return -- We are waiting on retries
      await new Promise((resolve) => setTimeout(resolve, retry.delayMs))
      // eslint-disable-next-line no-await-in-loop -- We are retrying in a loop on purpose
      response = await client.submit(transaction, { wallet })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    appLogger.debug(error)
    appLogger.debug(JSON.stringify(error.data.decoded))
    appLogger.debug(JSON.stringify(error.data.tx))

    if (error instanceof TimeoutError || error instanceof NotConnectedError) {
      // retry
      return submitTransaction({
        client,
        transaction,
        wallet,
        retry: {
          ...retry,
          count: retry.count > 0 ? retry.count - 1 : 0,
        },
      })
    }

    throw error
  }

  return response
}

export async function verifySubmittedTransaction(
  client: Client,
  tx: Transaction | string,
  hashTx?: string
): Promise<TxResponse> {
  const hash = hashTx ?? hashSignedTx(tx)
  const data = await client.request({
    command: 'tx',
    transaction: hash,
  })

  assert(data.result)
  return data
  // assert.deepEqual(
  //   omit(data.result, [
  //     'date',
  //     'hash',
  //     'inLedger',
  //     'ledger_index',
  //     'meta',
  //     'validated',
  //   ]),
  //   typeof tx === 'string' ? decode(tx) : tx
  // )
  // if (typeof data.result.meta === 'object') {
  //   assert.strictEqual(data.result.meta.TransactionResult, 'tesSUCCESS')
  // } else {
  //   assert.strictEqual(data.result.meta, 'tesSUCCESS')
  // }
}

// eslint-disable-next-line max-params -- Test function, many params are needed
export async function appTransaction(
  client: Client,
  transaction: Transaction,
  wallet: Wallet,
  retry?: {
    hardFail: boolean | true
    count: number
    delayMs: number
  }
): Promise<TxResponse> {
  if (process.env.RIPPLED_ENV === 'standalone') {
    return await testTransaction(client, transaction, wallet, retry)
  } else {
    return await prodTransactionAndWait(client, transaction, wallet, retry)
  }
}

/**
 * Sends a test transaction for integration testing.
 *
 * @param client - The XRPL client
 * @param transaction - The transaction object to send.
 * @param wallet - The wallet to send the transaction from.
 * @param retry - As of Sep 2022, xrpl.js does not track requests sent in parallel. Our sequence numbers can get off from
 *               the server's sequence numbers. This is a fix to retry the transaction if it fails due to tefPAST_SEQ.
 * @param retry.count - How many times the request should be retried.
 * @param retry.delayMs - How long to wait between retries.
 * @returns The response of the transaction.
 */
// eslint-disable-next-line max-params -- Test function, many params are needed
export async function testTransaction(
  client: Client,
  transaction: Transaction,
  wallet: Wallet,
  retry?: {
    hardFail: boolean | true
    count: number
    delayMs: number
  }
): Promise<TxResponse> {
  // Accept any un-validated changes.
  await ledgerAccept(client)

  // sign/submit the transaction

  const response = await submitTransaction({
    client,
    wallet,
    transaction,
    retry,
  })

  // check that the transaction was successful
  assert.equal(response.type, 'response')

  if (
    response.result.engine_result !== 'tesSUCCESS' &&
    response.result.engine_result !== 'tecHOOK_REJECTED'
  ) {
    // eslint-disable-next-line no-console -- See output
    appLogger.error(
      `Transaction was not successful. Expected response.result.engine_result to be tesSUCCESS but got ${response.result.engine_result}`
    )
    // eslint-disable-next-line no-console -- See output
    appLogger.error('The transaction was: ', transaction)
    // eslint-disable-next-line no-console -- See output
    appLogger.error('The response was: ', JSON.stringify(response))
  }

  if (retry?.hardFail && response.result.engine_result !== 'tecHOOK_REJECTED') {
    assert.equal(
      response.result.engine_result,
      'tesSUCCESS',
      response.result.engine_result_message
    )
  }

  // check that the transaction is on the ledger
  const signedTx = omit(response.result.tx_json, 'hash')
  await ledgerAccept(client)
  return await verifySubmittedTransaction(client, signedTx as Transaction)
  // return response
}

export async function prodTransactionAndWait(
  client: Client,
  transaction: Transaction,
  wallet: Wallet,
  retry?: {
    hardFail: boolean | true
    count: number
    delayMs: number
  }
): Promise<TxResponse> {
  // sign/submit the transaction

  const response = await client.submitAndWait(transaction, {
    autofill: true,
    wallet: wallet,
  })

  // check that the transaction was successful
  assert.equal(response.type, 'response')

  // check that the transaction was successful
  assert.equal(response.type, 'response')

  const meta = response.result.meta as TransactionMetadata
  const txResult = meta.TransactionResult
  if (txResult !== 'tesSUCCESS' && txResult !== 'tecHOOK_REJECTED') {
    // eslint-disable-next-line no-console -- See output
    appLogger.error(
      `Transaction was not successful. Expected response.result.engine_result to be tesSUCCESS but got ${txResult}`
    )
    // eslint-disable-next-line no-console -- See output
    appLogger.error('The transaction was: ', transaction)
    // eslint-disable-next-line no-console -- See output
    appLogger.error('The response was: ', JSON.stringify(response))
  }

  if (retry?.hardFail && txResult !== 'tecHOOK_REJECTED') {
    assert.equal(
      txResult,
      'tesSUCCESS',
      'response.result.engine_result_message'
    )
  }

  // check that the transaction is on the ledger
  return await verifySubmittedTransaction(
    client,
    '',
    response.result.hash as string
  )
  // return response
}
