const ASSERT = (x) => {
  if (!x) {
    rollback('ASSERT.error', 0)
  }
}

const INVALID_ARGUMENT = -7
const COMPLEX_NOT_SUPPORTED = -39

const Hook = (arg) => {
  ASSERT(float_root(undefined, 0) === INVALID_ARGUMENT)
  ASSERT(float_root(0, undefined) === INVALID_ARGUMENT)
  // ASSERT(float_root(0, 21337) === INVALID_ARGUMENT)

  ASSERT(float_root(float_one(), 2), float_one())

  // sqrt 9 is 3
  ASSERT(float_root(6097866696204910592n, 2) === 6091866696204910592n)

  // cube root of 1000 is 10
  ASSERT(float_root(6143909891733356544n, 3) === 6098866696204910590n)

  // sqrt of negative is "complex not supported error"
  ASSERT(float_root(1478180677777522688n, 2) === COMPLEX_NOT_SUPPORTED)

  // tenth root of 0 is 0
  ASSERT(float_root(0, 10) === 0)

  accept('', 0)
}

export { Hook }
