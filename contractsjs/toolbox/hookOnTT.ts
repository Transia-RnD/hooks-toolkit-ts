/* eslint-disable @typescript-eslint/no-unused-vars */

const Hook = (arg) => {
  trace('hookOnTT.ts: Called.', false)

  const tt = otxn_type()

  if (tt != 99) {
    return rollback('hookOnTT.ts: HookOn field is incorrectly set.', -37)
  }

  return accept('hookOnTT.ts: Finished.', 18)
}

export { Hook }
