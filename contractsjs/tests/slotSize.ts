import { DOESNT_EXIST } from 'jshooks-api'

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
  ASSERT(slot_size(1) === DOESNT_EXIST, 1)

  // request a valid keylet, twice
  ASSERT(slot_set(kl_sk, 1) === 1, 2)
  ASSERT(slot_set(kl_sk, 255) === 255, 3)

  // check the sizes are equal
  ASSERT(slot_size(1) === slot_size(255), 4)

  // check the sizes are > 0
  const s = slot_size(1)
  ASSERT(s > 0, 5)

  // pull the object out into a buffer, check the number of bytes written is correct
  const buf = slot(1)
  ASSERT(buf.length === s, 6)

  // check the object is valid
  ASSERT(sto_validate(buf as number[]) === 1, 7)

  accept('', 0)
}

export { Hook }
