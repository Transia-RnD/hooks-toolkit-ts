const DOESNT_EXIST = -5
const INVALID_ARGUMENT = -7
const ASSERT = (x) => {
  if (!x) rollback(x.toString(), 0)
}

const sto = [
  0x11, 0x00, 0x53, 0x22, 0x00, 0x00, 0x00, 0x00, 0x25, 0x01, 0x52, 0x70, 0x1a,
  0x20, 0x23, 0x00, 0x00, 0x00, 0x02, 0x20, 0x26, 0x00, 0x00, 0x00, 0x00, 0x34,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x55, 0x09, 0xa9, 0xc8, 0x6b,
  0xf2, 0x06, 0x95, 0x73, 0x5a, 0xb0, 0x36, 0x20, 0xeb, 0x1c, 0x32, 0x60, 0x66,
  0x35, 0xac, 0x3d, 0xa0, 0xb7, 0x02, 0x82, 0xf3, 0x7c, 0x67, 0x4f, 0xc8, 0x89,
  0xef, 0xe7,
]

const Hook = (reserved) => {
  // Test invalid arg
  ASSERT(sto_subfield(undefined, 0x10001) === INVALID_ARGUMENT)
  ASSERT(sto_subfield(sto, undefined) === INVALID_ARGUMENT)
  ASSERT(sto_subfield(sto, -1) === INVALID_ARGUMENT)
  ASSERT(sto_subfield(sto, 0xffffffff + 1) === INVALID_ARGUMENT)

  // ASSERT(sto_subfield(sto, 0x10001) === (1 << 32) + 2)
  ASSERT(sto_subfield(sto, 0x10001) === 2 ** 32 + 2)

  // Test subfield 0x11, should be position 0 length 3, payload pos 1, len 2
  // ASSERT(sto_subfield(sto, 0x10001) === (1 << 32) + 2)
  ASSERT(sto_subfield(sto, 0x10001) === 2 ** 32 + 2)

  // Test subfield 0x22, should be position 3 length 5, payload pos 4, len 4
  // ASSERT(sto_subfield(sto, 0x20002) === (4 << 32) + 4)
  ASSERT(sto_subfield(sto, 0x20002) === 4 * 2 ** 32 + 4)

  // Test subfield 0x34, should be at position 25, length = 9, payload pos 26, len 8
  // ASSERT(sto_subfield(sto, 0x30004) === (26 << 32) + 8)
  ASSERT(sto_subfield(sto, 0x30004) === 26 * 2 ** 32 + 8)

  // Test final subfield, position 34, length 33, payload pos 35, len 32
  // ASSERT(sto_subfield(sto, 0x50005) === (35 << 32) + 32)
  ASSERT(sto_subfield(sto, 0x50005) === 35 * 2 ** 32 + 32)

  // Test not found
  ASSERT(sto_subfield(sto, 0x90009) === DOESNT_EXIST)

  accept('success', 0)
}
