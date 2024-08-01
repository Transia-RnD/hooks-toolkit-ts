import { sfAccount } from 'jshooks-api'

const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const Hook = (arg) => {
  hook_again() // we're going to check in weak execution too

  const alice = otxn_field(sfAccount)
  ASSERT(alice.length === 20, 1)

  const key = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ]
  const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
  const data_read = state_foreign(key, key, alice as number[])
  ASSERT(data_read == 16, 2)

  for (let i = 0; i < 16; ++i) ASSERT(data[i] === data_read[i], 3)

  accept('', 0)
}

export { Hook }
