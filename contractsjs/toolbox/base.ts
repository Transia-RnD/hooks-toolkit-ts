const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const INVALID_ARGUMENT = -7

const a = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
]
const aa = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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

const data2 = [
  0x23, 0x13, 0x96, 0x68, 0x78, 0xdc, 0xab, 0xc4, 0x40, 0x26, 0x07, 0x2b, 0xa3,
  0xd2, 0x0c, 0x69, 0x40, 0xdd, 0xcd, 0xe7, 0x38, 0x9b, 0x0b, 0xa9, 0x6c, 0x3c,
  0xb3, 0x87, 0x37, 0x02, 0x81, 0xe8, 0x2b, 0xdd, 0x5d, 0xbb, 0x40, 0xd9, 0x66,
  0x96, 0x6f, 0xc1, 0x6b, 0xe8, 0xd4, 0x7c, 0x7b, 0x62, 0x14, 0x4c, 0xd1, 0x4b,
  0xaa, 0x99, 0x36, 0x75, 0xe9, 0x22, 0xad, 0x0f, 0x5f, 0x94, 0x1d, 0x86, 0xeb,
  0xa8, 0x13, 0x99, 0xf9, 0x98, 0xff, 0xca, 0x5b, 0x86, 0x2f, 0xdf, 0x67, 0x8f,
  0xe2, 0xe3, 0xc3, 0x37, 0xcc, 0x47, 0x0f, 0x33, 0x88, 0xb0, 0x33, 0x3b, 0x02,
  0x55, 0x67, 0x16, 0xa4, 0xfb, 0x8e, 0x85, 0x6f, 0xd8, 0x84, 0x16, 0xa3, 0x54,
  0x18, 0x34, 0x06, 0x0e, 0xf6, 0x65, 0x34, 0x05, 0x26, 0x7e, 0x05, 0x74, 0xda,
  0x09, 0xbf, 0x55, 0x8c, 0x75, 0x92, 0xac, 0x33, 0xfb, 0x01, 0x8d,
]

const Hook = (arg) => {
  trace('#1', state_set(a, sa), false)
  // ASSERT(state_set(a, sa) === 32, 1)
  trace('#2', state_set(a, ba), false)
  // ASSERT(state_set(a, ba) === INVALID_ARGUMENT, 2)
  trace('#3', state_set(a, ha), false)
  // ASSERT(state_set(a, ha) === INVALID_ARGUMENT, 3)
  trace('#4', state_set(sa, a), false)
  // ASSERT(state_set(sa, a) === 1, 4)
  trace('#5', state_set(ba, a), false)
  // ASSERT(state_set(ba, a) === 33, 5)
  trace('#6', state_set(ha, a), false)
  // ASSERT(state_set(ha, a) === 0, 6)

  // create state 1
  const key = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ]
  const data = [0xca, 0xfe, 0xba, 0xbe]
  ASSERT(state_set(data, key) === 4, 7)

  const key2 = [1, 2, 3]
  ASSERT(state_set(data2, key2) === 128, 8)
  accept('', 0)
}

export { Hook }
