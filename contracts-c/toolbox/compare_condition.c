/**
 *
 */
#include "hookapi.h"

#define BUFFER_EQUAL_32(buf1, buf2)\
    (\
        *(((uint64_t*)(buf1)) + 0) == *(((uint64_t*)(buf2)) + 0) &&\
        *(((uint64_t*)(buf1)) + 1) == *(((uint64_t*)(buf2)) + 1) &&\
        *(((uint64_t*)(buf1)) + 2) == *(((uint64_t*)(buf2)) + 2) &&\
        *(((uint64_t*)(buf1)) + 3) == *(((uint64_t*)(buf2)) + 3))

int64_t hook(uint32_t reserved) {

    TRACESTR("compare_condition.c: Called.");

    // ACCOUNT: Origin Tx Account
    uint8_t otxn_accid[20];
    otxn_field(otxn_accid, 20, sfAccount);

    uint8_t param_cond[32];
    uint8_t c_key[1] = {'C'};
    uint8_t condition[32];
    if (state(SBUF(condition), otxn_accid, 20) == DOESNT_EXIST && otxn_param(SBUF(param_cond), SBUF(c_key)))
    {
        state_set(SBUF(param_cond), otxn_accid, 20);
        accept(SBUF("compare_condition.c: Condition Added."), __LINE__);
    }

    uint8_t len_buffer[8];
    uint8_t fl_key[2] = {'F', 'L'};
    otxn_param(SBUF(len_buffer), SBUF(fl_key));
    int64_t flen = INT64_FROM_BUF(len_buffer);
    
    uint8_t param_fulfill[flen];
    uint8_t f_key[1] = {'F'};
    otxn_param(SBUF(param_fulfill), SBUF(f_key));

    uint8_t hash_out[32];
    util_sha512h(SBUF(hash_out), SBUF(param_fulfill));
    if (!BUFFER_EQUAL_32(condition, hash_out)) {
        rollback(SBUF("compare_condition.c: Verification Failed."), __LINE__);
    }

    accept(SBUF("compare_condition.c: Verification Success."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}