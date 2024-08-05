/**
 *
 */
#include "hookapi.h"

#define float_subtract(float1, float2)\
{\
    float_sum(float1, float_negate(float2))\
}\

int64_t hook(uint32_t reserved) {

    TRACESTR("float_subtract.c: Called.");

    uint64_t xlfone = 6125895493223874560;
    uint64_t xlftwo = 6107881094714392576;

    uint64_t response = float_subtract(xlfone, xlftwo);
    TRACEVAR(response);

    accept(SBUF("float_subtract.c: Finished."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}