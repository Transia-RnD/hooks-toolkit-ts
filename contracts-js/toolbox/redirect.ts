/* eslint-disable @typescript-eslint/no-unused-vars */

import { assert } from 'jshooks-api'
import { Payment } from '@transia/xahau-models'

const Hook = (arg) => {
  trace('redirect.ts: Called.', false)

  const hook_accid = assert(hook_account())
  const txn = otxn_json() as Payment
  const amount = txn.Amount

  etxn_reserve(1)

  const builtTxn: Payment = {
    TransactionType: 'Payment',
    Amount: amount,
    Destination: txn.Account,
    Account: util_raddr(hook_accid) as string,
  }

  const prepared = assert(prepare(builtTxn))
  const txHash = emit(prepared)
  if (txHash > 0) {
    return accept('redirect.ts: Tx emitted success.', 0)
  }

  return accept('redirect.ts: Tx emitted failure.', 0)
}

const Callback = (arg) => {
  trace('redirect.ts: Callback called.', false)
  return accept('redirect.ts: Callback success.', 0)
}

export { Hook, Callback }
