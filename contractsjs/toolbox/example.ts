const ASSERT = (x, code) => {
  if (!x) {
    trace('error', 0, false)
    rollback(x.toString(), code)
  }
}

const toHex = (a) => {
  return a
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

const sfTransactionType = 0x10002

const Hook = (arg) => {
  ASSERT(otxn_slot(1) === 1)

  ASSERT(slot_subfield(1, sfTransactionType, 2) === 2)

  const tt = slot(2)
  // [0, 99]

  ASSERT(tt[1] === otxn_type())
  ASSERT(parseInt(toHex(tt), 16) === otxn_type())

  accept('', 0)
}

// REQUIRED FOR ESBUILD
export { Hook }
