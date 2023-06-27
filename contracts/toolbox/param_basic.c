/**
 * Test/Show the tx parameter functionality
 */
#include "hookapi.h"

#define PARAM_NAME_SIZE 4
#define PARAM_NAME ((uint8_t[PARAM_NAME_SIZE]){ \
    0x54U, 0x45U, 0x53U, 0x54U})


int64_t hook(uint32_t reserved) {
    TRACESTR("param_basic: Start.");

    uint8_t param_value[8];
    hook_param(param_value, 8, SBUF(PARAM_NAME));
    TRACEHEX(param_value);
    uint64_t param_amount_drops = float_int(*((int64_t*)param_value), 6, 1);
    TRACEVAR(param_amount_drops); // <- value

    uint8_t otxn_param_value[8];
    int64_t otxn_param_size = otxn_param(otxn_param_value, 8, PARAM_NAME, PARAM_NAME_SIZE);
    TRACEHEX(otxn_param_value);
    uint64_t otxn_param_amount_drops = float_int(*((int64_t*)otxn_param_value), 6, 1);
    TRACEVAR(otxn_param_amount_drops); // <- value

    uint8_t field_value[8];
    int64_t otxn_field_size = otxn_field(field_value, 8,  sfAmount);
    TRACEHEX(field_value);
    int64_t famount_drops = AMOUNT_TO_DROPS(field_value);
    TRACEVAR(famount_drops); // <- value

    // Your code here...

    TRACESTR("param_basic: End.");
    accept(SBUF(param_value), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}