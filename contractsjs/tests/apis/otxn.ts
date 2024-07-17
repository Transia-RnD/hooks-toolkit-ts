/* eslint-disable @typescript-eslint/no-unused-vars */

const sfAccount = 0x80001
const sfHookParameters = 0x0f013
const sfHookParameter = 0xe0017

const hexField = (arr) => {
  return arr
    .slice(1)
    .map((num) => num.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

// @ts-expect-error -- ignore
const Hook = (arg) => {
  trace('example.ts: Called.', false)

  const burden = otxn_burden()
  trace('burden', burden, false)

  const generation = otxn_generation()
  trace('generation', generation, false)

  const otxn_accid = otxn_field(sfAccount)
  trace('otxn_accid', otxn_accid, false)

  const tx_id = otxn_id(0)
  trace('tx_id', tx_id, false)

  const tx_type = otxn_type()
  trace('tx_type', tx_type, false)

  const tx_slot = otxn_slot(1)
  trace('tx_slot', tx_slot, false)

  const tx_param = otxn_param('CAFE')
  trace('tx_param', tx_param, false)

  const tx_json = otxn_json()
  trace('tx_json', tx_json, false)

  return accept('example.ts: Finished.', 18)
}

// ADD_JS_FUNCTION(otxn_burden, ctx): DONE
// ADD_JS_FUNCTION(otxn_generation, ctx): DONE
// ADD_JS_FUNCTION(otxn_field, ctx): DONE
// ADD_JS_FUNCTION(otxn_id, ctx): DONE
// ADD_JS_FUNCTION(otxn_type, ctx): DONE
// ADD_JS_FUNCTION(otxn_slot, ctx): DONE
// ADD_JS_FUNCTION(otxn_param, ctx): DONE
// ADD_JS_FUNCTION(otxn_json, ctx): DONE