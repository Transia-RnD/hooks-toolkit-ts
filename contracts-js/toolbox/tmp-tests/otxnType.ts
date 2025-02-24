const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const sfTransactionType = 0x10002

const Hook = (arg) => {
  ASSERT(otxn_slot(1) === 1, 1)

  ASSERT(slot_subfield(1, sfTransactionType, 2) === 2, 2)

  const tt = slot(2, true)

  ASSERT(tt === otxn_type(), 3)

  accept('', 0)
}

export { Hook }
