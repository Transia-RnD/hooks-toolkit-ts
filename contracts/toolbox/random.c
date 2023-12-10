/**
 *
 */
#include "hookapi.h"

#define INT32_TO_BUF(buf_raw, i)                       \
    {                                                  \
        unsigned char *buf = (unsigned char *)buf_raw; \
        *(uint64_t *)(buf + 0) = *(uint64_t *)(i + 0); \
        *(uint64_t *)(buf + 8) = *(uint64_t *)(i + 8); \
    }

#define ACCOUNT_TO_BUF(buf_raw, i)                       \
    {                                                    \
        unsigned char *buf = (unsigned char *)buf_raw;   \
        *(uint64_t *)(buf + 0) = *(uint64_t *)(i + 0);   \
        *(uint64_t *)(buf + 8) = *(uint64_t *)(i + 8);   \
        *(uint32_t *)(buf + 16) = *(uint32_t *)(i + 16); \
    }

#define RAND_SEED(seed) ((seed) * 1103515245 + 12345)
#define RAND(seed) (((RAND_SEED(seed)) / 65536) % 32768)

int64_t hook(uint32_t reserved) {

    TRACESTR("random.c: Called.");

    // ACCOUNT: Otxn Account
    uint8_t otxn_accid[20];
    otxn_field(otxn_accid, 20, sfAccount);

    int64_t seq = ledger_seq();
    int64_t ts = ledger_last_time();

    uint8_t seed_data[20 + 8 + 8];
#define ACCT_OUT (seed_data + 0U)
    seed_data[20] = seq;
    seed_data[28] = ts;
    ACCOUNT_TO_BUF(ACCT_OUT, otxn_accid);
    TRACEHEX(seed_data);

    uint8_t hash[32];
    util_sha512h(SBUF(hash), SBUF(seed_data));
    TRACEHEX(hash);

    unsigned int seed = 0;
    for (int i = 0; GUARD(32), i < sizeof(seed); ++i) {
        seed |= (unsigned int)hash[i] << (i * 8);
    }
    TRACEVAR(seed);

    uint8_t model[1];
    model[0] = RAND(seed) % 100;
    TRACEVAR(model[0]);

    accept(SBUF("random.c: Finished."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}