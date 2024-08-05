/**
 * 
 */
#include "hookapi.h"


int64_t hook(uint32_t reserved) {
    TRACESTR("state_basic: Start.");

    // ACCOUNT: Origin Tx Account
    uint8_t otx_acc[20];
    otxn_field(otx_acc, 20, sfAccount);
    
    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(SBUF(hook_acc));

    // FILTER ON: ACCOUNT
    if (!BUFFER_EQUAL_20(hook_acc, otx_acc))
        DONE("state_basic: incoming tx on `Account`.");

    int64_t count[1];
    state(SBUF(count), hook_acc, 20);

    count[0]++;

    state_set(SBUF(count), hook_acc, 20);

    TRACEVAR(count[0]) // <- count

    // Your code here...

    TRACESTR("state_basic: End.");
    accept(SBUF(count), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}