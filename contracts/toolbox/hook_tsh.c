/**
 *
 */
#include "hookapi.h"

int64_t hook(uint32_t reserved) {

    TRACESTR("hook_tsh.c: Called.");

    // ACCOUNT: Origin Tx Account
    uint8_t otx_acc[20];
    otxn_field(otx_acc, 20, sfAccount);
    TRACEHEX(otx_acc);

    // ACCOUNT: Hook Account
    uint8_t hook_acc[SFS_ACCOUNT];
    hook_account(SBUF(hook_acc));

    // TSH: WEAK vs STRONG
    if (reserved == 0)
    {
        TRACEHEX(hook_acc);
        TRACESTR("strong execution");
    }

    if (reserved == 1)
    {
        TRACEHEX(hook_acc);
        TRACESTR("weak execution");
    }

    if (reserved == 2)
    {
        TRACEHEX(hook_acc);
        TRACESTR("weak hook again");
    }

    accept (0,0,0); 

    _g(1,1);
    // unreachable
    return 0;
}