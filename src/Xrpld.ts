/*
Contains the operations that can are performed by the application.
*/
import {
  Client,
  Transaction,
  TransactionMetadata,
  validate,
} from '@transia/xrpl'
import { ExecutionUtility } from './keylet-utils'
import {
  prepareTransactionV3,
  appTransaction,
} from './libs/xrpl-helpers/transaction'
import { SmartContractParams } from './types'
import { appLogger } from './libs/logger'

export class Xrpld {
  // TX V3
  static async submit(client: Client, params: SmartContractParams) {
    if (!params.tx) {
      throw Error('Missing tx parameter')
    }
    const builtTx = params.tx as Transaction
    await prepareTransactionV3(client, builtTx)
    appLogger.debug(JSON.stringify(builtTx))

    // @ts-expect-error - invoke is tx
    validate(builtTx)
    const txResponse = await appTransaction(client, builtTx, params.wallet, {
      hardFail: true,
      count: 1,
      delayMs: 1000,
    })
    // @ts-expect-error - this is defined
    const txResult = txResponse?.result?.meta?.TransactionResult
    if (txResult === 'tecHOOK_REJECTED') {
      const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
        client,
        txResponse?.result?.meta as TransactionMetadata
      )
      if (hookExecutions.executions.length === 1) {
        throw Error(hookExecutions.executions[0].HookReturnString)
      }
      throw Error(JSON.stringify(hookExecutions.executions))
    }
    return txResponse?.result
  }
}
