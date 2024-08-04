import {
  CANT_RETURN_NEGATIVE,
  INVALID_ARGUMENT,
  INVALID_FLOAT,
  TOO_BIG,
} from 'jshooks-api'

const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const Hook = (arg) => {
  ASSERT(float_int(undefined, 1, 1) === INVALID_ARGUMENT)
  ASSERT(float_int(1, undefined, 1) === INVALID_ARGUMENT)
  ASSERT(float_int(1, 1, undefined) === INVALID_ARGUMENT)

  // ensure invalid xfl are not accepted
  ASSERT(float_int(-1, 0, 0) === INVALID_FLOAT)

  // check 1
  ASSERT(float_int(float_one(), 0, 0) === 1)

  // check 1.23e-20 always returns 0 (too small to display)
  ASSERT(float_int(5729808726015270912n, 0, 0) === 0)
  ASSERT(float_int(5729808726015270912n, 15, 0) === 0)
  ASSERT(float_int(5729808726015270912n, 16, 0) === INVALID_ARGUMENT)

  ASSERT(float_int(float_one(), 15, 0) === 1000000000000000)
  ASSERT(float_int(float_one(), 14, 0) === 100000000000000)
  ASSERT(float_int(float_one(), 13, 0) === 10000000000000)
  ASSERT(float_int(float_one(), 12, 0) === 1000000000000)
  ASSERT(float_int(float_one(), 11, 0) === 100000000000)
  ASSERT(float_int(float_one(), 10, 0) === 10000000000)
  ASSERT(float_int(float_one(), 9, 0) === 1000000000)
  ASSERT(float_int(float_one(), 8, 0) === 100000000)
  ASSERT(float_int(float_one(), 7, 0) === 10000000)
  ASSERT(float_int(float_one(), 6, 0) === 1000000)
  ASSERT(float_int(float_one(), 5, 0) === 100000)
  ASSERT(float_int(float_one(), 4, 0) === 10000)
  ASSERT(float_int(float_one(), 3, 0) === 1000)
  ASSERT(float_int(float_one(), 2, 0) === 100)
  ASSERT(float_int(float_one(), 1, 0) === 10)
  ASSERT(float_int(float_one(), 0, 0) === 1)

  // normal upper limit on exponent
  ASSERT(float_int(6360317241828374919n, 0, 0) === 1234567981234567)

  // ask for one decimal above limit
  ASSERT(float_int(6360317241828374919n, 1, 0) === TOO_BIG)

  // ask for 15 decimals above limit
  ASSERT(float_int(6360317241828374919n, 15, 0) === TOO_BIG)

  // every combination for 1.234567981234567
  ASSERT(float_int(6090101264186145159n, 0, 0) === 1)
  ASSERT(float_int(6090101264186145159n, 1, 0) === 12)
  ASSERT(float_int(6090101264186145159n, 2, 0) === 123)
  ASSERT(float_int(6090101264186145159n, 3, 0) === 1234)
  ASSERT(float_int(6090101264186145159n, 4, 0) === 12345)
  ASSERT(float_int(6090101264186145159n, 5, 0) === 123456)
  ASSERT(float_int(6090101264186145159n, 6, 0) === 1234567)
  ASSERT(float_int(6090101264186145159n, 7, 0) === 12345679)
  ASSERT(float_int(6090101264186145159n, 8, 0) === 123456798)
  ASSERT(float_int(6090101264186145159n, 9, 0) === 1234567981)
  ASSERT(float_int(6090101264186145159n, 10, 0) === 12345679812)
  ASSERT(float_int(6090101264186145159n, 11, 0) === 123456798123)
  ASSERT(float_int(6090101264186145159n, 12, 0) === 1234567981234)
  ASSERT(float_int(6090101264186145159n, 13, 0) === 12345679812345)
  ASSERT(float_int(6090101264186145159n, 14, 0) === 123456798123456)
  ASSERT(float_int(6090101264186145159n, 15, 0) === 1234567981234567)

  // same with absolute parameter
  ASSERT(float_int(1478415245758757255n, 0, 1) === 1)
  ASSERT(float_int(1478415245758757255n, 1, 1) === 12)
  ASSERT(float_int(1478415245758757255n, 2, 1) === 123)
  ASSERT(float_int(1478415245758757255n, 3, 1) === 1234)
  ASSERT(float_int(1478415245758757255n, 4, 1) === 12345)
  ASSERT(float_int(1478415245758757255n, 5, 1) === 123456)
  ASSERT(float_int(1478415245758757255n, 6, 1) === 1234567)
  ASSERT(float_int(1478415245758757255n, 7, 1) === 12345679)
  ASSERT(float_int(1478415245758757255n, 8, 1) === 123456798)
  ASSERT(float_int(1478415245758757255n, 9, 1) === 1234567981)
  ASSERT(float_int(1478415245758757255n, 10, 1) === 12345679812)
  ASSERT(float_int(1478415245758757255n, 11, 1) === 123456798123)
  ASSERT(float_int(1478415245758757255n, 12, 1) === 1234567981234)
  ASSERT(float_int(1478415245758757255n, 13, 1) === 12345679812345)
  ASSERT(float_int(1478415245758757255n, 14, 1) === 123456798123456)
  ASSERT(float_int(1478415245758757255n, 15, 1) === 1234567981234567)

  // neg xfl sans absolute parameter
  ASSERT(float_int(1478415245758757255n, 15, 0) === CANT_RETURN_NEGATIVE)

  // 1.234567981234567e-16
  ASSERT(float_int(5819885286543915399n, 15, 0) === 1)
  for (let i = 1; i < 15; ++i)
    ASSERT(float_int(5819885286543915399n, i, 0) === 0)

  accept('', 0)
}

export { Hook }
