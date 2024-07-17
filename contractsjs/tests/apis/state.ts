/* eslint-disable @typescript-eslint/no-unused-vars */

// @ts-expect-error -- ignore
const Hook = (arg) => {
  trace('example.ts: Called.', false)

  const _state = state('CAFE')
  trace('_state', _state, false)

  const _state_set = state_set('CAFE', 'DEADBEEF')
  trace('_state_set', _state_set, false)

  const _state_foreign = state_foreign(
    'CAFE',
    'CAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFE',
    // @ts-expect-error -- should typecase hash == number[]
    hook_accid
  )
  trace('_state_foreign', _state_foreign, false)

  const _state_foreign_set = state_foreign_set(
    'CAFE',
    'DEADBEEF',
    'CAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFE',
    // @ts-expect-error -- should typecase hash == number[]
    hook_accid
  )
  trace('_state_foreign_set', _state_foreign_set, false)

  return accept('example.ts: Finished.', 18)
}

// ADD_JS_FUNCTION(state, ctx): DONE
// ADD_JS_FUNCTION(state_foreign, ctx): DONE
// ADD_JS_FUNCTION(state_set, ctx): DONE
// ADD_JS_FUNCTION(state_foreign_set, ctx): DONE
