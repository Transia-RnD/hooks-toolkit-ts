/**
 * This hook just accepts any transaction coming through it
 */
#include "hookapi.h"

#define LCG_MULTIPLIER 1103515245
#define LCG_INCREMENT 12345
#define LCG_MODULUS (1U << 31)

// Macro to generate a seed from the hash provided by ledger_nonce
#define GENERATE_SEED(hash, hash_size, seed) do { \
    seed = 0; \
    for (int i = 0; GUARD(32), i < sizeof(seed); ++i) { \
        seed ^= ((unsigned int)hash[i] & 0xFF) << (i * 8); \
    } \
} while(0)

// Macro for the LCG function to generate a pseudo-random number
#define LCG_RAND(seed) \
    ((seed) = (LCG_MULTIPLIER * (seed) + LCG_INCREMENT) % LCG_MODULUS)

// Macro to generate a random number in the range [0, count)
#define GENERATE_RANDOM(hash, hash_size, count, random) do { \
    unsigned int seed; \
    GENERATE_SEED(hash, hash_size, seed); \
    LCG_RAND(seed); \
    random = seed % count; \
} while(0)

int64_t hook(uint32_t reserved ) {
    uint64_t hash[32];
    ledger_nonce(hash, 32);
    int64_t random_number;
    GENERATE_RANDOM(hash, 32, 100, random_number);
    TRACEVAR(random_number);
    TRACESTR("random: End.");
    accept(SBUF("random: Finished."), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}