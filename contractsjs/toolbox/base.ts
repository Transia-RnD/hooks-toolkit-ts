const ASSERT = (x, line, code) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), code)
  }
}

const sfInvoiceID = 0x50011
const INTERNAL_ERROR = -2
const INVALID_ARGUMENT = -7
const SHOULD_FAIL = 32

const Hook = (arg) => {
  const a = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
  ]
  const aa = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  const ba = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
  ]
  const sa = [1]

  // let value
  // !key_in.has_value() || key_in->empty()
  // ASSERT(
  //   (value = state_foreign_set(a, [], a, aa) === INVALID_ARGUMENT),
  //   1,
  //   value
  // )
  // ASSERT(
  //   (value = state_foreign_set(a, '', a, aa) === INVALID_ARGUMENT),
  //   2,
  //   value
  // )
  // ns_in.has_value() && ns_in->size() != 32
  // trace('#3', state_foreign_set(a, a, ba, aa), false)
  // ASSERT(
  //   (value = state_foreign_set(a, a, ba, aa) === INVALID_ARGUMENT),
  //   3,
  //   value
  // )
  // trace('#4', state_foreign_set(a, a, sa, aa), false)
  // ASSERT(
  //   (value = state_foreign_set(a, a, sa, aa) === INVALID_ARGUMENT),
  //   4,
  //   value
  // )
  // // acc_in.has_value() && acc_in->size() != 20
  // trace('#5', state_foreign_set(a, a, a, ba), false)
  // ASSERT((value = state_foreign_set(a, a, a, ba) === INVALID_ARGUMENT), 5, value)
  // trace('#6', state_foreign_set(a, a, a, sa), false)
  // ASSERT(
  //   (value = state_foreign_set(a, a, a, sa) === INVALID_ARGUMENT),
  //   6,
  //   value
  // )
  // // !ns_in.has_value()
  // trace('#7', state_foreign_set(a, a, null, aa), false)
  // ASSERT(
  //   (value = state_foreign_set(a, a, null, aa) === INVALID_ARGUMENT),
  //   7,
  //   value
  // )
  // trace('#8', state_foreign_set(a, a, 0, aa), false)
  // ASSERT((value = state_foreign_set(a, a, 0, aa) === INVALID_ARGUMENT), 8, value)
  // trace('#9', state_foreign_set(a, a, undefined, hook_account()), false)
  // ASSERT(
  //   (value = state_foreign_set(a, a, undefined, hook_account()) === 32),
  //   9,
  //   value
  // )
  // trace('#10', state_foreign_set(a, a, [], hook_account()), false)
  // ASSERT(
  //   (value = state_foreign_set(a, a, [], aa) === INVALID_ARGUMENT),
  //   10,
  //   value
  // )
  trace('#11', state_foreign_set(a, a, '', hook_account()), false)
  // ASSERT(
  //   (value = state_foreign_set(a, a, '', aa) === INTERNAL_ERROR),
  //   11,
  //   value
  // )
  // !acc_in.has_value()
  // ASSERT((value = state_foreign_set(a, a, a, null) === 32), 12, value)
  // ASSERT((value = state_foreign_set(a, a, a, 0) === 32), 13, value)
  // ASSERT((value = state_foreign_set(a, a, a, undefined) === 32), 14, value)
  // ASSERT((value = state_foreign_set(a, a, a, []) === 32), 15, value)
  // ASSERT((value = state_foreign_set(a, a, a, '') === 32), 16, value)
  // // delete
  // ASSERT(value = state_foreign_set(null, a, a, a) === 0, 0)
  // ASSERT(value = state_foreign_set(0, a, a, a) === 0, 0)
  // ASSERT(value = state_foreign_set(undefined, a, a, a) === 0, 0)
  // ASSERT(value = state_foreign_set('', a, a, a) === 0, 0)
  // ASSERT(value = state_foreign_set([], a, a, a) === 0, 0)

  // get this transaction id
  // const txn = otxn_id(0) as number[]
  // ASSERT(txn.length === 32, 0)

  // // get the invoice id, which contains the grantor account
  // const grantor = otxn_field(sfInvoiceID) as number[]
  // ASSERT(grantor.length === 32, 1)

  // // set the current txn id on the grantor's state under key 1, namespace 0
  // const one = [
  //   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  //   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  //   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
  // ]
  // const zero = [
  //   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  //   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  //   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  // ]
  // ASSERT(value = state_foreign_set(txn, one, zero, grantor.slice(12)) == 32, 2)

  accept('', 0)
}

export { Hook }
