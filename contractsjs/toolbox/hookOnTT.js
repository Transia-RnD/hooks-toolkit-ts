// eslint-disable-next-line @typescript-eslint/no-var-requires

const Hook = (arg) => {
  trace('HookOnTT.js: Called.', false)

  // _g(1, 1)

  const tt = otxn_type()
  if (tt != 99) {
    return rollback('hook_on_tt: HookOn field is incorrectly set.', -37)
  }

  return accept('HookOnTT.js: Finished.', 13)
}
