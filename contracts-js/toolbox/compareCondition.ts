import {
  sfAccount,
  assert,
  encodeString,
  DOESNT_EXIST,
  arrayEqual,
} from 'jshooks-api'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const Hook = (arg: any) => {
  trace('compareCondition.js: Called.', false)

  const accountBuffer = assert(otxn_field(sfAccount))

  const stateCondition = state(accountBuffer)

  if (typeof stateCondition === 'number' && stateCondition === DOESNT_EXIST) {
    const paramCondition = assert(otxn_param(encodeString('C')))
    state_set(paramCondition, accountBuffer)
    return accept('compareCondition.js: Condition Added.', 0)
  }

  const fulfillment = assert(otxn_param(encodeString('F')))

  const hashOut = assert(util_sha512h(fulfillment))

  if (!arrayEqual(stateCondition as number[], hashOut)) {
    rollback('compareCondition.js: Verification Failed.', 0)
  }

  return accept('compareCondition.js: Verification Success.', 0)
}

export { Hook }
