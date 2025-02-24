const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const INVALID_ARGUMENT = -7
const INVALID_FLOAT = -10024

const Hook = (arg) => {
  ASSERT(float_negate(undefined) === INVALID_ARGUMENT)

  // test invalid floats
  {
    ASSERT(float_negate(-1) === INVALID_FLOAT)
    ASSERT(float_negate(-11010191919n) === INVALID_FLOAT)
  }

  // test canonical zero
  ASSERT(float_negate(0) === 0)

  // test double negation
  {
    ASSERT(float_negate(float_one()) !== float_one())
    ASSERT(float_negate(float_negate(float_one())) === float_one())
  }

  // test random numbers
  {
    // +/- 3.463476342523e+22
    ASSERT(float_negate(6488646939756037240n) === 1876960921328649336n)

    ASSERT(float_negate(float_one()) === 1478180677777522688n)

    ASSERT(float_negate(1838620299498162368n) === 6450306317925550272n)
  }
  accept('', 0)
}

export { Hook }
