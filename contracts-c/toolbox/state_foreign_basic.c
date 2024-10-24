/**
 * Test/Show the state foreign functionality
 */
#include "hookapi.h"


int64_t hook(uint32_t reserved ) {
    TRACESTR("state_foreign_basic: Start.");
    
    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(SBUF(hook_acc));

    // PARAM: Foreign Account
    uint8_t param_aname[2] = {'F', 'A'};
    uint8_t param_a[20];
    hook_param(SBUF(param_a), SBUF(param_aname));
    TRACEHEX(param_a) // <- foreign state account

    // PARAM: Foreign Key
    uint8_t param_kname[2] = {'F', 'K'};
    uint8_t param_k[32];
    hook_param(SBUF(param_k), SBUF(param_kname));
    TRACEHEX(param_k) // <- foreign state key

    // PARAM: Foreign Namespace
    uint8_t param_nname[2] = {'F', 'N'};
    uint8_t param_n[32];
    hook_param(SBUF(param_n), SBUF(param_nname));
    TRACEHEX(param_n) // <- foreign namespace

    int64_t count[1];
    if (state_foreign(SBUF(count), SBUF(param_k), SBUF(param_n), SBUF(param_a)) < 0)
        rollback(SBUF("state_foreign_basic: Could not get foreign state"), __LINE__);

    count[0]++;

    if (state_foreign_set(SBUF(count), SBUF(param_k), SBUF(param_n), SBUF(param_a)) < 0)
        rollback(SBUF("state_foreign_basic: Could not set foreign state"), __LINE__);

    TRACEHEX(param_n) // <- ns
    TRACEVAR(count[0]) // <- count

    _g(1, 1);
    TRACESTR("state_foreign_basic: End.");
    return accept(SBUF(count), __LINE__);
}