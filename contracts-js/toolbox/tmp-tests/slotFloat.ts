const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const DOESNT_EXIST = -5
const NOT_AN_AMOUNT = -32
const sfFee = 0x60008

const Hook = (arg) => {
  ASSERT(otxn_slot(1) === 1, 1)

  ASSERT(slot_size(1) > 0, 2)

  ASSERT(slot_subfield(1, sfFee, 2) === 2, 3)

  ASSERT(slot_size(2) > 0, 4)

  ASSERT(slot_float(0) === DOESNT_EXIST, 5)

  ASSERT(slot_float(1) === NOT_AN_AMOUNT, 6)

  const xfl = slot_float(2)
  ASSERT(xfl > 0, 7)

  ASSERT(float_int(xfl, 6, 0) === 1000000, 8)

  accept('', 0)
}

export { Hook }
