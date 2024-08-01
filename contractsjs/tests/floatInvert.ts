import { DIVISION_BY_ZERO, INVALID_ARGUMENT, INVALID_FLOAT } from 'jshooks-api'

const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const Hook = (arg) => {
  // invalid argument
  ASSERT(float_invert(undefined) === INVALID_ARGUMENT)

  // divide by 0
  ASSERT(float_invert(0) === DIVISION_BY_ZERO)

  // ensure invalid xfl are not accepted
  ASSERT(float_invert(-1) === INVALID_FLOAT)

  // check 1
  ASSERT(float_invert(float_one()) === float_one())

  // 1 / 10 = 0.1
  ASSERT(float_invert(6107881094714392576n) === 6071852297695428608n)

  // 1 / 123 = 0.008130081300813009
  ASSERT(float_invert(6126125493223874560n) === 6042953581977277640n)

  // 1 / 1234567899999999 = 8.100000008100007e-16
  ASSERT(float_invert(6360317241747140351n) === 5808736320061298978n)

  // 1/ 1*10^-81 = 10**81
  ASSERT(float_invert(4630700416936869888n) === 7549032975472951296n)

  accept('', 0)
}

export { Hook }
