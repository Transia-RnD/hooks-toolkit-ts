#include "hookapi.h"

int64_t hook(uint32_t reserved) {
    TRACESTR("Base.c: Called.");
    _g(1,1);
    return accept(SBUF("base: Finished."), __LINE__);;
}