/**
 * Test/Show the tx parameter functionality
 */
#include "hookapi.h"

#define AMOUNT_OUT (data + 0U)


int64_t hook(uint32_t reserved) {
    TRACESTR("slot_subfield_float: Start.");

    // AMOUNT: 
    int64_t amount = -1;
    otxn_slot(1);
    
    if (slot_subfield(1, sfAmount, 1) == 1)
    {
        amount = slot_float(1);
    }
    TRACEVAR(amount); // <- value
    // 6107881094714392576

    uint8_t data[73];
    
    TRACEHEX(data);
    // 0080C6A47E8DC354

    // Your code here...

    TRACESTR("slot_subfield_float: End.");
    accept(SBUF(data), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}