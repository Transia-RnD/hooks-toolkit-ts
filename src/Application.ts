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
  testTransaction,
} from './libs/xrpl-helpers/transaction'
import { SmartContractParams } from './types'

export class Application {
  // TX V3
  static async testHookTx(client: Client, params: SmartContractParams) {
    if (!params.tx) {
      throw Error('Missing tx parameter')
    }
    const builtTx = params.tx as Transaction
    await prepareTransactionV3(client, builtTx)
    console.log(JSON.stringify(builtTx))

    // @ts-expect-error - invoke is tx
    validate(builtTx)
    const txResponse = await testTransaction(client, builtTx, params.wallet, {
      hardFail: false,
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
      throw Error(hookExecutions.executions[0].HookReturnString)
    }
    return txResponse?.result
  }
}
