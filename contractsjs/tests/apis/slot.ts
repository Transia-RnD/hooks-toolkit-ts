/* eslint-disable @typescript-eslint/no-unused-vars */

const sfHookParameters = 0xf0013
const sfHookParameter = 0x70018

// @ts-expect-error -- ignore
const Hook = (arg) => {
  trace('example.ts: Called.', false)

  const tx_slot = otxn_slot(1)
  trace('tx_slot', tx_slot, false)

  const _slot = slot(1)
  trace('_slot', _slot, false)

  // TODO
  // const _slot_set = slot_set('CAFE', 1)
  // trace('_slot_set', _slot_set, false)

  const _slot_size = slot_size(1)
  trace('_slot_size', _slot_size, false)

  const _slot_subfield_array = slot_subfield(1, sfHookParameters, 2)
  trace('_slot_subfield_array', _slot_subfield_array, false)

  const _slot_subarray = slot_subarray(2, 0, 3)
  trace('_slot_subarray', _slot_subarray, false)

  const _slot_count = slot_count(2)
  trace('_slot_count', _slot_count, false)

  const _slot_subfield = slot_subfield(3, sfHookParameter, 4)
  trace('_slot_subfield', _slot_subfield, false)

  const _slot_type = slot_type(4, 0)
  trace('_slot_type', _slot_type, false)

  const _slot_float = slot_float(1)
  trace('_slot_float', _slot_float, false)

  const _slot_clear = slot_clear(1)
  trace('_slot_clear', _slot_clear, false)

  return accept('example.ts: Finished.', 18)
}

// ADD_JS_FUNCTION(slot, ctx): DONE
// ADD_JS_FUNCTION(slot_clear, ctx): DONE
// ADD_JS_FUNCTION(slot_count, ctx): DONE
// ADD_JS_FUNCTION(slot_set, ctx): DONE
// ADD_JS_FUNCTION(slot_size, ctx): DONE
// ADD_JS_FUNCTION(slot_subarray, ctx): DONE
// ADD_JS_FUNCTION(slot_subfield, ctx): DONE
// ADD_JS_FUNCTION(slot_type, ctx): DONE
// ADD_JS_FUNCTION(slot_float, ctx): DONE
