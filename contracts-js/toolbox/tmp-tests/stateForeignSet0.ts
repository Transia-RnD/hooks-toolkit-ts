const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}
const sfInvoiceID = 327697
const INVALID_ARGUMENT = -7
const a = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
]
const ba = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1,
]
const sa = [1]
const ha = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1,
]
const Hook = (arg) => {
  // Key
  ASSERT(state_foreign_set(a, [], a, hook_account()) === INVALID_ARGUMENT, 1)
  ASSERT(state_foreign_set(a, '', a, hook_account()) === INVALID_ARGUMENT, 2)

  // Namespace
  ASSERT(state_foreign_set(a, a, null, hook_account()) === 32, 3) // Uses Hook Namespace
  ASSERT(state_foreign_set(a, a, 0, hook_account()) === 32, 4) // Uses Hook Namespace
  ASSERT(state_foreign_set(a, a, undefined, hook_account()) === 32, 5) // Uses Hook Namespace
  ASSERT(state_foreign_set(a, a, [], hook_account()) === 32, 6) // Uses Hook Namespace
  ASSERT(state_foreign_set(a, a, '', hook_account()) === 32, 7) // Uses Hook Namespace
  ASSERT(state_foreign_set(a, a, ba, hook_account()) === 32, 8) // Uses Hook Namespace
  ASSERT(state_foreign_set(a, a, sa, hook_account()) === INVALID_ARGUMENT, 9)

  // AccountID
  ASSERT(state_foreign_set(a, a, a, null) === 32, 10) // Uses Hook AccountID
  ASSERT(state_foreign_set(a, a, a, 0) === 32, 11) // Uses Hook AccountID
  ASSERT(state_foreign_set(a, a, a, undefined) === 32, 12) // Uses Hook AccountID
  ASSERT(state_foreign_set(a, a, a, []) === 32, 13) // Uses Hook AccountID
  ASSERT(state_foreign_set(a, a, a, '') === 32, 14) // Uses Hook AccountID
  ASSERT(state_foreign_set(a, a, a, ba) === 32, 15) // Uses Hook AccountID
  ASSERT(state_foreign_set(a, a, a, sa) === INVALID_ARGUMENT, 16)

  // Delete
  ASSERT(state_foreign_set(null, a, a, hook_account()) === 0, 17)
  ASSERT(state_foreign_set(0, a, a, hook_account()) === 0, 18)
  ASSERT(state_foreign_set(undefined, a, a, hook_account()) === 0, 19)
  ASSERT(state_foreign_set('', a, a, hook_account()) === 0, 20)
  ASSERT(state_foreign_set([], a, a, hook_account()) === 0, 21)
  ASSERT(state_foreign_set(ha, a, a, hook_account()) === 0, 22)
  const txn = otxn_id(0)
  ASSERT(txn.length === 32, 23)
  const grantor = otxn_field(sfInvoiceID)
  ASSERT(grantor.length === 32, 24)
  const one = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1,
  ]
  const zero = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ]
  trace('grantor', grantor.slice(12), false)
  ASSERT(state_foreign_set(txn, one, zero, grantor.slice(12)) == 32, 25)
  accept('', 0)
}

export { Hook }
