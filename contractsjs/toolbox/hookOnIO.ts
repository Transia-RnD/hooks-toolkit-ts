/* eslint-disable @typescript-eslint/no-unused-vars */

import { arrayEqual, sfAccount } from 'jshooks-api'

const Hook = (arg) => {
  trace('hookOnTT.ts: Called.', false)

  const hook_accid = hook_account()
  const otxn_accid = otxn_field(sfAccount)
  if (arrayEqual(hook_accid as number[], otxn_accid as number[])) {
    return rollback('hookOnIO.ts: Incoming.', 0)
  }

  return accept('hookOnIO.ts: Finished.', 0)
}

export { Hook }
