/**
 * 
 */
#include "hookapi.h"

#define PARAM_NAME_SIZE 4
#define PARAM_NAME ((uint8_t[PARAM_NAME_SIZE]){ \
    0x54U, 0x45U, 0x53U, 0x54U})

int64_t hook(uint32_t reserved) {
    TRACESTR("state_advanced: Start.");

    // ACCOUNT: Origin Tx Account
    uint8_t otx_acc[SFS_ACCOUNT];
    otxn_field(otx_acc, SFS_ACCOUNT, sfAccount);
    
    // ACCOUNT: Hook Account
    uint8_t hook_acc[SFS_ACCOUNT];
    hook_account(SBUF(hook_acc));

    // FILTER ON: ACCOUNT
    if (!BUFFER_EQUAL_20(hook_acc, otx_acc))
        DONE("state_advanced: incoming tx on `Account`.");

    uint8_t otxn_param_value[29];
    int64_t otxn_param_size = otxn_param(otxn_param_value, 29, PARAM_NAME, PARAM_NAME_SIZE);
    TRACEHEX(otxn_param_value);

    uint8_t state_value[29];
    state(SBUF(state_value), hook_acc, SFS_ACCOUNT);

    state_set(SBUF(otxn_param_value), hook_acc, SFS_ACCOUNT);

    TRACEVAR(state_value) // <- value

    // Your code here...

    TRACESTR("state_advanced: End.");
    accept(SBUF(state_value), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}