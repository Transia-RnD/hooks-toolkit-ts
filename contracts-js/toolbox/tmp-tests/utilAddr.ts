const ASSERT = (x, code) => {
  if (!x) {
    rollback(x.toString(), code)
  }
}

const Hook = (arg) => {
  let addr = 'rMEGJtK2SttrtAfoKaqKUpCrDCi9saNuLg'
  let b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0xde &&
      b[1] === 0x15 &&
      b[2] === 0x1e &&
      b[3] === 0x2f &&
      b[4] === 0xb2 &&
      b[5] === 0xaa &&
      b[6] === 0xbd &&
      b[7] === 0x1a &&
      b[8] === 0x5b &&
      b[9] === 0xd0 &&
      b[10] === 0x2f &&
      b[11] === 0x63 &&
      b[12] === 0x68 &&
      b[13] === 0x26 &&
      b[14] === 0xdf &&
      b[15] === 0x43 &&
      b[16] === 0x50 &&
      b[17] === 0xc0 &&
      b[18] === 0x40 &&
      b[19] === 0xde
  )

  addr = 'rNo8xzUAauXENpvsMVJ9Q9w5LtVxCVFN4p'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x97 &&
      b[1] === 0x73 &&
      b[2] === 0x23 &&
      b[3] === 0xaa &&
      b[4] === 0x33 &&
      b[5] === 0x7c &&
      b[6] === 0xb6 &&
      b[7] === 0x82 &&
      b[8] === 0x37 &&
      b[9] === 0x83 &&
      b[10] === 0x58 &&
      b[11] === 0x3a &&
      b[12] === 0x7a &&
      b[13] === 0xdf &&
      b[14] === 0x4e &&
      b[15] === 0xd8 &&
      b[16] === 0x52 &&
      b[17] === 0x2c &&
      b[18] === 0xa8 &&
      b[19] === 0xf0
  )

  addr = 'rUpwuJR1xLH18aHLP5nEm4Hw215tmkq6V7'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x78 &&
      b[1] === 0xe2 &&
      b[2] === 0x10 &&
      b[3] === 0xac &&
      b[4] === 0x98 &&
      b[5] === 0x38 &&
      b[6] === 0xf2 &&
      b[7] === 0x5a &&
      b[8] === 0x3b &&
      b[9] === 0x7e &&
      b[10] === 0xde &&
      b[11] === 0x51 &&
      b[12] === 0x37 &&
      b[13] === 0x13 &&
      b[14] === 0x94 &&
      b[15] === 0xed &&
      b[16] === 0x80 &&
      b[17] === 0x77 &&
      b[18] === 0x89 &&
      b[19] === 0x48
  )

  addr = 'ravUPmVUQ65qeuNSFiN6W2U88smjJYHBJm'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x40 &&
      b[1] === 0xe8 &&
      b[2] === 0x2f &&
      b[3] === 0x55 &&
      b[4] === 0xc7 &&
      b[5] === 0x3a &&
      b[6] === 0xeb &&
      b[7] === 0xcf &&
      b[8] === 0xc9 &&
      b[9] === 0x1d &&
      b[10] === 0x3b &&
      b[11] === 0xf4 &&
      b[12] === 0x77 &&
      b[13] === 0x76 &&
      b[14] === 0x50 &&
      b[15] === 0x2b &&
      b[16] === 0x49 &&
      b[17] === 0x7b &&
      b[18] === 0x12 &&
      b[19] === 0x2c
  )

  addr = 'rPXQ8PW1C382oewiEyJrAWtDQBNsQhAtWA'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0xf7 &&
      b[1] === 0x13 &&
      b[2] === 0x19 &&
      b[3] === 0x49 &&
      b[4] === 0x3f &&
      b[5] === 0xa6 &&
      b[6] === 0xa3 &&
      b[7] === 0xdb &&
      b[8] === 0x62 &&
      b[9] === 0xae &&
      b[10] === 0x12 &&
      b[11] === 0x1b &&
      b[12] === 0x12 &&
      b[13] === 0x6c &&
      b[14] === 0xfe &&
      b[15] === 0x81 &&
      b[16] === 0x49 &&
      b[17] === 0x5a &&
      b[18] === 0x49 &&
      b[19] === 0x16
  )

  addr = 'rnZbUT8tpm48KEdfELCxRjJJhNV1JNYcg5'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x32 &&
      b[1] === 0x0a &&
      b[2] === 0x5c &&
      b[3] === 0x53 &&
      b[4] === 0x61 &&
      b[5] === 0x5b &&
      b[6] === 0x4b &&
      b[7] === 0x57 &&
      b[8] === 0x1d &&
      b[9] === 0xc4 &&
      b[10] === 0x6f &&
      b[11] === 0x13 &&
      b[12] === 0xbd &&
      b[13] === 0x4f &&
      b[14] === 0x31 &&
      b[15] === 0x70 &&
      b[16] === 0x84 &&
      b[17] === 0xd1 &&
      b[18] === 0xb1 &&
      b[19] === 0x68
  )

  addr = 'rPghxri3jhBaxBfWGAHrVC4KANoRBe6dcM'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0xf8 &&
      b[1] === 0xb6 &&
      b[2] === 0x49 &&
      b[3] === 0x2b &&
      b[4] === 0x5b &&
      b[5] === 0x21 &&
      b[6] === 0xc8 &&
      b[7] === 0xda &&
      b[8] === 0xbd &&
      b[9] === 0x0f &&
      b[10] === 0x1d &&
      b[11] === 0x2f &&
      b[12] === 0xd9 &&
      b[13] === 0xf4 &&
      b[14] === 0x5b &&
      b[15] === 0xde &&
      b[16] === 0xcc &&
      b[17] === 0x6a &&
      b[18] === 0xeb &&
      b[19] === 0x91
  )

  addr = 'r4Tck2QJcfcwBuTgVJXYb4QbrKP6mT1acM'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0xeb &&
      b[1] === 0x63 &&
      b[2] === 0x4c &&
      b[3] === 0xd6 &&
      b[4] === 0xf9 &&
      b[5] === 0xbf &&
      b[6] === 0x50 &&
      b[7] === 0xc1 &&
      b[8] === 0xd9 &&
      b[9] === 0x79 &&
      b[10] === 0x30 &&
      b[11] === 0x84 &&
      b[12] === 0x1b &&
      b[13] === 0xfc &&
      b[14] === 0x35 &&
      b[15] === 0x32 &&
      b[16] === 0xbd &&
      b[17] === 0x6d &&
      b[18] === 0xc0 &&
      b[19] === 0x75
  )

  addr = 'rETHUL5T1SzM6AMotnsK5V3J5XMwJ9UhZ2'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x9e &&
      b[1] === 0x8a &&
      b[2] === 0x18 &&
      b[3] === 0x66 &&
      b[4] === 0x92 &&
      b[5] === 0x0e &&
      b[6] === 0xe5 &&
      b[7] === 0xed &&
      b[8] === 0xfa &&
      b[9] === 0xe3 &&
      b[10] === 0x23 &&
      b[11] === 0x15 &&
      b[12] === 0xcb &&
      b[13] === 0x83 &&
      b[14] === 0xef &&
      b[15] === 0x73 &&
      b[16] === 0xe4 &&
      b[17] === 0x91 &&
      b[18] === 0x0b &&
      b[19] === 0xca
  )

  addr = 'rh9CggaWiY6QdD55ZkbbnrFpHJkKSauLfC'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x22 &&
      b[1] === 0x8b &&
      b[2] === 0xff &&
      b[3] === 0x31 &&
      b[4] === 0xb4 &&
      b[5] === 0x93 &&
      b[6] === 0xf6 &&
      b[7] === 0xc1 &&
      b[8] === 0x12 &&
      b[9] === 0xea &&
      b[10] === 0xd6 &&
      b[11] === 0xdf &&
      b[12] === 0xc4 &&
      b[13] === 0x05 &&
      b[14] === 0xb3 &&
      b[15] === 0x7d &&
      b[16] === 0xc0 &&
      b[17] === 0x65 &&
      b[18] === 0x21 &&
      b[19] === 0x34
  )

  addr = 'r9sYGdPCGuJauy8QVG4CHnvp5U4eu3yY2B'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x58 &&
      b[1] === 0x3b &&
      b[2] === 0xf0 &&
      b[3] === 0xcb &&
      b[4] === 0x95 &&
      b[5] === 0x80 &&
      b[6] === 0xde &&
      b[7] === 0xa0 &&
      b[8] === 0xb3 &&
      b[9] === 0x71 &&
      b[10] === 0xd0 &&
      b[11] === 0x18 &&
      b[12] === 0x17 &&
      b[13] === 0x1a &&
      b[14] === 0xbb &&
      b[15] === 0x98 &&
      b[16] === 0x1f &&
      b[17] === 0xcc &&
      b[18] === 0x7c &&
      b[19] === 0x68
  )

  addr = 'r4yJX9eU65WHfmKz6xXmSRf9CZN6bXfpWb'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0xf1 &&
      b[1] === 0x00 &&
      b[2] === 0x8f &&
      b[3] === 0x64 &&
      b[4] === 0x0f &&
      b[5] === 0x99 &&
      b[6] === 0x19 &&
      b[7] === 0xda &&
      b[8] === 0xcf &&
      b[9] === 0x48 &&
      b[10] === 0x18 &&
      b[11] === 0x1c &&
      b[12] === 0x35 &&
      b[13] === 0x2e &&
      b[14] === 0xe4 &&
      b[15] === 0x3e &&
      b[16] === 0x37 &&
      b[17] === 0x7c &&
      b[18] === 0x01 &&
      b[19] === 0xf6
  )

  addr = 'rBkXoWoXPHuZy2nHbE7L1zJfqAvb4jHRrK'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x75 &&
      b[1] === 0xec &&
      b[2] === 0xdb &&
      b[3] === 0x3b &&
      b[4] === 0x9a &&
      b[5] === 0x71 &&
      b[6] === 0xd9 &&
      b[7] === 0xef &&
      b[8] === 0xd6 &&
      b[9] === 0x55 &&
      b[10] === 0x15 &&
      b[11] === 0xdd &&
      b[12] === 0xea &&
      b[13] === 0xd2 &&
      b[14] === 0x36 &&
      b[15] === 0x7a &&
      b[16] === 0x05 &&
      b[17] === 0x6f &&
      b[18] === 0x4e &&
      b[19] === 0x5f
  )

  addr = 'rnaUBeEBNuyv57Jk127DsApEQoR8JqWpie'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x2c &&
      b[1] === 0xdb &&
      b[2] === 0xeb &&
      b[3] === 0x1f &&
      b[4] === 0x5e &&
      b[5] === 0xc5 &&
      b[6] === 0xd7 &&
      b[7] === 0x5f &&
      b[8] === 0xac &&
      b[9] === 0xbd &&
      b[10] === 0x19 &&
      b[11] === 0xc8 &&
      b[12] === 0x3f &&
      b[13] === 0x45 &&
      b[14] === 0x3b &&
      b[15] === 0xa8 &&
      b[16] === 0xa0 &&
      b[17] === 0x1c &&
      b[18] === 0xdb &&
      b[19] === 0x0f
  )

  addr = 'rJHmUPMQ6qYdaqMizDZY8FKcCqCJxYYnb3'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0xbd &&
      b[1] === 0xa5 &&
      b[2] === 0xaf &&
      b[3] === 0xda &&
      b[4] === 0x5f &&
      b[5] === 0x04 &&
      b[6] === 0xe7 &&
      b[7] === 0xef &&
      b[8] === 0x16 &&
      b[9] === 0x7a &&
      b[10] === 0x35 &&
      b[11] === 0x94 &&
      b[12] === 0x6e &&
      b[13] === 0xef &&
      b[14] === 0x19 &&
      b[15] === 0xfa &&
      b[16] === 0x12 &&
      b[17] === 0xf3 &&
      b[18] === 0x1c &&
      b[19] === 0x64
  )

  addr = 'rpJtt64FNNtaEBgqbJcrrunucUWJSdKJa2'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x0e &&
      b[1] === 0x5a &&
      b[2] === 0x83 &&
      b[3] === 0x89 &&
      b[4] === 0xc0 &&
      b[5] === 0x5e &&
      b[6] === 0x56 &&
      b[7] === 0xd1 &&
      b[8] === 0x50 &&
      b[9] === 0xbc &&
      b[10] === 0x45 &&
      b[11] === 0x7b &&
      b[12] === 0x86 &&
      b[13] === 0x46 &&
      b[14] === 0xf1 &&
      b[15] === 0xcf &&
      b[16] === 0xb7 &&
      b[17] === 0xd0 &&
      b[18] === 0xbf &&
      b[19] === 0xd4
  )

  addr = 'rUC2XjZURBYQ8r6i5sqWnhtDmFFdJFobb9'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x7f &&
      b[1] === 0xf5 &&
      b[2] === 0x2d &&
      b[3] === 0xf4 &&
      b[4] === 0x98 &&
      b[5] === 0x2b &&
      b[6] === 0x7c &&
      b[7] === 0x14 &&
      b[8] === 0x7e &&
      b[9] === 0x9a &&
      b[10] === 0x8b &&
      b[11] === 0xeb &&
      b[12] === 0x1a &&
      b[13] === 0x53 &&
      b[14] === 0x60 &&
      b[15] === 0x34 &&
      b[16] === 0x95 &&
      b[17] === 0x42 &&
      b[18] === 0x4a &&
      b[19] === 0x44
  )

  addr = 'rKEsw1ExpKaukXyyPCxeZdAF5V68kPSAVZ'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0xc8 &&
      b[1] === 0x19 &&
      b[2] === 0xe6 &&
      b[3] === 0x2a &&
      b[4] === 0xdd &&
      b[5] === 0x42 &&
      b[6] === 0x48 &&
      b[7] === 0xd6 &&
      b[8] === 0x7d &&
      b[9] === 0xa5 &&
      b[10] === 0x56 &&
      b[11] === 0x66 &&
      b[12] === 0x55 &&
      b[13] === 0xb4 &&
      b[14] === 0xbf &&
      b[15] === 0xde &&
      b[16] === 0x99 &&
      b[17] === 0xcf &&
      b[18] === 0xed &&
      b[19] === 0x96
  )

  addr = 'rEXhVGVWdte28r1DUzfgKLjNiHi1Tn6R7X'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x9f &&
      b[1] === 0x41 &&
      b[2] === 0x26 &&
      b[3] === 0xa3 &&
      b[4] === 0x6d &&
      b[5] === 0x56 &&
      b[6] === 0x01 &&
      b[7] === 0xc8 &&
      b[8] === 0x09 &&
      b[9] === 0x63 &&
      b[10] === 0x76 &&
      b[11] === 0xed &&
      b[12] === 0x4c &&
      b[13] === 0x45 &&
      b[14] === 0x66 &&
      b[15] === 0x63 &&
      b[16] === 0x16 &&
      b[17] === 0xc9 &&
      b[18] === 0x5c &&
      b[19] === 0x80
  )

  addr = 'r3TcfPNEvidJ2LkNoFojffcCd7RgT53Thg'
  b = util_accid(addr)
  ASSERT(20 === b.length)
  ASSERT(
    b[0] === 0x51 &&
      b[1] === 0xd1 &&
      b[2] === 0x00 &&
      b[3] === 0xff &&
      b[4] === 0x0d &&
      b[5] === 0x92 &&
      b[6] === 0x18 &&
      b[7] === 0x73 &&
      b[8] === 0x80 &&
      b[9] === 0x30 &&
      b[10] === 0xc5 &&
      b[11] === 0x1a &&
      b[12] === 0xf2 &&
      b[13] === 0x9f &&
      b[14] === 0x52 &&
      b[15] === 0x8e &&
      b[16] === 0xb8 &&
      b[17] === 0x63 &&
      b[18] === 0x08 &&
      b[19] === 0x7c
  )

  accept('', 0)
}
