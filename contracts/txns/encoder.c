/**
 * Encoder Playground
 * You want to use this to check and make "Field Type Encodings". Also known as Serialized Objects.
 * There is an STO that does this but sometimes you also may want to use an _ENCODE macro.
 * 
 */
#include "hookapi.h"



#define PREPARE_TEST(buf_out_master, v)\
{\
    uint8_t *buf_out = buf_out_master;\
    _01_02_ENCODE_TT(buf_out, v);\
}

int64_t hook(uint32_t reserved) {

    TRACESTR("encoder.c: Called.");

    unsigned char tx_out[3];
    PREPARE_TEST(tx_out, ttOFFER_CREATE);
    TRACEHEX(tx_out);

    accept(SBUF("encoder: Finished."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}