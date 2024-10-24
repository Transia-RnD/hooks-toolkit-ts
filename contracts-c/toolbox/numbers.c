/**
 *
 */
#include "hookapi.h"

#define BUFFER_EQUAL_8(buf1, buf2) \
    ( \
        (*((uint64_t*)(buf1) + 0) == *((uint64_t*)(buf2) + 0)) \
    )

#define BUFFER_EQUAL_4(buf1, buf2) \
    ( \
        (*((uint32_t*)(buf1) + 0) == *((uint32_t*)(buf2) + 0)) \
    )

#define BUFFER_EQUAL_2(buf1, buf2) \
    ( \
        (*((uint16_t*)(buf1) + 0) == *((uint16_t*)(buf2) + 0)) \
    )

#define BUFFER_EQUAL_1(buf1, buf2) \
    ( \
        (*((uint8_t*)(buf1) + 0) == *((uint8_t*)(buf2) + 0)) \
    )

#define UINT8_FROM_BUF(buf)\
    (((uint8_t)((buf)[0]) <<  0))
    
#define UINT8_TO_BUF(buf_raw, i)\
{\
    unsigned char* buf = (unsigned char*)buf_raw;\
    buf[0] = (((uint8_t)i) >> 0) & 0xFFUL;\
    if (i < 0) buf[0] |= 0x80U;\
}

#define INTEGER 123
#define XFL 6126125493223874560
#define INTEGER_8 11
#define XFL_8 6107981094714392576

int64_t hook(uint32_t reserved) {

    TRACESTR("numbers.c: Called.");

    // ACCOUNT: Origin Tx Account
    uint8_t otxn_accid[20];
    otxn_field(otxn_accid, 20, sfAccount);


    // integer 64
    uint8_t i64_buff[8];
    uint8_t i64_key[3] = {'I', '6', '4'};
    otxn_param(SBUF(i64_buff), SBUF(i64_key));
    int64_t i64 = UINT64_FROM_BUF(i64_buff);
    
    uint8_t i64dump[8];
    UINT64_TO_BUF(i64dump, i64);

    if (!BUFFER_EQUAL_8(i64dump, i64_buff))
    {
        rollback(SBUF("numbers.c: Invalid conversion `i64 buffer`."), __LINE__);
    }

    if (i64 != INTEGER)
    {
        rollback(SBUF("numbers.c: Invalid conversion `i64`."), __LINE__);
    }

    int64_t i64_xfl = float_set(0, i64);
    if (float_compare(i64_xfl, XFL, COMPARE_EQUAL) == 0)
    {
        rollback(SBUF("numbers.c: Invalid conversion `i64 XFL`."), __LINE__);
    }

    // integer 32
    uint8_t i32_buff[4];
    uint8_t i32_key[3] = {'I', '3', '2'};
    otxn_param(SBUF(i32_buff), SBUF(i32_key));
    int64_t i32 = UINT32_FROM_BUF(i32_buff);
    
    uint8_t i32dump[4];
    UINT32_TO_BUF(i32dump, i32);

    if (!BUFFER_EQUAL_4(i32dump, i32_buff))
    {
        rollback(SBUF("numbers.c: Invalid conversion `i32 buffer`."), __LINE__);
    }

    if (i32 != INTEGER)
    {
        rollback(SBUF("numbers.c: Invalid conversion `i32`."), __LINE__);
    }

    int64_t i32_xfl = float_set(0, i32);
    if (float_compare(i32_xfl, XFL, COMPARE_EQUAL) == 0)
    {
        rollback(SBUF("numbers.c: Invalid conversion `i32 XFL`."), __LINE__);
    }

    // integer 8
    uint8_t i8_buff[1];
    uint8_t i8_key[2] = {'I', '8'};
    otxn_param(SBUF(i8_buff), SBUF(i8_key));
    int64_t i8 = UINT8_FROM_BUF(i8_buff);
    
    uint8_t i8dump[1];
    UINT8_TO_BUF(i8dump, i8);

    if (!BUFFER_EQUAL_1(i8dump, i8_buff))
    {
        rollback(SBUF("numbers.c: Invalid conversion `i8 buffer`."), __LINE__);
    }

    if (i8 != INTEGER_8)
    {
        rollback(SBUF("numbers.c: Invalid conversion `i8`."), __LINE__);
    }

    int64_t i8_xfl = float_set(0, i8);
    if (float_compare(i8_xfl, XFL_8, COMPARE_EQUAL) == 0)
    {
        rollback(SBUF("numbers.c: Invalid conversion `i8 XFL`."), __LINE__);
    }
    
    accept(SBUF("numbers.c: Finished."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}