const DOESNT_EXIST = -5
const INVALID_ARGUMENT = -7

const ASSERT = (x) => {
  if (!x) rollback(x.toString(), 0)
}

const sto = [
  0xf4, 0xeb, 0x13, 0x00, 0x01, 0x81, 0x14, 0x20, 0x42, 0x88, 0xd2, 0xe4, 0x7f,
  0x8e, 0xf6, 0xc9, 0x9b, 0xcc, 0x45, 0x79, 0x66, 0x32, 0x0d, 0x12, 0x40, 0x97,
  0x11, 0xe1, 0xeb, 0x13, 0x00, 0x01, 0x81, 0x14, 0x3e, 0x9d, 0x4a, 0x2b, 0x8a,
  0xa0, 0x78, 0x0f, 0x68, 0x2d, 0x13, 0x6f, 0x7a, 0x56, 0xd6, 0x72, 0x4e, 0xf5,
  0x37, 0x54, 0xe1, 0xf1,
]

const Hook = (reserved) => {
  // Test invalid arg
  ASSERT(sto_subarray(undefined, 0) === INVALID_ARGUMENT)
  ASSERT(sto_subarray(sto, undefined) === INVALID_ARGUMENT)
  ASSERT(sto_subarray(sto, -1) === INVALID_ARGUMENT)
  ASSERT(sto_subarray(sto, 0xffffffff + 1) === INVALID_ARGUMENT)

  // Test index 0, should be position 1 length 27
  // ASSERT(sto_subarray(sto, 0) === (1 << 32) + 27)
  ASSERT(sto_subarray(sto, 0) === 2 ** 32 + 27)

  // Test index 1, should be position 28 length 27
  // ASSERT(sto_subarray(sto, 1) === (28 << 32) + 27)
  ASSERT(sto_subarray(sto, 1) === 28 * 2 ** 32 + 27)

  // Test index 2, doesn't exist
  ASSERT(sto_subarray(sto, 2) === DOESNT_EXIST)

  accept('success', 0)
}
