const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const INVALID_ARGUMENT = -7
const DOESNT_EXIST = -5
const TOO_BIG = -3
const KEYLET_ACCOUNT = 3
const sfBalance = 0x60002

const Hook = (arg) => {
  // slot type check
  ASSERT(slot(null) === INVALID_ARGUMENT, 1)
  ASSERT(slot(undefined) === INVALID_ARGUMENT, 1)
  ASSERT(slot('') === INVALID_ARGUMENT, 1)

  // this function can return data as an int64_t,
  // but requires boolean as argument
  trace('slot(0, null)', slot(0, null), false)
  ASSERT(slot(0, null) === INVALID_ARGUMENT, 2)

  // slot 0 hasn't been set yet so
  ASSERT(slot(0) === DOESNT_EXIST, 3)

  // grab the hook account
  const acc = hook_account()
  ASSERT(20 === acc.length, 4)

  // turn it into account root keylet
  const kl = util_keylet(KEYLET_ACCOUNT, acc)
  ASSERT(34 === kl.length, 5)

  // slot the account root into a new slot
  const slot_no = slot_set(kl as number[], 0)
  ASSERT(slot_no > 0, 6)

  const size = slot_size(slot_no)
  ASSERT(size > 0, 7)

  // the slotted item is too large for return as int64
  ASSERT(slot(slot_no, true) === TOO_BIG, 8)

  // big buffer, large enough to hold the account_root
  const buf = slot(slot_no)

  // the slot call should return the bytes written which should exactly
  // match the size of the slotted object
  trace('size', size, false)
  trace('buf', buf, false)
  ASSERT(buf.length == size, 9)

  // do a quick sanity check on the object using sto api
  ASSERT(sto_validate(buf as number[]) === 1, 10)

  // grab a field
  ASSERT(sto_subfield(buf as number[], sfBalance) > 0, 11)

  // subslot a subfield we can return as an int64_t
  ASSERT(slot_subfield(slot_no, sfBalance, 200) === 200, 12)

  // retrieve the slotted object as an int64_t
  ASSERT((slot(200, true) as number) > 0, 13)
  accept('', 0)
}

export { Hook }
