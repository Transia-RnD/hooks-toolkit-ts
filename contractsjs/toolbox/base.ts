/* eslint-disable @typescript-eslint/no-unused-vars */
const Hook = (arg) => {
  trace('Base.ts: Called.', false)
  return accept('base.ts: Finished.', 18)
}

// REQUIRED FOR ESBUILD
export { Hook }
