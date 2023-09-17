#include "hookapi.h"

int64_t hook(uint32_t reserved) {
    TRACESTR("tsh.c: Start.");

    uint8_t hook_accid[20];
    hook_account(SBUF(hook_accid));
    TRACEHEX(hook_accid);

    uint8_t otx_acc[20];
    otxn_field(otx_acc, 20, sfAccount);
    TRACEHEX(otx_acc);

    int64_t tt = otxn_type();
    TRACEVAR(tt);

    // 

    switch (reserved)
    {
    case 0:
        TRACESTR("tsh.c: Strong. Execute BEFORE transaction is applied to ledger");
        break;
    case 1:
        TRACESTR("tsh.c: Weak. Execute AFTER transaction is applied to ledger");
        break;
    case 2:
        TRACESTR("tsh.c: Weak Again. Execute AFTER transaction is applied to ledger");
        break;
    default:
        break;
    }

    TRACESTR("tsh.c: End.");
    accept(SBUF("tsh.c: Finished."), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}