/**
 * 
 */
#include "hookapi.h"

// uint8_t currency[20] = {
//     0x00U,0x00U,0x00U,0x00U,0x00U,0x00U,0x00U,0x00U,0x00U,0x00U,
//     0x00U,0x00U,0x4EU,0x41U,0x56U,0x00U,0x00U,0x00U,0x00U,0x00U
// };


int64_t hook(uint32_t reserved) {
    TRACESTR("filter_on_token: Start.");

    unsigned char amount_buffer[48];
    int64_t amount_len = otxn_field(SBUF(amount_buffer), sfAmount);
    if (amount_len == 8) {
        DONE("filter_on_token: Ignoring XAH Transaction");
    }

    int64_t oslot = otxn_slot(0);
    if (oslot < 0)
        rollback(SBUF("filter_on_token: Could not slot originating txn."), 1);

    int64_t amt_slot = slot_subfield(oslot, sfAmount, 0);
    if (amt_slot < 0)
        rollback(SBUF("filter_on_token: Could not slot otxn.sfAmount"), 2);

    int64_t amount_token = slot_float(amt_slot);
    if (amount_token < 0)
        rollback(SBUF("filter_on_token: Could not parse amount."), 1);
    
    TRACEVAR(amount_token) // <- amount as token
    
    // Your code here...

    TRACESTR("filter_on_token: End.");
    accept(SBUF("filter_on_token: Finished."), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}