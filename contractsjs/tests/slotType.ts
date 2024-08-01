import {
  DOESNT_EXIST,
  sfLastLedgerSequence,
  sfAmount,
  NOT_AN_AMOUNT,
  sfAccount,
  KEYLET_LINE,
  sfHighLimit,
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
  ASSERT(slot_type(1, 0) === DOESNT_EXIST)

  ASSERT(slot_set(kl_sk, 1) === 1)

  ASSERT(slot_size(1) > 0)

  ASSERT(slot_type(1, 0) === sfLedgerEntry)

  ASSERT(slot_subfield(1, sfLastLedgerSequence, 0) === 2)

  ASSERT(slot_size(2) > 0)

  ASSERT(slot_size(1) > slot_size(2))

  ASSERT(slot_type(2, 0) === sfLastLedgerSequence)

  ASSERT(otxn_slot(3) === 3)

  ASSERT(slot_type(3, 0) === sfTransaction)

  ASSERT(slot_subfield(3, sfAmount, 4) === 4)

  // this will determine if the amount is native by returning 1 if it is
  ASSERT(slot_type(4, 1) === 1)

  ASSERT(slot_type(3, 1) === NOT_AN_AMOUNT)

  // there's a trustline between alice and bob
  // we can find alice and bob's addresses from otxn
  const addra = hook_account()
  const addrb = otxn_field(sfAccount)
  ASSERT(addra.length === 20)
  ASSERT(addrb.length === 20)

  // build the keylet for the tl
  const cur = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x55, 0x53, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]
  const kl_tr = util_keylet(KEYLET_LINE, addra, addrb, cur)
  ASSERT(kl_tr.length === 34)

  // slot the ripplestate object
  ASSERT(slot_set(kl_tr as number[], 5) === 5)

  // subfield into the high limit
  ASSERT(slot_subfield(5, sfHighLimit, 6) === 6)

  // this is a non-native balance so we should get 0 back when testing the amount type
  ASSERT(slot_type(6, 1) === 0)

  accept('', 0)
}

export { Hook }
