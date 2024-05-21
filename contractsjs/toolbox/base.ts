/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-expect-error -- ignore
const Hook = (arg) => {
  trace('Base.ts: Called.', false)

  // _g(1, 1)

  accept('base.ts: Finished.', 18)
  return 0
}
