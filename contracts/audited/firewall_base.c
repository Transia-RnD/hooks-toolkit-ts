#include "hookapi.h"
#include <stdint.h>
/**
    This hook is an omnibus hook that contains 2 different hooks' functionalities. Each of these
    can be enabled or disabled and configured using the provided install-time hook parameter as
    described below:

    All integer values are little endian unless otherwise marked

    1. Provider Hook
        Invoke TT
        Blob of accounts to block

    2. Firewall Hook
        If enabled HookOn must be uint256max
        Parameter Name: 0x4650 ('FP')
        Parameter Value: <20 byte account ID of blocklist provider>
        Parameter Name: 0x4649 ('FI')
        Parameter Value: <uint256 bit field of allowable transaction types in>
        Parameter Name: 0x464F ('FO')
        Parameter Value: <uint256 bit field of allowable transaction types out>
        Parameter Name: 0x4644 ('FD')
        Parameter Value: minimum drops threshold for incoming XRP payments (xfl LE)
        Parameter Name: 0x4654 ('FT')
        Parameter Value: minimum threshold for incoming trustline payments (xfl LE)

**/

uint8_t tts[32] = {
    0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU,
    0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU, 0xFFU
};
            
int64_t hook(uint32_t r)
{
    _g(1,1);
    
    // ACCOUNT:
    uint8_t otxn_account[20];
    otxn_field(SBUF(otxn_account), sfAccount);

    // ACCOUNT:
    uint8_t hook_acc[20];
    hook_account(SBUF(hook_acc));

    // TT: Filter SetHook
    uint32_t tt = otxn_type();
    if (tt == ttHOOK_SET)
        accept(SBUF("Firewall: Ignoring SetHook txn"), __LINE__);

    uint8_t outgoing = BUFFER_EQUAL_20(hook_acc, otxn_account);

    // AMOUNT: 
    int64_t amount = -1;
    int64_t amount_native;
    otxn_slot(1);
    
    if (slot_subfield(1, sfAmount, 1) == 1)
    {
        amount = slot_float(1);
        amount_native = slot_size(1) == 8;
    }

    // AMOUNT: Validation
    if (amount < 0) {
        DONEMSG("Firewall: Ignoring negative amount");
    }

    // FLAGS:
    uint8_t flagbuf[4];
    otxn_field(SBUF(flagbuf), sfFlags);

    // FOREIGN STATE: Filter Block List
    {
        uint8_t param_name[2] = {'F', 'P'};
        uint8_t provider[20];
        hook_param(SBUF(provider), SBUF(param_name));
        uint8_t dummy[64];
        if (state_foreign(dummy, 32, SBUF(otxn_account), dummy + 32, 32, SBUF(provider)) > 0)
            rollback(SBUF("Blocklist match"), __LINE__);
    }

    // PARAMETERS: Fitler Transaction Type
    {
        uint8_t param_name[2] = {'F', outgoing ? 'O' : 'I'};
        hook_param(tts, 32, SBUF(param_name));
        if (tts[tt >> 3] & (1 << (tt % 8))) {
            rollback(SBUF("Firewall: blocking txn type"), __LINE__);
        }
    }

    // AMOUNT: Filter Upper and Lower
    if (amount >= 0)
    {
        if (flagbuf[2] & 2U)
            rollback(SBUF("Firewall blocked incoming partial payment"), __LINE__);

        // default upper threshold is 0
        int64_t uthreshold = 0LL;
        uint8_t uparam_name[3] = {'F', 'U', amount_native ? 'D' : 'T'};
        hook_param(&uthreshold, 8, SBUF(uparam_name));
        
        // default lower threshold is 9.999999999999999e+95
        int64_t lthreshold = 7810234554605699071LL;
        uint8_t lparam_name[3] = {'F', 'L', amount_native ? 'D' : 'T'};
        hook_param(&lthreshold, 8, SBUF(lparam_name));
        
        if (float_compare(amount, lthreshold, COMPARE_LESS) == 1)
            rollback(SBUF("Firewall: blocking amount below threshold"), __LINE__);
        
        if (float_compare(amount, uthreshold, COMPARE_GREATER) == 1)
            rollback(SBUF("Firewall: blocking amount above threshold"), __LINE__);
    }

    return accept(SBUF("Firewall: Passing txn within thresholds"), __LINE__);
}