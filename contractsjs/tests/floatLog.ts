import { COMPLEX_NOT_SUPPORTED, INVALID_ARGUMENT } from 'jshooks-api'

const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const Hook = (arg) => {
  // invalid argument
  ASSERT(float_log(undefined) === INVALID_ARGUMENT)

  // check 0 is not allowed
  if (float_log(0) !== INVALID_ARGUMENT) rollback('false', 0)

  // log10( 846513684968451 ) = 14.92763398342338
  ASSERT(float_log(6349533412187342878n) === 6108373858112734914n)

  // log10 ( -1000 ) = invalid (complex not supported)
  if (float_log(1532223873305968640n) !== COMPLEX_NOT_SUPPORTED)
    rollback('false', 0)

  // log10 (1000) == 3
  ASSERT(float_log(6143909891733356544n) === 6091866696204910592n)

  // log10 (0.112381) == -0.949307107740766
  ASSERT(float_log(6071976107695428608n) === 1468659350345448364n)

  // log10 (0.00000000000000001123) = -16.94962024373854221
  ASSERT(float_log(5783744921543716864n) === 1496890038311378526n)

  // log10 (100000000000000000000000000000000000000000000000000000000000000) = 62
  ASSERT(float_log(7206759403792793600n) === 6113081094714392576n)

  accept('', 0)
}

export { Hook }
