/* eslint-disable @typescript-eslint/no-unused-vars */

import { sfAmount } from 'jshooks-api'

const Hook = (arg) => {
  trace('hookOnXah.ts: Called.', false)
  const amount = otxn_field(sfAmount) as number[]
  if (amount.length != 8) {
    return rollback('hookOnXah.ts: Ignoring non XAH Transaction.', 0)
  }

  return accept('hookOnXah.ts: Finished.', 0)
}

export { Hook }
