const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const Hook = (arg) => {
  // create state 1
  const key = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ]
  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
  const data_read = state(key)
  ASSERT(data_read === 16, 31)

  for (let i = 0; i < 16; ++i) ASSERT(data[i] === data_read[i], 32)

  accept('', 0)
}

export { Hook }
