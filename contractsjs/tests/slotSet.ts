import { DOESNT_EXIST, INVALID_ARGUMENT } from 'jshooks-api'

const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const kl_sk = [
  0x00, 0x68, 0xb4, 0x97, 0x9a, 0x36, 0xcd, 0xc7, 0xf3, 0xd3, 0xd5, 0xc3, 0x1a,
  0x4e, 0xae, 0x2a, 0xc7, 0xd7, 0x20, 0x9d, 0xda, 0x87, 0x75, 0x88, 0xb9, 0xaf,
  0xc6, 0x67, 0x99, 0x69, 0x2a, 0xb0, 0xd6, 0x6b,
]

const a31 = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1,
]
const a33 = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1,
]
const a35 = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1,
]
const a34 = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
]

const Hook = (arg) => {
  // read len is only allowed to be 32 (txn id) or 34 (keylet)
  const kl_zero = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
  ]
  ASSERT(slot_set([], 0) === INVALID_ARGUMENT, 1)
  ASSERT(slot_set(a34, undefined) === INVALID_ARGUMENT, 1)
  ASSERT(slot_set(a34, -1) === INVALID_ARGUMENT, 1)
  ASSERT(slot_set(a31, 0) === INVALID_ARGUMENT, 2)
  ASSERT(slot_set(a33, 0) === INVALID_ARGUMENT, 3)
  ASSERT(slot_set(a35, 0) === INVALID_ARGUMENT, 4)
  ASSERT(slot_set(a34, 256) === INVALID_ARGUMENT, 5)

  // request an invalid keylet
  ASSERT(slot_set(kl_zero, 0) === DOESNT_EXIST, 6)
  kl_zero[0] = 1
  ASSERT(slot_set(kl_zero, 0) === DOESNT_EXIST, 7)

  ASSERT(slot_size(1) === DOESNT_EXIST, 8)
  // request a valid keylet
  ASSERT(slot_set(kl_sk, 0) > 0, 9)
  ASSERT(slot_size(1) > 0, 10)

  // fill up all slots
  for (let i = 1; i < 255; ++i) ASSERT(slot_set(kl_sk, 0) > 0, 10)

  // request a final slot that should fail
  ASSERT(slot_set(kl_sk, 0), 11)

  // overwrite an existing slot, should work
  ASSERT(slot_set(kl_sk, 10) === 10, 12)

  // check all the slots contain an object, the same object
  const s = slot_size(1)

  for (let i = 2; i < 256; ++i) ASSERT(s === slot_size(i), 13)

  // slot a txn

  const txn = otxn_id(0)
  ASSERT(txn.length === 32, 14)
  ASSERT(slot_set(txn as number[], 1) === 1, 15)

  const s2 = slot_size(1)

  // ensure it's not the same object that was there before
  ASSERT(s != s2 && s2 > 0, 16)

  accept('', 0)
}

export { Hook }
