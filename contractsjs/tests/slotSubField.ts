import {
  DOESNT_EXIST,
  INVALID_ARGUMENT,
  INVALID_FIELD,
  NOT_AN_OBJECT,
  NO_FREE_SLOTS,
  sfHashes,
  sfLastLedgerSequence,
  sfMemoData,
  sfMemos,
} from 'jshooks-api'

const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const kl_sk = [
  0x00, 0x68, 0xb4, 0x97, 0x9a, 0x36, 0xcd, 0xc7, 0xf3, 0xd3, 0xd5, 0xc3, 0x1a,
  0x4e, 0xae, 0x2a, 0xc7, 0xd7, 0x20, 0x9d, 0xda, 0x87, 0x75, 0x88, 0xb9, 0xaf,
  0xc6, 0x67, 0x99, 0x69, 0x2a, 0xb0, 0xd6, 0x6b,
]

const Hook = (arg) => {
  ASSERT(slot_subfield(undefined, 1, 1) === INVALID_ARGUMENT)
  ASSERT(slot_subfield(1, undefined, 1) === INVALID_ARGUMENT)
  ASSERT(slot_subfield(1, 1, undefined) === INVALID_ARGUMENT)

  ASSERT(slot_subfield(1, 1, 1) === DOESNT_EXIST)

  ASSERT(slot_subfield(1, 1, 1) === DOESNT_EXIST)

  ASSERT(slot_set(kl_sk, 1) === 1)

  ASSERT(slot_size(1) > 0)

  ASSERT(slot_subfield(1, sfLastLedgerSequence, 0) === 2)

  ASSERT(slot_size(2) > 0)
  ASSERT(slot_size(1) > slot_size(2))

  ASSERT(slot_subfield(1, sfHashes, 0) === 3)

  ASSERT(slot_size(3) > 0)
  ASSERT(slot_size(1) > slot_size(3))

  // request a field that is invalid
  ASSERT(slot_subfield(1, 0xffffffff, 0) === INVALID_FIELD)

  // request a field that isn't present
  ASSERT(slot_subfield(1, sfMemos, 0) === DOESNT_EXIST)

  // request a subfield from something that's not an object
  ASSERT(slot_subfield(3, sfMemoData, 0) === NOT_AN_OBJECT)

  // overwrite an existing slot
  ASSERT(slot_subfield(1, sfLastLedgerSequence, 3) === 3)
  ASSERT(slot_size(2) === slot_size(3))

  // test slot exhaustion
  for (let i = 0; i < 252; ++i)
    ASSERT(slot_subfield(1, sfLastLedgerSequence, 0) > 0)

  ASSERT(slot_subfield(1, sfLastLedgerSequence, 0) === NO_FREE_SLOTS)

  accept('', 0)
}

export { Hook }
