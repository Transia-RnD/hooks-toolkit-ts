/**
 * 
 */
#include "hookapi.h"


int64_t hook(uint32_t reserved) {
    TRACESTR("filter_on_xrp: Start.");

    // FILTER ON AMOUNT: XRP
    unsigned char amount_buffer[48];
    int64_t amount_len = otxn_field(SBUF(amount_buffer), sfAmount);
    if (amount_len != 8) {
        rollback(SBUF("filter_on_xrp: Ignoring non XRP Transaction"), __LINE__);
    }

    int64_t amount_drops = AMOUNT_TO_DROPS(amount_buffer);
    TRACEVAR(amount_drops) // <- amount as xrp
    
    // Your code here...

    TRACESTR("filter_on_xrp: End.");
    accept(SBUF("filter_on_xrp: Finished."), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}