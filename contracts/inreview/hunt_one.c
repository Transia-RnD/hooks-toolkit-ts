/**
 *
 */
#include "hookapi.h"

#define SAPHIRE_HEX_SIZE 7
uint8_t SAPHIRE_HEX[SAPHIRE_HEX_SIZE] = 
{
    0x73, 0x61, 0x70, 0x68, 0x69, 0x72, 0x65
};

int64_t hook(uint32_t reserved ) {

    TRACESTR("hunt_one.c: called");

    // HOOK ON: TT
    int64_t tt = otxn_type();
    if (tt != ttINVOKE)
    {
        rollback(SBUF("hunt_one.c: HookOn field is incorrectly set."), INVALID_TXN);
    }

    uint8_t otx_acc[20];
    otxn_field(otx_acc, 20, sfAccount);

    uint8_t hook_acc[SFS_ACCOUNT];
    hook_account(SBUF(hook_acc));

    if (BUFFER_EQUAL_20(hook_acc, otx_acc))
        DONE("hunt_one.c: outgoing tx on `Account`.");

    uint8_t l1_pk[33];
    uint8_t l1_pkkey[4] = {'L', '1', 'P', 'K'};
    int64_t l1_len = hook_param(l1_pk, 33, SBUF(l1_pkkey));
    if (hook_param(l1_pk, 33, SBUF(l1_pkkey)) != 33)
    {
        DONE("hunt_one.c: invalid hook parameter`.");
    }

    uint8_t l1_s[70];
    uint8_t l1_skey[3] = {'L', '1', 'S'};
    if (otxn_param(l1_s, 70, SBUF(l1_skey)) != 70)
    {
        DONE("hunt_one.c: invalid hook otxn parameter`.");
    }

    uint8_t saphire[33] =
    {
        0x03, 0xAA, 0xB3, 0xE2, 0x06, 0x77, 0xD8, 0x9E, 0x05, 0x4F, 
        0xEA, 0x8C, 0x31, 0xE6, 0x5B, 0xA8, 0x94, 0x8F, 0xB6, 0xDA, 
        0x1F, 0x87, 0x33, 0x7C, 0xD6, 0x97, 0xD7, 0x84, 0x3C, 0x79, 
        0x1E, 0x8A, 0xD5
    };

    uint8_t state_key[32];
    state_key[0] =  0x07;
    for (int i = 0; GUARD(7), i < 7; i++) {
        state_key[i+1] = SAPHIRE_HEX[i];
    }
    for (int i = 0; GUARD(20), i < 20; i++) {
        state_key[i + 12] = otx_acc[i];
    }

    uint8_t _saphire[33];
    if (state(SBUF(_saphire), state_key, 32) == 33)
    {
        accept(SBUF("hunt_one.c: State exists."), __LINE__);
    }

    if (util_verify(SBUF(otx_acc), SBUF(l1_s), SBUF(l1_pk)) == 0)
    {
         accept(SBUF("hunt_one.c: Invalid signature."), __LINE__);
    }

    state_set(SBUF(saphire), state_key, 32);

    accept(SBUF("hunt_one.c: Saphire gem received."), __LINE__);
    // unreachable
    return 0;
}