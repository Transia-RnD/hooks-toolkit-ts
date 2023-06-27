/**
 * 
 */
#include "hookapi.h"


int64_t hook(uint32_t reserved) {
    TRACESTR("hook_on_tt: Start.");

    int64_t tt = otxn_type();
    TRACEVAR(tt);

    // HOOK ON: TT
    if (tt != ttINVOKE)
    {
        rollback(SBUF("hook_on_tt: HookOn field is incorrectly set."), INVALID_TXN);
    }

    // Your code here...

    TRACESTR("hook_on_tt: End.");
    accept(SBUF("hook_on_tt: Finished."), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}