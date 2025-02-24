const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const Hook = (arg) => {
  hook_again() // we're going to check in weak execution too

  const key = [0xff]
  const data = [0xff, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
  ASSERT(state_set(data, key) === 16, 2)

  accept('', 0)
}

export { Hook }
