import { INVALID_ARGUMENT, INVALID_FLOAT } from 'jshooks-api'

const ASSERT = (x) => {
  if (!x) {
    rollback('ASSERT.error', 0)
  }
}

const Hook = (arg) => {
  ASSERT(float_set(undefined, 0) === INVALID_ARGUMENT)
  ASSERT(float_set(0, undefined) === INVALID_ARGUMENT)
  ASSERT(float_set(2147483648, 0) === INVALID_ARGUMENT)

  // zero mantissa should return canonical zero
  ASSERT(float_set(-5, 0) === 0)
  ASSERT(float_set(50, 0) === 0)
  ASSERT(float_set(-50, 0) === 0)
  ASSERT(float_set(0, 0) === 0)

  // an exponent lower than -96 should produce an invalid float error
  ASSERT(float_set(-97, 1) === INVALID_FLOAT)

  // an exponent larger than +96 should produce an invalid float error
  ASSERT(float_set(+97, 1) === INVALID_FLOAT)

  ASSERT(float_set(-5, 6541432897943971n) === 6275552114197674403n)
  ASSERT(float_set(-83, 7906202688397446n) === 4871793800248533126n)
  ASSERT(float_set(76, 4760131426754533n) === 7732937091994525669n)
  ASSERT(float_set(37, -8019384286534438n) === 2421948784557120294n)
  ASSERT(float_set(50, 5145342538007840n) === 7264947941859247392n)
  ASSERT(float_set(-70, 4387341302202416n) === 5102462119485603888n)
  ASSERT(float_set(-26, -1754544005819476n) === 1280776838179040340n)
  ASSERT(float_set(36, 8261761545780560n) === 7015862781734272336n)
  ASSERT(float_set(35, 7975622850695472n) === 6997562244529705264n)
  ASSERT(float_set(17, -4478222822793996n) === 2058119652903740172n)
  ASSERT(float_set(-53, 5506604247857835n) === 5409826157092453035n)
  ASSERT(float_set(-60, 5120164869507050n) === 5283338928147728362n)
  ASSERT(float_set(41, 5176113875683063n) === 7102849126611584759n)
  ASSERT(float_set(-54, -3477931844992923n) === 778097067752718235n)
  ASSERT(float_set(21, 6345031894305479n) === 6743730074440567495n)
  ASSERT(float_set(-23, 5091583691147091n) === 5949843091820201811n)
  ASSERT(float_set(-33, 7509684078851678n) === 5772117207113086558n)
  ASSERT(float_set(-72, -1847771838890268n) === 452207734575939868n)
  ASSERT(float_set(71, -9138413713437220n) === 3035557363306410532n)
  ASSERT(float_set(28, 4933894067102586n) === 6868419726179738490n)

  accept('', 0)
}

export { Hook }
