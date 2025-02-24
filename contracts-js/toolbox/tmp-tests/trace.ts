const ASSERT = (x, code) => {
  if (!x) {
    rollback(x.toString(), code)
  }
}

const Hook = (arg) => {
  ASSERT(trace('', 0, false) === 0)
  ASSERT(trace('', [18], true) === 0)

  accept('', 0)
}
