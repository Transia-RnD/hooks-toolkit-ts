#include "hookapi.h"

int64_t hook(uint32_t reserved) {
    TRACESTR("tsh_weak.c: Start.");
    TRACEVAR(reserved);

    uint8_t hook_accid[20];
    hook_account(SBUF(hook_accid));
    TRACEHEX(hook_accid);

    uint8_t otx_acc[SFS_ACCOUNT];
    otxn_field(otx_acc, SFS_ACCOUNT, sfAccount);
    TRACEHEX(otx_acc);

    int64_t tt = otxn_type();
    TRACEVAR(tt);

    switch (reserved)
    {
    case 0:
        TRACESTR("tsh_weak.c: Strong.");
        break;
    case 1:
        TRACESTR("tsh_weak.c: Weak.");
        break;
    case 2:
        TRACESTR("tsh_weak.c: Weak Again.");
        break;
    default:
        break;
    }

    TRACESTR("tsh_weak.c: End.");
    accept(SBUF("tsh_weak.c: Finished."), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}