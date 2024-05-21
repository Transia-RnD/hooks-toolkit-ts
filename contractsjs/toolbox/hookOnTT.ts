/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-expect-error -- ignore
const Hook = (arg) => {
  trace('hookOnTT.ts: Called.', false)

  // _g(1, 1)

  const tt = otxn_type()
  if (tt != ttINVOKE) {
    return rollback('hook_on_tt: HookOn field is incorrectly set.', -37)
  }

  return accept('hookOnTT.ts: Finished.', 18)
}
