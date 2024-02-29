/**
 * This hook gets the ENCODED from uri and uri_len parameters
 */
 
#include "hookapi.h"
#include <stdint.h>

// VL COMMON
#define ENCODE_VL_UNCOMMON(buf_out, vl, vl_len, field, field2)\
    {\
        buf_out[0] = 0x75U;\
        buf_out[1] = field;\
        buf_out[2] = field2;\
        *(uint64_t*)(buf_out +  2) = *(uint64_t*)(vl +  0);\
        *(uint64_t*)(buf_out + 10) = *(uint64_t*)(vl +  8);\
        *(uint64_t*)(buf_out + 18) = *(uint64_t*)(vl + 16);\
        *(uint64_t*)(buf_out + 26) = *(uint64_t*)(vl + 24);\
        *(uint64_t*)(buf_out + 34) = *(uint64_t*)(vl + 32);\
        *(uint64_t*)(buf_out + 42) = *(uint64_t*)(vl + 40);\
        *(uint64_t*)(buf_out + 50) = *(uint64_t*)(vl + 48);\
        buf_out += vl_len;\
    }
#define _07_XX_ENCODE_VL_UNCOMMON(buf_out, vl, vl_len, field, field2)\
    ENCODE_VL_UNCOMMON(buf_out, vl, vl_len, field, field2)\

#define ENCODE_VL_COMMON(buf_out, vl, vl_len)\
    {\
        buf_out[0] = 0x75U;\
        buf_out[1] = vl_len;\
        *(uint64_t*)(buf_out +  2) = *(uint64_t*)(vl +  0);\
        *(uint64_t*)(buf_out + 10) = *(uint64_t*)(vl +  8);\
        *(uint64_t*)(buf_out + 18) = *(uint64_t*)(vl + 16);\
        *(uint64_t*)(buf_out + 26) = *(uint64_t*)(vl + 24);\
        *(uint64_t*)(buf_out + 34) = *(uint64_t*)(vl + 32);\
        *(uint64_t*)(buf_out + 42) = *(uint64_t*)(vl + 40);\
        *(uint64_t*)(buf_out + 50) = *(uint64_t*)(vl + 48);\
        buf_out += vl_len;\
    }
#define _07_XX_ENCODE_VL_COMMON(buf_out, vl, vl_len)\
    ENCODE_VL_COMMON(buf_out, vl, vl_len)\

// URI
// URI_SIZE is included in the macro.
#define ENCODE_URI(buf_out, vl, vl_len) \
    if (vl_len <= 193) {\
        ENCODE_VL_COMMON(buf_out, vl, vl_len);\
    }\
    else if (vl_len <= 12480) {\
        vl_len -= 193;\
        int byte1 = (vl_len >> 8) + 193;\
        int byte2 = vl_len & 0xFFU;\
        ENCODE_VL_UNCOMMON(buf_out, vl, vl_len, byte1, byte2);\
    else if (vl_len <= 918744) {\
        vl_len -= 12481;\
        int byte1 = 241 + (vl_len >> 16);\
        int byte2 = (vl_len >> 8) & 0xFFU;\
        int byte3 = vl_len & 0xFFU;\
        ENCODE_VL_UNUNCOMMON(buf_out, vl, vl_len, byte1, byte2, byte3);\
    }
#define _07_05_ENCODE_URI(buf_out, vl, vl_len)\
    ENCODE_URI(buf_out, vl, vl_len);

// #define PREPARE_URI_TEST_SIZE ?
#define PREPARE_URI_TEST(buf_out_master, uri, uri_len)  \
    {                                          \
        uint8_t *buf_out = buf_out_master;    \
        _07_05_ENCODE_URI(buf_out, uri, uri_len); \
    }

int64_t cbak(uint32_t reserved) { 
    return 0;
}


int64_t hook(uint32_t reserved ) {

    TRACESTR("Accept.c: Called.");

    // IDE: Parameters
    // name: uri
    // value: 697066733A2F2F516D614374444B5A4656767666756676626479346573745A626851483744586831364354707631686F776D424779
    // name: uri_len
    // value: 53

    uint8_t uri_len_name[] = { 0x75U, 0x72U, 0x69U, 0x5FU, 0x6CU, 0x65U, 0x6EU };
    uint8_t uri_len_value[32];
    int64_t uri_len_value_len = hook_param(uri_len_value, 32, uri_len_name, 7);

    TRACEHEX(uri_len_value); // <- value

    uint8_t pname[] = { 0x75U, 0x72U, 0x69U };
    uint8_t uri_value[*uri_len_value];
    int64_t value_len = hook_param(uri_value, uri_len_value, pname, 3);

    TRACEHEX(uri_value); // <- value

    uint64_t vl_len = value_len;
    unsigned char tx_out[vl_len+2];

    PREPARE_URI_TEST(tx_out, uri_value, vl_len);
    
    TRACEHEX(tx_out);

    accept (0,0,0); 

    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}