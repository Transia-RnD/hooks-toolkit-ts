/**
 *
 */
#include "hookapi.h"


int64_t hook(uint32_t reserved) {
    TRACESTR("filter_on_io: Start.");

    // ACCOUNT: Origin Tx Account
    uint8_t otx_acc[SFS_ACCOUNT];
    otxn_field(otx_acc, SFS_ACCOUNT, sfAccount);
    
    // ACCOUNT: Hook Account
    uint8_t hook_acc[SFS_ACCOUNT];
    hook_account(SBUF(hook_acc));

    // FILTER ON: ACCOUNT
    if (BUFFER_EQUAL_20(hook_acc, otx_acc))
        DONE("filter_on_io: outgoing tx on `Account`.");

    // Your code here...

    TRACESTR("filter_on_io: End.");
    accept(SBUF("filter_on_io: Finished."), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}