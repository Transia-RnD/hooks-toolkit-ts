/**
 *
 */
#include "hookapi.h"

int64_t hook(uint32_t reserved) {

    TRACESTR("random.c: Called.");

    int64_t seq = ledger_seq();
    // Combine the ledger index and account name to create a unique seed
    unsigned int seed = seq;

    // Use the current time to add more entropy to the seed
    int64_t ts = ledger_last_time();
    seed ^= ts;

    // Simple pseudo-random number generation
    seed = seed * 1103515245 + 12345;
    int random_number = (seed / 65536) % 100; // Mimicking rand() range

    TRACEVAR(random_number);

    accept(SBUF("random.c: Finished."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}