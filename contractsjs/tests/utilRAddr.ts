const ASSERT = (x, code) => {
  if (!x) {
    rollback(x.toString(), code)
  }
}

function toHex(v) {
  const a = []
  for (let i = 0; i < v.length; i++) {
    a.push(v.charCodeAt(i))
  }
  return a
}

const Hook = (arg) => {
  let raw = [
    0x6b, 0x30, 0xe2, 0x94, 0xf3, 0x40, 0x3f, 0xf8, 0x7c, 0xef, 0x9e, 0x72,
    0x21, 0x7f, 0xf7, 0xeb, 0x4a, 0x6a, 0x43, 0xf4,
  ]
  let addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x77 &&
      addr[2] === 0x6d &&
      addr[3] === 0x6d &&
      addr[4] === 0x31 &&
      addr[5] === 0x33 &&
      addr[6] === 0x70 &&
      addr[7] === 0x37 &&
      addr[8] === 0x56 &&
      addr[9] === 0x67 &&
      addr[10] === 0x36 &&
      addr[11] === 0x4b &&
      addr[12] === 0x6d &&
      addr[13] === 0x6e &&
      addr[14] === 0x71 &&
      addr[15] === 0x4b &&
      addr[16] === 0x52 &&
      addr[17] === 0x77 &&
      addr[18] === 0x44 &&
      addr[19] === 0x7a &&
      addr[20] === 0x78 &&
      addr[21] === 0x76 &&
      addr[22] === 0x69 &&
      addr[23] === 0x35 &&
      addr[24] === 0x58 &&
      addr[25] === 0x70 &&
      addr[26] === 0x36 &&
      addr[27] === 0x77 &&
      addr[28] === 0x6e &&
      addr[29] === 0x48 &&
      addr[30] === 0x4d &&
      addr[31] === 0x44 &&
      addr[32] === 0x44 &&
      addr[33] === 0x68
  )

  raw = [
    0xe4, 0x0f, 0xa3, 0x4e, 0x3e, 0x66, 0x15, 0x36, 0x64, 0x89, 0x4f, 0xcb,
    0xfb, 0xfc, 0xfe, 0x2d, 0x2d, 0x19, 0x0d, 0x69,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x4d &&
      addr[2] === 0x38 &&
      addr[3] === 0x31 &&
      addr[4] === 0x6f &&
      addr[5] === 0x48 &&
      addr[6] === 0x77 &&
      addr[7] === 0x68 &&
      addr[8] === 0x37 &&
      addr[9] === 0x35 &&
      addr[10] === 0x39 &&
      addr[11] === 0x34 &&
      addr[12] === 0x6a &&
      addr[13] === 0x48 &&
      addr[14] === 0x38 &&
      addr[15] === 0x70 &&
      addr[16] === 0x36 &&
      addr[17] === 0x31 &&
      addr[18] === 0x57 &&
      addr[19] === 0x65 &&
      addr[20] === 0x31 &&
      addr[21] === 0x73 &&
      addr[22] === 0x64 &&
      addr[23] === 0x58 &&
      addr[24] === 0x46 &&
      addr[25] === 0x42 &&
      addr[26] === 0x35 &&
      addr[27] === 0x48 &&
      addr[28] === 0x52 &&
      addr[29] === 0x52 &&
      addr[30] === 0x79 &&
      addr[31] === 0x4b &&
      addr[32] === 0x76 &&
      addr[33] === 0x4a
  )

  raw = [
    0x0c, 0x90, 0x4b, 0x4f, 0xa5, 0x59, 0xbf, 0x10, 0x6a, 0xae, 0xb5, 0x28,
    0x6c, 0x94, 0xba, 0x34, 0x18, 0xfd, 0xf3, 0x53,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x70 &&
      addr[2] === 0x39 &&
      addr[3] === 0x52 &&
      addr[4] === 0x79 &&
      addr[5] === 0x73 &&
      addr[6] === 0x42 &&
      addr[7] === 0x63 &&
      addr[8] === 0x55 &&
      addr[9] === 0x42 &&
      addr[10] === 0x59 &&
      addr[11] === 0x63 &&
      addr[12] === 0x76 &&
      addr[13] === 0x4a &&
      addr[14] === 0x4a &&
      addr[15] === 0x4b &&
      addr[16] === 0x38 &&
      addr[17] === 0x54 &&
      addr[18] === 0x48 &&
      addr[19] === 0x45 &&
      addr[20] === 0x79 &&
      addr[21] === 0x6f &&
      addr[22] === 0x79 &&
      addr[23] === 0x74 &&
      addr[24] === 0x74 &&
      addr[25] === 0x6b &&
      addr[26] === 0x57 &&
      addr[27] === 0x58 &&
      addr[28] === 0x39 &&
      addr[29] === 0x4b &&
      addr[30] === 0x52 &&
      addr[31] === 0x62 &&
      addr[32] === 0x39 &&
      addr[33] === 0x4d
  )

  raw = [
    0x75, 0x82, 0xfb, 0x27, 0x10, 0x8c, 0x0f, 0x9a, 0xf2, 0x67, 0x35, 0xcc,
    0x7b, 0x22, 0x6b, 0xd2, 0x2f, 0xdf, 0x4f, 0x92,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x42 &&
      addr[2] === 0x35 &&
      addr[3] === 0x4c &&
      addr[4] === 0x79 &&
      addr[5] === 0x77 &&
      addr[6] === 0x6b &&
      addr[7] === 0x54 &&
      addr[8] === 0x4c &&
      addr[9] === 0x31 &&
      addr[10] === 0x34 &&
      addr[11] === 0x51 &&
      addr[12] === 0x64 &&
      addr[13] === 0x55 &&
      addr[14] === 0x64 &&
      addr[15] === 0x77 &&
      addr[16] === 0x43 &&
      addr[17] === 0x78 &&
      addr[18] === 0x70 &&
      addr[19] === 0x6e &&
      addr[20] === 0x65 &&
      addr[21] === 0x46 &&
      addr[22] === 0x32 &&
      addr[23] === 0x7a &&
      addr[24] === 0x63 &&
      addr[25] === 0x7a &&
      addr[26] === 0x46 &&
      addr[27] === 0x66 &&
      addr[28] === 0x44 &&
      addr[29] === 0x7a &&
      addr[30] === 0x57 &&
      addr[31] === 0x46 &&
      addr[32] === 0x38 &&
      addr[33] === 0x50
  )

  raw = [
    0x6c, 0xb6, 0x51, 0x1f, 0x20, 0xec, 0xca, 0x1e, 0x98, 0x03, 0xfc, 0xfa,
    0x6f, 0x3e, 0x56, 0x75, 0x72, 0x29, 0x51, 0x97,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x77 &&
      addr[2] === 0x75 &&
      addr[3] === 0x46 &&
      addr[4] === 0x50 &&
      addr[5] === 0x4b &&
      addr[6] === 0x34 &&
      addr[7] === 0x48 &&
      addr[8] === 0x51 &&
      addr[9] === 0x4e &&
      addr[10] === 0x73 &&
      addr[11] === 0x59 &&
      addr[12] === 0x42 &&
      addr[13] === 0x47 &&
      addr[14] === 0x74 &&
      addr[15] === 0x46 &&
      addr[16] === 0x52 &&
      addr[17] === 0x4b &&
      addr[18] === 0x77 &&
      addr[19] === 0x45 &&
      addr[20] === 0x6d &&
      addr[21] === 0x75 &&
      addr[22] === 0x41 &&
      addr[23] === 0x68 &&
      addr[24] === 0x63 &&
      addr[25] === 0x4b &&
      addr[26] === 0x63 &&
      addr[27] === 0x48 &&
      addr[28] === 0x39 &&
      addr[29] === 0x5a &&
      addr[30] === 0x32 &&
      addr[31] === 0x59 &&
      addr[32] === 0x7a &&
      addr[33] === 0x58
  )

  raw = [
    0xa5, 0x31, 0x30, 0x28, 0xf9, 0x62, 0xe4, 0x80, 0x48, 0x94, 0x3b, 0x1a,
    0x59, 0xbb, 0x5e, 0x36, 0x96, 0xb3, 0x44, 0x35,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x47 &&
      addr[2] === 0x68 &&
      addr[3] === 0x54 &&
      addr[4] === 0x52 &&
      addr[5] === 0x4a &&
      addr[6] === 0x5a &&
      addr[7] === 0x31 &&
      addr[8] === 0x56 &&
      addr[9] === 0x4d &&
      addr[10] === 0x51 &&
      addr[11] === 0x74 &&
      addr[12] === 0x36 &&
      addr[13] === 0x6a &&
      addr[14] === 0x44 &&
      addr[15] === 0x72 &&
      addr[16] === 0x66 &&
      addr[17] === 0x4e &&
      addr[18] === 0x63 &&
      addr[19] === 0x6f &&
      addr[20] === 0x4a &&
      addr[21] === 0x34 &&
      addr[22] === 0x39 &&
      addr[23] === 0x6a &&
      addr[24] === 0x34 &&
      addr[25] === 0x43 &&
      addr[26] === 0x67 &&
      addr[27] === 0x71 &&
      addr[28] === 0x4b &&
      addr[29] === 0x6d &&
      addr[30] === 0x52 &&
      addr[31] === 0x32 &&
      addr[32] === 0x6f &&
      addr[33] === 0x36
  )

  raw = [
    0xbf, 0x04, 0x6c, 0x79, 0xa0, 0x96, 0xde, 0x80, 0x66, 0xd3, 0x74, 0xc8,
    0xdf, 0x94, 0x5f, 0x89, 0xf2, 0x3e, 0x9a, 0x27,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x4a &&
      addr[2] === 0x52 &&
      addr[3] === 0x72 &&
      addr[4] === 0x34 &&
      addr[5] === 0x72 &&
      addr[6] === 0x4c &&
      addr[7] === 0x32 &&
      addr[8] === 0x43 &&
      addr[9] === 0x4a &&
      addr[10] === 0x48 &&
      addr[11] === 0x67 &&
      addr[12] === 0x46 &&
      addr[13] === 0x47 &&
      addr[14] === 0x56 &&
      addr[15] === 0x67 &&
      addr[16] === 0x31 &&
      addr[17] === 0x6a &&
      addr[18] === 0x61 &&
      addr[19] === 0x66 &&
      addr[20] === 0x39 &&
      addr[21] === 0x4a &&
      addr[22] === 0x48 &&
      addr[23] === 0x51 &&
      addr[24] === 0x70 &&
      addr[25] === 0x56 &&
      addr[26] === 0x6d &&
      addr[27] === 0x68 &&
      addr[28] === 0x76 &&
      addr[29] === 0x45 &&
      addr[30] === 0x37 &&
      addr[31] === 0x68 &&
      addr[32] === 0x61 &&
      addr[33] === 0x62
  )

  raw = [
    0xe2, 0x07, 0xab, 0xd3, 0x7d, 0xc2, 0xcd, 0xd4, 0x6d, 0x15, 0x7b, 0x67,
    0x5a, 0xc8, 0x3e, 0x0e, 0x05, 0x9b, 0x08, 0x62,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x4d &&
      addr[2] === 0x63 &&
      addr[3] === 0x33 &&
      addr[4] === 0x75 &&
      addr[5] === 0x4d &&
      addr[6] === 0x6b &&
      addr[7] === 0x4b &&
      addr[8] === 0x31 &&
      addr[9] === 0x62 &&
      addr[10] === 0x62 &&
      addr[11] === 0x32 &&
      addr[12] === 0x64 &&
      addr[13] === 0x4b &&
      addr[14] === 0x7a &&
      addr[15] === 0x5a &&
      addr[16] === 0x64 &&
      addr[17] === 0x56 &&
      addr[18] === 0x71 &&
      addr[19] === 0x35 &&
      addr[20] === 0x75 &&
      addr[21] === 0x59 &&
      addr[22] === 0x54 &&
      addr[23] === 0x55 &&
      addr[24] === 0x37 &&
      addr[25] === 0x5a &&
      addr[26] === 0x76 &&
      addr[27] === 0x4e &&
      addr[28] === 0x45 &&
      addr[29] === 0x41 &&
      addr[30] === 0x32 &&
      addr[31] === 0x33 &&
      addr[32] === 0x67 &&
      addr[33] === 0x44
  )

  raw = [
    0x2a, 0x56, 0x74, 0x25, 0x84, 0x8d, 0x41, 0x6d, 0xf1, 0x06, 0x01, 0x6c,
    0x2a, 0xb1, 0x13, 0xc3, 0x1e, 0x65, 0x63, 0x80,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x68 &&
      addr[2] === 0x69 &&
      addr[3] === 0x69 &&
      addr[4] === 0x41 &&
      addr[5] === 0x78 &&
      addr[6] === 0x79 &&
      addr[7] === 0x59 &&
      addr[8] === 0x41 &&
      addr[9] === 0x43 &&
      addr[10] === 0x67 &&
      addr[11] === 0x45 &&
      addr[12] === 0x52 &&
      addr[13] === 0x4b &&
      addr[14] === 0x47 &&
      addr[15] === 0x51 &&
      addr[16] === 0x4d &&
      addr[17] === 0x72 &&
      addr[18] === 0x53 &&
      addr[19] === 0x5a &&
      addr[20] === 0x57 &&
      addr[21] === 0x43 &&
      addr[22] === 0x74 &&
      addr[23] === 0x6b &&
      addr[24] === 0x4d &&
      addr[25] === 0x6f &&
      addr[26] === 0x69 &&
      addr[27] === 0x58 &&
      addr[28] === 0x48 &&
      addr[29] === 0x34 &&
      addr[30] === 0x64 &&
      addr[31] === 0x48 &&
      addr[32] === 0x6e &&
      addr[33] === 0x6f
  )

  raw = [
    0x24, 0xbb, 0xa9, 0xc3, 0x95, 0x74, 0x9a, 0x88, 0x04, 0x12, 0xc0, 0x91,
    0xe7, 0x13, 0x41, 0x7f, 0x9a, 0xd5, 0x74, 0x43,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x68 &&
      addr[2] === 0x4d &&
      addr[3] === 0x4e &&
      addr[4] === 0x33 &&
      addr[5] === 0x79 &&
      addr[6] === 0x4e &&
      addr[7] === 0x50 &&
      addr[8] === 0x4e &&
      addr[9] === 0x74 &&
      addr[10] === 0x4b &&
      addr[11] === 0x70 &&
      addr[12] === 0x78 &&
      addr[13] === 0x6b &&
      addr[14] === 0x71 &&
      addr[15] === 0x4c &&
      addr[16] === 0x78 &&
      addr[17] === 0x51 &&
      addr[18] === 0x32 &&
      addr[19] === 0x63 &&
      addr[20] === 0x33 &&
      addr[21] === 0x55 &&
      addr[22] === 0x68 &&
      addr[23] === 0x6f &&
      addr[24] === 0x41 &&
      addr[25] === 0x7a &&
      addr[26] === 0x66 &&
      addr[27] === 0x75 &&
      addr[28] === 0x59 &&
      addr[29] === 0x35 &&
      addr[30] === 0x75 &&
      addr[31] === 0x35 &&
      addr[32] === 0x4a &&
      addr[33] === 0x7a
  )

  raw = [
    0x49, 0x53, 0x9e, 0x65, 0x21, 0x8a, 0xcf, 0x37, 0x85, 0x2b, 0xff, 0x87,
    0x14, 0x76, 0xda, 0x1a, 0x62, 0x3a, 0xea, 0x80,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x66 &&
      addr[2] === 0x67 &&
      addr[3] === 0x35 &&
      addr[4] === 0x56 &&
      addr[5] === 0x41 &&
      addr[6] === 0x44 &&
      addr[7] === 0x41 &&
      addr[8] === 0x4d &&
      addr[9] === 0x4d &&
      addr[10] === 0x42 &&
      addr[11] === 0x78 &&
      addr[12] === 0x46 &&
      addr[13] === 0x51 &&
      addr[14] === 0x76 &&
      addr[15] === 0x44 &&
      addr[16] === 0x78 &&
      addr[17] === 0x5a &&
      addr[18] === 0x54 &&
      addr[19] === 0x32 &&
      addr[20] === 0x52 &&
      addr[21] === 0x6a &&
      addr[22] === 0x55 &&
      addr[23] === 0x64 &&
      addr[24] === 0x47 &&
      addr[25] === 0x69 &&
      addr[26] === 0x64 &&
      addr[27] === 0x59 &&
      addr[28] === 0x61 &&
      addr[29] === 0x35 &&
      addr[30] === 0x76 &&
      addr[31] === 0x69 &&
      addr[32] === 0x37 &&
      addr[33] === 0x5a
  )

  raw = [
    0xe7, 0xd3, 0x03, 0xbc, 0xae, 0xbd, 0x62, 0x20, 0xae, 0xc2, 0xe1, 0x7e,
    0x0b, 0xff, 0xdc, 0x21, 0x24, 0x34, 0x50, 0x82,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x34 &&
      addr[2] === 0x33 &&
      addr[3] === 0x6d &&
      addr[4] === 0x31 &&
      addr[5] === 0x31 &&
      addr[6] === 0x66 &&
      addr[7] === 0x74 &&
      addr[8] === 0x36 &&
      addr[9] === 0x79 &&
      addr[10] === 0x6f &&
      addr[11] === 0x50 &&
      addr[12] === 0x69 &&
      addr[13] === 0x6d &&
      addr[14] === 0x36 &&
      addr[15] === 0x56 &&
      addr[16] === 0x44 &&
      addr[17] === 0x78 &&
      addr[18] === 0x64 &&
      addr[19] === 0x55 &&
      addr[20] === 0x76 &&
      addr[21] === 0x63 &&
      addr[22] === 0x46 &&
      addr[23] === 0x77 &&
      addr[24] === 0x36 &&
      addr[25] === 0x57 &&
      addr[26] === 0x38 &&
      addr[27] === 0x41 &&
      addr[28] === 0x77 &&
      addr[29] === 0x78 &&
      addr[30] === 0x78 &&
      addr[31] === 0x4b &&
      addr[32] === 0x35 &&
      addr[33] === 0x58
  )

  raw = [
    0xc3, 0xe1, 0x5f, 0xab, 0xc0, 0x0a, 0x79, 0x73, 0x71, 0xd0, 0x55, 0xc0,
    0x80, 0x79, 0xae, 0x45, 0x71, 0x0f, 0xa0, 0x97,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x4a &&
      addr[2] === 0x69 &&
      addr[3] === 0x35 &&
      addr[4] === 0x6b &&
      addr[5] === 0x65 &&
      addr[6] === 0x58 &&
      addr[7] === 0x79 &&
      addr[8] === 0x33 &&
      addr[9] === 0x31 &&
      addr[10] === 0x4a &&
      addr[11] === 0x31 &&
      addr[12] === 0x34 &&
      addr[13] === 0x52 &&
      addr[14] === 0x4b &&
      addr[15] === 0x73 &&
      addr[16] === 0x4e &&
      addr[17] === 0x59 &&
      addr[18] === 0x41 &&
      addr[19] === 0x46 &&
      addr[20] === 0x31 &&
      addr[21] === 0x51 &&
      addr[22] === 0x36 &&
      addr[23] === 0x6a &&
      addr[24] === 0x4d &&
      addr[25] === 0x56 &&
      addr[26] === 0x69 &&
      addr[27] === 0x45 &&
      addr[28] === 0x52 &&
      addr[29] === 0x55 &&
      addr[30] === 0x51 &&
      addr[31] === 0x71 &&
      addr[32] === 0x59 &&
      addr[33] === 0x36
  )

  raw = [
    0x95, 0x15, 0x7f, 0x2a, 0xaf, 0xe3, 0x2f, 0x7f, 0x2e, 0xf1, 0xa0, 0xf5,
    0xea, 0xc3, 0x07, 0x06, 0xa1, 0xd3, 0xf5, 0xd9,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x4e &&
      addr[2] === 0x62 &&
      addr[3] === 0x48 &&
      addr[4] === 0x53 &&
      addr[5] === 0x55 &&
      addr[6] === 0x6d &&
      addr[7] === 0x66 &&
      addr[8] === 0x4b &&
      addr[9] === 0x61 &&
      addr[10] === 0x34 &&
      addr[11] === 0x71 &&
      addr[12] === 0x31 &&
      addr[13] === 0x51 &&
      addr[14] === 0x78 &&
      addr[15] === 0x44 &&
      addr[16] === 0x45 &&
      addr[17] === 0x5a &&
      addr[18] === 0x4c &&
      addr[19] === 0x6e &&
      addr[20] === 0x54 &&
      addr[21] === 0x67 &&
      addr[22] === 0x46 &&
      addr[23] === 0x56 &&
      addr[24] === 0x45 &&
      addr[25] === 0x4c &&
      addr[26] === 0x78 &&
      addr[27] === 0x39 &&
      addr[28] === 0x6d &&
      addr[29] === 0x57 &&
      addr[30] === 0x45 &&
      addr[31] === 0x43 &&
      addr[32] === 0x6b &&
      addr[33] === 0x41
  )

  raw = [
    0xf0, 0xec, 0x0f, 0x86, 0x31, 0xbb, 0x2c, 0xbf, 0x8f, 0xb7, 0xe3, 0x1c,
    0x82, 0xa0, 0xa3, 0x50, 0xd5, 0xe0, 0xfe, 0x6b,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x34 &&
      addr[2] === 0x78 &&
      addr[3] === 0x31 &&
      addr[4] === 0x78 &&
      addr[5] === 0x46 &&
      addr[6] === 0x32 &&
      addr[7] === 0x42 &&
      addr[8] === 0x47 &&
      addr[9] === 0x73 &&
      addr[10] === 0x42 &&
      addr[11] === 0x41 &&
      addr[12] === 0x7a &&
      addr[13] === 0x77 &&
      addr[14] === 0x77 &&
      addr[15] === 0x61 &&
      addr[16] === 0x4b &&
      addr[17] === 0x61 &&
      addr[18] === 0x70 &&
      addr[19] === 0x4b &&
      addr[20] === 0x6f &&
      addr[21] === 0x6f &&
      addr[22] === 0x35 &&
      addr[23] === 0x57 &&
      addr[24] === 0x65 &&
      addr[25] === 0x31 &&
      addr[26] === 0x59 &&
      addr[27] === 0x53 &&
      addr[28] === 0x6e &&
      addr[29] === 0x52 &&
      addr[30] === 0x50 &&
      addr[31] === 0x57 &&
      addr[32] === 0x75 &&
      addr[33] === 0x39
  )

  raw = [
    0x8d, 0xa4, 0x7d, 0xab, 0xd1, 0x19, 0xdc, 0xc4, 0x45, 0x5f, 0xaa, 0xe2,
    0x1c, 0x39, 0xca, 0x19, 0x34, 0xf1, 0x86, 0x16,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x44 &&
      addr[2] === 0x75 &&
      addr[3] === 0x41 &&
      addr[4] === 0x4c &&
      addr[5] === 0x6e &&
      addr[6] === 0x52 &&
      addr[7] === 0x79 &&
      addr[8] === 0x76 &&
      addr[9] === 0x77 &&
      addr[10] === 0x38 &&
      addr[11] === 0x36 &&
      addr[12] === 0x43 &&
      addr[13] === 0x63 &&
      addr[14] === 0x55 &&
      addr[15] === 0x5a &&
      addr[16] === 0x39 &&
      addr[17] === 0x74 &&
      addr[18] === 0x52 &&
      addr[19] === 0x55 &&
      addr[20] === 0x45 &&
      addr[21] === 0x6d &&
      addr[22] === 0x35 &&
      addr[23] === 0x43 &&
      addr[24] === 0x61 &&
      addr[25] === 0x65 &&
      addr[26] === 0x50 &&
      addr[27] === 0x46 &&
      addr[28] === 0x66 &&
      addr[29] === 0x33 &&
      addr[30] === 0x74 &&
      addr[31] === 0x36 &&
      addr[32] === 0x61 &&
      addr[33] === 0x31
  )

  raw = [
    0xa9, 0x94, 0x5a, 0xe3, 0x5a, 0x43, 0xad, 0xbe, 0xba, 0xa4, 0x13, 0x94,
    0xf5, 0xdc, 0x8f, 0x3b, 0x01, 0x14, 0xff, 0xfe,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x47 &&
      addr[2] === 0x54 &&
      addr[3] === 0x65 &&
      addr[4] === 0x76 &&
      addr[5] === 0x4a &&
      addr[6] === 0x71 &&
      addr[7] === 0x76 &&
      addr[8] === 0x6b &&
      addr[9] === 0x5a &&
      addr[10] === 0x76 &&
      addr[11] === 0x48 &&
      addr[12] === 0x73 &&
      addr[13] === 0x58 &&
      addr[14] === 0x5a &&
      addr[15] === 0x71 &&
      addr[16] === 0x55 &&
      addr[17] === 0x78 &&
      addr[18] === 0x43 &&
      addr[19] === 0x48 &&
      addr[20] === 0x4c &&
      addr[21] === 0x68 &&
      addr[22] === 0x73 &&
      addr[23] === 0x43 &&
      addr[24] === 0x53 &&
      addr[25] === 0x38 &&
      addr[26] === 0x57 &&
      addr[27] === 0x68 &&
      addr[28] === 0x79 &&
      addr[29] === 0x4d &&
      addr[30] === 0x74 &&
      addr[31] === 0x7a &&
      addr[32] === 0x6e &&
      addr[33] === 0x5a
  )

  raw = [
    0xc1, 0xe6, 0x7f, 0x17, 0xd3, 0x00, 0x9b, 0x80, 0x6c, 0x85, 0x74, 0x9c,
    0x80, 0x40, 0xaf, 0x64, 0xce, 0x09, 0x7e, 0x2e,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x4a &&
      addr[2] === 0x67 &&
      addr[3] === 0x45 &&
      addr[4] === 0x59 &&
      addr[5] === 0x55 &&
      addr[6] === 0x37 &&
      addr[7] === 0x36 &&
      addr[8] === 0x45 &&
      addr[9] === 0x55 &&
      addr[10] === 0x34 &&
      addr[11] === 0x59 &&
      addr[12] === 0x41 &&
      addr[13] === 0x5a &&
      addr[14] === 0x41 &&
      addr[15] === 0x44 &&
      addr[16] === 0x79 &&
      addr[17] === 0x61 &&
      addr[18] === 0x37 &&
      addr[19] === 0x6b &&
      addr[20] === 0x37 &&
      addr[21] === 0x62 &&
      addr[22] === 0x71 &&
      addr[23] === 0x38 &&
      addr[24] === 0x4e &&
      addr[25] === 0x76 &&
      addr[26] === 0x64 &&
      addr[27] === 0x65 &&
      addr[28] === 0x4b &&
      addr[29] === 0x41 &&
      addr[30] === 0x48 &&
      addr[31] === 0x69 &&
      addr[32] === 0x32 &&
      addr[33] === 0x50
  )

  raw = [
    0xd8, 0x74, 0xcf, 0x61, 0x0d, 0x97, 0xe4, 0xab, 0x76, 0xa0, 0x70, 0x60,
    0xb7, 0xc5, 0x9c, 0x9a, 0x88, 0x86, 0x62, 0xaa,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x4c &&
      addr[2] === 0x6a &&
      addr[3] === 0x57 &&
      addr[4] === 0x74 &&
      addr[5] === 0x59 &&
      addr[6] === 0x52 &&
      addr[7] === 0x61 &&
      addr[8] === 0x6e &&
      addr[9] === 0x61 &&
      addr[10] === 0x6b &&
      addr[11] === 0x33 &&
      addr[12] === 0x74 &&
      addr[13] === 0x52 &&
      addr[14] === 0x43 &&
      addr[15] === 0x5a &&
      addr[16] === 0x42 &&
      addr[17] === 0x69 &&
      addr[18] === 0x61 &&
      addr[19] === 0x38 &&
      addr[20] === 0x64 &&
      addr[21] === 0x33 &&
      addr[22] === 0x70 &&
      addr[23] === 0x7a &&
      addr[24] === 0x78 &&
      addr[25] === 0x6b &&
      addr[26] === 0x6e &&
      addr[27] === 0x63 &&
      addr[28] === 0x73 &&
      addr[29] === 0x7a &&
      addr[30] === 0x6f &&
      addr[31] === 0x33 &&
      addr[32] === 0x33 &&
      addr[33] === 0x38
  )

  raw = [
    0x8e, 0xad, 0xb4, 0xbb, 0x71, 0x2a, 0x29, 0x1b, 0x53, 0x43, 0xe0, 0x03,
    0x1f, 0x97, 0x6b, 0x0d, 0xa9, 0xed, 0x39, 0xc2,
  ]
  addr = util_raddr(raw)
  ASSERT(34 === addr.length)
  addr = toHex(addr)
  ASSERT(
    addr[0] === 0x72 &&
      addr[1] === 0x4e &&
      addr[2] === 0x72 &&
      addr[3] === 0x52 &&
      addr[4] === 0x73 &&
      addr[5] === 0x59 &&
      addr[6] === 0x57 &&
      addr[7] === 0x69 &&
      addr[8] === 0x4a &&
      addr[9] === 0x53 &&
      addr[10] === 0x64 &&
      addr[11] === 0x39 &&
      addr[12] === 0x47 &&
      addr[13] === 0x4a &&
      addr[14] === 0x50 &&
      addr[15] === 0x50 &&
      addr[16] === 0x36 &&
      addr[17] === 0x51 &&
      addr[18] === 0x71 &&
      addr[19] === 0x33 &&
      addr[20] === 0x4a &&
      addr[21] === 0x61 &&
      addr[22] === 0x44 &&
      addr[23] === 0x43 &&
      addr[24] === 0x37 &&
      addr[25] === 0x53 &&
      addr[26] === 0x48 &&
      addr[27] === 0x61 &&
      addr[28] === 0x57 &&
      addr[29] === 0x66 &&
      addr[30] === 0x68 &&
      addr[31] === 0x32 &&
      addr[32] === 0x33 &&
      addr[33] === 0x4b
  )

  accept('', 0)
}
