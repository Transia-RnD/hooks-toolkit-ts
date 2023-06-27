import { Transaction } from '@transia/xrpl'

export class iHookEmittedTxs {
  txs: Transaction[]

  constructor(results: Transaction[]) {
    this.txs = results.map((emtx) => emtx)
  }
}
