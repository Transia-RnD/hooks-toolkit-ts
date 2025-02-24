import { Payment } from '@transia/xrpl'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
import { LedgerEntry, RippleState } from '@transia/xrpl/dist/npm/models/ledger'

const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const DOESNT_EXIST = -5
const INVALID_ARGUMENT = -7
const KEYLET_LINE = 9

const sfAccount = 0x80001

const kl_sk = [
  0x00, 0x68, 0xb4, 0x97, 0x9a, 0x36, 0xcd, 0xc7, 0xf3, 0xd3, 0xd5, 0xc3, 0x1a,
  0x4e, 0xae, 0x2a, 0xc7, 0xd7, 0x20, 0x9d, 0xda, 0x87, 0x75, 0x88, 0xb9, 0xaf,
  0xc6, 0x67, 0x99, 0x69, 0x2a, 0xb0, 0xd6, 0x6b,
]

const Hook = (arg) => {
  ASSERT(slot_json(undefined) === INVALID_ARGUMENT)
  ASSERT(slot_json(1) === DOESNT_EXIST)

  ASSERT(slot_set(kl_sk, 1) === 1)

  ASSERT(slot_size(1) > 0)

  const ls = slot_json(1) as LedgerEntry
  trace('ls', ls, false)
  ASSERT(typeof ls === 'object')
  ASSERT(ls.LedgerEntryType === 'LedgerHashes')

  ASSERT(otxn_slot(2) === 2)
  ASSERT(slot_size(2) > 0)

  const txs = slot_json(2) as Payment
  trace('txs', txs, false)
  ASSERT(typeof txs === 'object')
  ASSERT(txs.TransactionType === 'Payment')
  ASSERT(txs.Amount === '1000000')

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
  ASSERT(slot_set(kl_tr as number[], 3) === 3)

  const lines = slot_json(3) as RippleState
  trace('lines', lines, false)
  ASSERT(typeof lines === 'object')
  ASSERT(lines.HighLimit.issuer === 'rPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK')
  ASSERT(lines.HighLimit.currency === 'USD')
  ASSERT(lines.HighLimit.value === '0')

  accept('', 0)
}

export { Hook }
