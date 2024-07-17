const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const INVALID_ARGUMENT = -7
const INVALID_FLOAT = -10024

const EQ = 0b001
const LT = 0b010
const GT = 0b100
const LTE = 0b011
const GTE = 0b101
const NEQ = 0b110

const Hook = (arg) => {
  // test invalid floats
  {
    ASSERT(float_compare(-1, -2, EQ) == INVALID_FLOAT)
    ASSERT(float_compare(0, -2, EQ) == INVALID_FLOAT)
    ASSERT(float_compare(-1, 0, EQ) == INVALID_FLOAT)
  }

  // test invalid flags
  {
    // flag 8 doesnt exist
    ASSERT(float_compare(0, 0, 0b1000) == INVALID_ARGUMENT)
    // flag 16 doesnt exist
    ASSERT(float_compare(0, 0, 0b10000) == INVALID_ARGUMENT)
    // every flag except the valid ones
    ASSERT(float_compare(0, 0, ~0b111) == INVALID_ARGUMENT)
    // all valid flags combined is invalid too
    ASSERT(float_compare(0, 0, 0b111) == INVALID_ARGUMENT)
    // no flags is also invalid
    ASSERT(float_compare(0, 0, 0) == INVALID_ARGUMENT)
  }

  // test logic
  {
    ASSERT(float_compare(0, 0, EQ))
    ASSERT(float_compare(0, float_one(), LT))
    ASSERT(float_compare(0, float_one(), GT) == 0)
    ASSERT(float_compare(0, float_one(), GTE) == 0)
    ASSERT(float_compare(0, float_one(), LTE))
    ASSERT(float_compare(0, float_one(), NEQ))

    const large_negative = 1622844335003378560 /* -154846915           */
    const small_negative = 1352229899321148800 /* -1.15001111e-7       */
    const small_positive = 5713898440837102138 /* 3.33411333131321e-21 */
    const large_positive = 7749425685711506120 /* 3.234326634253e+92   */

    // large negative < small negative
    ASSERT(float_compare(large_negative, small_negative, LT))
    ASSERT(float_compare(large_negative, small_negative, LTE))
    ASSERT(float_compare(large_negative, small_negative, NEQ))
    ASSERT(float_compare(large_negative, small_negative, GT) == 0)
    ASSERT(float_compare(large_negative, small_negative, GTE) == 0)
    ASSERT(float_compare(large_negative, small_negative, EQ) == 0)

    // large_negative < large positive
    ASSERT(float_compare(large_negative, large_positive, LT))
    ASSERT(float_compare(large_negative, large_positive, LTE))
    ASSERT(float_compare(large_negative, large_positive, NEQ))
    ASSERT(float_compare(large_negative, large_positive, GT) == 0)
    ASSERT(float_compare(large_negative, large_positive, GTE) == 0)
    ASSERT(float_compare(large_negative, large_positive, EQ) == 0)

    // small_negative < small_positive
    ASSERT(float_compare(small_negative, small_positive, LT))
    ASSERT(float_compare(small_negative, small_positive, LTE))
    ASSERT(float_compare(small_negative, small_positive, NEQ))
    ASSERT(float_compare(small_negative, small_positive, GT) == 0)
    ASSERT(float_compare(small_negative, small_positive, GTE) == 0)
    ASSERT(float_compare(small_negative, small_positive, EQ) == 0)

    // small positive < large positive
    ASSERT(float_compare(small_positive, large_positive, LT))
    ASSERT(float_compare(small_positive, large_positive, LTE))
    ASSERT(float_compare(small_positive, large_positive, NEQ))
    ASSERT(float_compare(small_positive, large_positive, GT) == 0)
    ASSERT(float_compare(small_positive, large_positive, GTE) == 0)
    ASSERT(float_compare(small_positive, large_positive, EQ) == 0)

    // small negative < 0
    ASSERT(float_compare(small_negative, 0, LT))

    // large negative < 0
    ASSERT(float_compare(large_negative, 0, LT))

    // small positive > 0
    ASSERT(float_compare(small_positive, 0, GT))

    // large positive > 0
    ASSERT(float_compare(large_positive, 0, GT))
  }

  accept('', 0)
}

export { Hook }
