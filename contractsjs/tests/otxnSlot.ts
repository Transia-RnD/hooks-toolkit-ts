const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const INVALID_ARGUMENT = -7
const NO_FREE_SLOTS = -6

const Hook = (arg) => {
  ASSERT(otxn_slot(256) === INVALID_ARGUMENT, 1)

  ASSERT(otxn_slot(1) === 1, 2)

  const id = otxn_id(0)
  ASSERT(id.length === 32, 1)

  ASSERT(otxn_slot(1) === 1, 3)

  const buf = slot(1)
  const size = buf.length

  ASSERT(size > 0, 4)
  buf.unshift(0)
  buf.unshift(0x4e)
  buf.unshift(0x58)
  buf.unshift(0x54)

  const hash = util_sha512h(buf)
  ASSERT(hash.length === 32, 5)

  for (let i = 0; i < 32; ++i) ASSERT(hash[i] === id[i], 6)

  // slot exhaustion
  for (let i = 0; i < 254; ++i) ASSERT(otxn_slot(0) > 0, 7)

  ASSERT(otxn_slot(0) == NO_FREE_SLOTS, 8)

  accept('', 0)
}

export { Hook }
