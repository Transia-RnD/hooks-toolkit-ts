const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

// #define TOO_SMALL -4
// #define TOO_BIG -3
// #define OUT_OF_BOUNDS -1
// #define MEM_OVERLAP -43
// #define PARSE_ERROR -18
// #define DOESNT_EXIST -5

const sto = [
  0x11, 0x00, 0x61, 0x22, 0x00, 0x00, 0x00, 0x00, 0x24, 0x04, 0x1f, 0x94, 0xd9,
  0x25, 0x04, 0x5e, 0x84, 0xb7, 0x2d, 0x00, 0x00, 0x00, 0x00, 0x55, 0x13, 0x40,
  0xb3, 0x25, 0x86, 0x31, 0x96, 0xb5, 0x6f, 0x41, 0xf5, 0x89, 0xeb, 0x7d, 0x2f,
  0xd9, 0x4c, 0x0d, 0x7d, 0xb8, 0x0e, 0x4b, 0x2c, 0x67, 0xa7, 0x78, 0x2a, 0xd6,
  0xc2, 0xb0, 0x77, 0x50, 0x62, 0x40, 0x00, 0x00, 0x00, 0x00, 0xa4, 0x79, 0x94,
  0x81, 0x14, 0x37, 0xdf, 0x44, 0x07, 0xe7, 0xaa, 0x07, 0xf1, 0xd5, 0xc9, 0x91,
  0xf2, 0xd3, 0x6f, 0x9e, 0xb8, 0xc7, 0x34, 0xaf, 0x6c,
]

const INVALID_ARGUMENT = -7

// test_sto_erase
const Hook = (arg) => {
  trace('Hook: ', 0, false)

  // Test out of bounds check
  ASSERT(sto_erase(1000000, 32, 0, 32, 1) == OUT_OF_BOUNDS)
  ASSERT(sto_erase(0, 1000000, 0, 32, 1) == OUT_OF_BOUNDS)
  ASSERT(sto_erase(0, 32, 1000000, 32, 1) == OUT_OF_BOUNDS)
  ASSERT(sto_erase(0, 32, 64, 1000000, 1) == OUT_OF_BOUNDS)

  // // Test size check
  // {
  //     // write buffer too small
  //     ASSERT(sto_erase(0,1, 0,2, 1) == TOO_SMALL);
  //     ASSERT(sto_erase(0, 32000, 0, 17000,  1) == TOO_BIG);
  // }

  // uint8_t buf[1024];

  // // Test overlapping memory
  // ASSERT(sto_erase(buf, 1024, buf+1, 512, 1) == MEM_OVERLAP);
  // ASSERT(sto_erase(buf+1, 1024, buf, 512, 1) == MEM_OVERLAP);

  // // erase field 22
  // {
  //     ASSERT(sto_erase(
  //                 buf, sizeof(buf),
  //                 sto, sizeof(sto), 0x20002U) ==
  //             sizeof(sto) - 5);

  //     ASSERT(buf[0] == sto[0] && buf[1] == sto[1] && buf[2] == sto[2]);
  //     for (int i = 3; GUARD(sizeof(sto) + 1),  i < sizeof(sto) - 5;  ++i)
  //         ASSERT(sto[i+5] == buf[i]);
  // }

  // // test front erasure
  // {
  //     ASSERT(sto_erase(
  //                 buf, sizeof(buf),
  //                 sto, sizeof(sto), 0x10001U) ==
  //             sizeof(sto) - 3);

  //     for (int i = 3; GUARD(sizeof(sto) + 1),  i < sizeof(sto) - 3;  ++i)
  //         ASSERT(sto[i] == buf[i-3]);
  // }

  // // test back erasure
  // {
  //     ASSERT(sto_erase(
  //                 buf, sizeof(buf),
  //                 sto, sizeof(sto), 0x80001U) ==
  //             sizeof(sto) - 22);

  //     for (int i = 0; GUARD(sizeof(sto) - 21),  i < sizeof(sto)-22;  ++i)
  //         ASSERT(sto[i] == buf[i]);
  // }

  // // test not found
  // {
  //     ASSERT(sto_erase(
  //                 buf, sizeof(buf),
  //                 sto, sizeof(sto), 0x80002U) ==
  //             DOESNT_EXIST);

  //     for (int i = 0; GUARD(sizeof(sto) +1),  i < sizeof(sto);  ++i)
  //         ASSERT(sto[i] == buf[i]);
  // }

  // // test total erasure
  // {
  //     uint8_t rep[] = {0x22,0x10,0x20,0x30,0x40U};
  //     ASSERT(sto_erase(buf, sizeof(buf), rep, sizeof(rep), 0x20002U) ==
  //             0);

  // }

  return accept(0, 0)
}

export { Hook }
