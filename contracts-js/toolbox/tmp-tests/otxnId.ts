const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const Hook = (arg) => {
  const id = otxn_id(0)
  ASSERT(id.length === 32, 1)

  // slot the otxn then generate a canonical hash over it
  ASSERT(otxn_slot(1) === 1, 2)

  const buf = slot(1)
  const size = buf.length

  ASSERT(size > 0, 3)
  buf.unshift(0)
  buf.unshift(0x4e)
  buf.unshift(0x58)
  buf.unshift(0x54)

  const hash = util_sha512h(buf)
  ASSERT(hash.length === 32, 4)

  for (let i = 0; i < 32; ++i) ASSERT(hash[i] === id[i], 5)

  // RH TODO: test the flags = 1 on emitted txn

  accept('', 0)
}

export { Hook }
