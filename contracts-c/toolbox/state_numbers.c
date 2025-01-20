/**
 * 
 */
#include "hookapi.h"

#define UINT8_FROM_BUF(buf)\
    (((uint8_t)((buf)[0]) <<  0))
    
#define UINT8_TO_BUF(buf_raw, i)\
{\
    unsigned char* buf = (unsigned char*)buf_raw;\
    buf[0] = (((uint8_t)i) >> 0) & 0xFFUL;\
    if (i < 0) buf[0] |= 0x80U;\
}

#define MODEL_SIZE 15U
#define _8_OFFSET 0U
#define _16_OFFSET 1U
#define _32_OFFSET 3U
#define _64_OFFSET 7U

int64_t hook(uint32_t reserved) {
    TRACESTR("state_numbers: Start.");

    // ACCOUNT: Origin Tx Account
    uint8_t otx_acc[20];
    otxn_field(otx_acc, 20, sfAccount);
    
    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(SBUF(hook_acc));

    // FILTER ON: ACCOUNT
    if (!BUFFER_EQUAL_20(hook_acc, otx_acc))
        DONE("state_numbers: incoming tx on `Account`.");

    uint8_t m_buffer[MODEL_SIZE];
    uint8_t m_key[1] = {'M'};
    otxn_param(SBUF(m_buffer), SBUF(m_key));
    TRACEHEX(m_buffer);

    uint8_t model_buffer[MODEL_SIZE];
    int64_t test = state(SBUF(model_buffer), hook_acc, 20);
    TRACEVAR(test);
    if (state(SBUF(model_buffer), hook_acc, 20) == DOESNT_EXIST)
    {
        state_set(SBUF(m_buffer), hook_acc, 20);
        accept(SBUF("state_numbers.c: Setting State"), __LINE__);
    }

    TRACEHEX(model_buffer);
#define _8_OUT (model_buffer + _8_OFFSET)
#define _16_OUT (model_buffer + _16_OFFSET)
#define _32_OUT (model_buffer + _32_OFFSET)
#define _64_OUT (model_buffer + _64_OFFSET)
    

    // int8_t int8 = UINT8_FROM_BUF(model_buffer + _8_OFFSET);
    // TRACEVAR(int8);
    UINT8_TO_BUF(_8_OUT, UINT8_FROM_BUF(model_buffer + _8_OFFSET) + 1);
    UINT16_TO_BUF(_16_OUT, UINT16_FROM_BUF(model_buffer + _16_OFFSET) + 1);
    UINT32_TO_BUF(_32_OUT, UINT32_FROM_BUF(model_buffer + _32_OFFSET) + 1);
    UINT64_TO_BUF(_64_OUT, UINT64_FROM_BUF(model_buffer + _64_OFFSET) + 1);

    state_set(SBUF(model_buffer), hook_acc, 20);

    TRACESTR("state_numbers: End.");
    accept(0, 0, __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}