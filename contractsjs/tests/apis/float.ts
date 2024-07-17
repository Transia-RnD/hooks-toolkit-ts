/* eslint-disable @typescript-eslint/no-unused-vars */

const sfAccount = 0x80001
const sfHookParameters = 0x0f013
const sfHookParameter = 0xe0017

function arrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

// @ts-expect-error -- ignore
const Hook = (arg) => {
  trace('example.ts: Called.', false)

  const acc1 = hook_account()
  const acc = [
    109, 249, 14, 202, 43, 92, 11, 69, 170, 46, 29, 110, 153, 59, 247, 217, 220,
    178, 38, 179,
  ]
  trace('equal', arrayEqual(acc, acc1), false)
  trace('acc1', acc1, false)
  trace('acc', acc, false)

  trace('equal-xfl', 6089866696204910592 == 6089866696204910592, false)
  trace('equal-xlf1', float_one() == 6089866696204910592, false)

  const _float_set = float_set(-5, 6541432897943971)
  trace('_float_set', _float_set, false)
  // 6275552114197674403

  const _float_multiply = float_multiply(float_one(), 6090866696204910592)
  trace('_float_multiply', _float_multiply, false)
  // 6090866696204910592

  const _float_mulratio = float_mulratio(3189548536178311168, 0, 1, 1)
  trace('_float_mulratio', _float_mulratio, false)
  // 3189548536178311168

  const _float_negate = float_negate(float_one())
  trace('_float_negate', _float_negate, false)
  // 1478180677777522688

  const _float_compare = float_compare(float_one(), 6089866696204910592, 1)
  trace('_float_compare', _float_compare, false)
  // 1

  const _float_sum = float_sum(6165492090242838528, 6074309077695428608)
  trace('_float_sum', _float_sum, false)
  // 6165492124810638528

  // const _float_sto = float_sto(5)
  // trace('_float_sto', _float_sto, false)

  // const _float_sto_set = float_sto_set(5)
  // trace('_float_sto_set', _float_sto_set, false)

  const _float_invert = float_invert(6107881094714392576)
  trace('_float_invert', _float_invert, false)
  // 6071852297695428608

  const _float_divide = float_divide(6234216452170766464, 6144532891733356544)
  trace('_float_divide', _float_divide, false)
  // 6168530993200328528

  const _float_one = float_one()
  trace('_float_one', _float_one, false)
  // 6090866696204910592

  const _float_mantissa = float_mantissa(float_one())
  trace('_float_mantissa', _float_mantissa, false)
  // 1000000000000000

  const _float_sign = float_sign(float_one())
  trace('_float_sign', _float_sign, false)
  // 0

  const _float_int = float_int(float_one(), 6, 0)
  trace('_float_int', _float_int, false)
  // 1000000

  const _float_compare1 = float_compare(
    6089866696204910592,
    6089866696204910592,
    1
  )
  trace('_float_compare1', _float_compare1, false)
  // 1

  const _float_log = float_log(6143909891733356544)
  trace('_float_log', _float_log, false)
  // 6091866696204910592

  const _float_root = float_root(6097866696204910592, 2)
  trace('_float_root', _float_root, false)
  // 6091866696204910592

  return accept('example.ts: Finished.', 18)
}

// ADD_JS_FUNCTION(float_set, ctx)
// ADD_JS_FUNCTION(float_multiply, ctx)
// ADD_JS_FUNCTION(float_mulratio, ctx)
// ADD_JS_FUNCTION(float_negate, ctx)
// ADD_JS_FUNCTION(float_compare, ctx)
// ADD_JS_FUNCTION(float_sum, ctx)
// ADD_JS_FUNCTION(float_sto, ctx)
// ADD_JS_FUNCTION(float_sto_set, ctx)
// ADD_JS_FUNCTION(float_invert, ctx)
// ADD_JS_FUNCTION(float_divide, ctx)
// ADD_JS_FUNCTION(float_one, ctx)
// ADD_JS_FUNCTION(float_mantissa, ctx)
// ADD_JS_FUNCTION(float_sign, ctx)
// ADD_JS_FUNCTION(float_int, ctx)
// ADD_JS_FUNCTION(float_log, ctx)
// ADD_JS_FUNCTION(float_root, ctx)
