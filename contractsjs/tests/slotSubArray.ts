import {
  DOESNT_EXIST,
  NOT_AN_ARRAY,
  NO_FREE_SLOTS,
  sfMemoData,
  sfMemos,
} from 'jshooks-api'

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

const Hook = (arg) => {
  ASSERT(slot_subarray(1, 1, 1) === DOESNT_EXIST, 1)

  // request a valid keylet that doesn't contain an array
  ASSERT(slot_set(kl_sk, 1) === 1, 2)

  ASSERT(slot_size(1) > 0, 3)

  ASSERT(slot_subarray(1, 1, 1) === NOT_AN_ARRAY, 4)

  // now request an object that contains an array (this txn)
  ASSERT(otxn_slot(2) === 2, 5)

  // slot the array
  ASSERT(slot_subfield(2, sfMemos, 3) === 3, 6)

  // it should contain 9 entries
  ASSERT(slot_count(3) === 9, 7)

  // now index into the array
  ASSERT(slot_subarray(3, 0, 0) > 0, 8)

  // take element at index 5 and place it in slot 100
  ASSERT(slot_subarray(3, 5, 100) === 100, 9)

  // override it and replace with element 6
  ASSERT(slot_subarray(3, 6, 100) === 100, 10)

  // check the value is correct
  ASSERT(slot_subfield(100, sfMemoData, 100) === 100, 11)

  let buf = slot(100)
  ASSERT(6 === buf.length, 11)

  ASSERT(
    buf[0] === 0x05 &&
      buf[1] === 0xc0 &&
      buf[2] === 0x01 &&
      buf[3] === 0xca &&
      buf[4] === 0xfe &&
      buf[5] === 0x06,
    12
  )

  // override it and replace with element 0
  ASSERT(slot_subarray(3, 0, 100) === 100, 13)

  // check the value is correct
  ASSERT(slot_subfield(100, sfMemoData, 100) === 100, 14)

  buf = slot(100)
  ASSERT(buf.length === 6, 15)

  ASSERT(
    buf[0] === 0x05 &&
      buf[1] === 0xc0 &&
      buf[2] === 0x01 &&
      buf[3] === 0xca &&
      buf[4] === 0xfe &&
      buf[5] === 0x00,
    16
  )

  // test slot exhaustion
  for (let i = 0; i < 250; ++i) ASSERT(slot_subarray(3, 0, 0) > 0, 17)

  ASSERT(slot_subarray(3, 0, 0) === NO_FREE_SLOTS, 18)

  accept('', 0)
}

export { Hook }
