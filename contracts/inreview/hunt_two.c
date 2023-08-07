/**
 * This hook just accepts any transaction coming through it
 */
#include "hookapi.h"

#define SAPHIRE_HEX_SIZE 7
uint8_t SAPHIRE_HEX[SAPHIRE_HEX_SIZE] = 
{
    0x73, 0x61, 0x70, 0x68, 0x69, 0x72, 0x65
};

#define AMBER_HEX_SIZE 5
uint8_t AMBER_HEX[AMBER_HEX_SIZE] = 
{
    0x61, 0x6D, 0x62, 0x65, 0x72
};

int64_t hook(uint32_t reserved ) {

    TRACESTR("hunt_two.c: called");

    // HOOK ON: TT
    int64_t tt = otxn_type();
    if (tt != ttINVOKE)
    {
        rollback(SBUF("hunt_two.c: HookOn field is incorrectly set."), INVALID_TXN);
    }

    uint8_t otx_acc[20];
    otxn_field(otx_acc, 20, sfAccount);

    uint8_t hook_acc[SFS_ACCOUNT];
    hook_account(SBUF(hook_acc));

    if (BUFFER_EQUAL_20(hook_acc, otx_acc))
        DONE("hunt_two.c: outgoing tx on `Account`.");

    uint8_t l2_s[70];
    uint8_t l2_skey[3] = {'L', '2', 'A'};
    hook_param(l2_s, 70, SBUF(l2_skey));

    uint8_t state_key[25];
    for (int i = 0; GUARD(5), i < 5; i++) {
        state_key[i] = AMBER_HEX[i];
    }
    for (int i = 0; GUARD(20), i < 20; i++) {
        state_key[i + 5] = otx_acc[i];
    }
    TRACEHEX(state_key);

    uint8_t _amber[70];
    if (state(SBUF(_amber), state_key, 25) == 70)
    {
        accept(SBUF("hunt_two.c: User has amber gem."), __LINE__);
    }

    uint8_t saphire_key[27];
    for (int i = 0; GUARD(7), i < 7; i++) {
        saphire_key[i] = SAPHIRE_HEX[i];
    }
    for (int i = 0; GUARD(20), i < 20; i++) {
        saphire_key[i + 7] = otx_acc[i];
    }
    TRACEHEX(saphire_key);

    uint8_t l1_n[32];
    uint8_t l1n_key[3] = {'L', '1', 'N'};
    if (otxn_param(l1_n, 32, SBUF(l1n_key)) != 32)
    {
        DONE("hunt_two.c: invalid tx param.");
    }
    TRACEHEX(l1_n);

    uint8_t l1_a[20] = {
        0xAE, 0x12, 0x3A, 0x85, 0x56, 0xF3, 0xCF, 0x91, 
        0x15, 0x47, 0x11, 0x37, 0x6A, 0xFB, 0x0F, 0x89, 
        0x4F, 0x83, 0x2B, 0x3D
    };

    uint8_t _saphire[33];
    if (state_foreign(SBUF(_saphire), SBUF(saphire_key), SBUF(l1_n), SBUF(l1_a)) < 0)
        rollback(SBUF("hunt_two.c: Could not get foreign state"), __LINE__);

    TRACEHEX(l2_s);

    if (state_set(SBUF(l2_s), state_key, 25) != 70)
    {
        rollback(SBUF("hunt_two.c: Could not set state"), __LINE__);
    }

    accept(SBUF("hunt_two.c: User does not have amber gem."), __LINE__);
    // unreachable
    return 0;
}