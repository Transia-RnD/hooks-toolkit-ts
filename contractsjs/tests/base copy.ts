import { INVALID_ARGUMENT, INVALID_FLOAT } from 'jshooks-api'

const ASSERT = (x) => {
  if (!x) {
    rollback('ASSERT.error', 0)
  }
}

const Hook = (arg) => {
  ASSERT(float_sign(undefined) === INVALID_ARGUMENT)

  // test invalid floats
  {
    ASSERT(float_sign(-1) === INVALID_FLOAT)
    ASSERT(float_sign(-11010191919n) === INVALID_FLOAT)
  }

  // test canonical zero
  ASSERT(float_sign(0) === 0n)

  // test one
  ASSERT(float_sign(float_one()) === 0n)
  ASSERT(float_sign(float_negate(float_one())) === 1n)

  // test random numbers
  ASSERT(float_sign(7248434512952957686n /* 6.646312141200119e+64 */) === 0n)
  ASSERT(float_sign(889927818394811978n /* -7.222291430194763e-33 */) === 1n)
  ASSERT(float_sign(5945816149233111421n /* 1.064641104056701e-8 */) === 0n)
  ASSERT(float_sign(6239200145838704863n /* 621826155.7938399 */) === 0n)
  ASSERT(float_sign(6992780785042190360n /* 3.194163363180568e+50 */) === 0n)
  ASSERT(float_sign(6883099933108789087n /* 1.599702486671199e+44 */) === 0n)
  ASSERT(float_sign(890203738162163464n /* -7.498211197546248e-33 */) === 1n)
  ASSERT(float_sign(4884803073052080964n /* 2.9010769824633e-67 */) === 0n)
  ASSERT(float_sign(2688292350356944394n /* -4.146972444128778e+67 */) === 1n)
  ASSERT(float_sign(4830109852288093280n /* 2.251051746921568e-70 */) === 0n)
  ASSERT(float_sign(294175951907940320n /* -5.945575756228576e-66 */) === 1n)
  ASSERT(float_sign(7612037404955382316n /* 9.961233953985069e+84 */) === 0n)
  ASSERT(float_sign(7520840929603658997n /* 8.83675114967167e+79 */) === 0n)
  ASSERT(float_sign(4798982086157926282n /* 7.152082635718538e-72 */) === 0n)
  ASSERT(float_sign(689790136568817905n /* -5.242993208502513e-44 */) === 1n)
  ASSERT(float_sign(5521738045011558042n /* 9.332101110070938e-32 */) === 0n)
  ASSERT(float_sign(728760820583452906n /* -8.184880204173546e-42 */) === 1n)
  ASSERT(float_sign(2272937984362856794n /* -3.12377216812681e+44 */) === 1n)
  ASSERT(float_sign(1445723661896317830n /* -0.0457178113775911 */) === 1n)
  ASSERT(float_sign(5035721527359772724n /* 9.704343214299189e-59 */) === 0n)

  accept('', 0)
}

export { Hook }
