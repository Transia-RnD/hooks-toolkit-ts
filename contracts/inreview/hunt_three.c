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

    etxn_reserve(1); // we are going to emit 1 transactions

    TRACESTR("hunt_three.c: called");

    uint8_t otx_acc[20];
    otxn_field(otx_acc, 20, sfAccount);

    // HOOK ON: TT
    int64_t tt = otxn_type();
    if (tt != ttINVOKE)
    {
        rollback(SBUF("hunt_three.c: HookOn field is incorrectly set."), INVALID_TXN);
    }

    uint8_t saphire_key[32];
    saphire_key[0] =  0x07;
    for (int i = 0; GUARD(11), i < 11; i++) {
        saphire_key[i+1] = SAPHIRE_HEX[i];
    }
    for (int i = 0; GUARD(20), i < 20; i++) {
        saphire_key[i + 8] = otx_acc[i];
    }
    TRACEHEX(saphire_key);

    uint8_t l1_n[32];
    uint8_t l1n_key[3] = {'L', '1', 'N'};
    if (otxn_param(l1_n, 32, SBUF(l1n_key)) != 32)
    {
        DONE("hunt_three.c: invalid tx param.");
    }
    TRACEHEX(l1_n);

    uint8_t l1_a[20] = {
        0xAE, 0x12, 0x3A, 0x85, 0x56, 0xF3, 0xCF, 0x91,
        0x15, 0x47, 0x11, 0x37, 0x6A, 0xFB, 0x0F, 0x89,
        0x4F, 0x83, 0x2B, 0x3D
    };

    uint8_t _saphire[33];
    if (state_foreign(SBUF(_saphire), SBUF(saphire_key), SBUF(l1_n), SBUF(l1_a)) < 0)
        DONE("hunt_three.c: User does not have saphire gem");

    uint8_t amber_key[32];
    amber_key[0] =  0x05;
    for (int i = 0; GUARD(5), i < 5; i++) {
        amber_key[i+1] = AMBER_HEX[i];
    }
    for (int i = 0; GUARD(20), i < 20; i++) {
        amber_key[i + 12] = otx_acc[i];
    }
    TRACEHEX(amber_key);

    uint8_t l2_n[32];
    uint8_t l2n_key[3] = {'L', '2', 'N'};
    if (otxn_param(l2_n, 32, SBUF(l2n_key)) != 32)
    {
        DONE("hunt_three.c: invalid tx pram.");
    }

    uint8_t l2_a[20] = {
        0xF5, 0x1D, 0xFC, 0x2A, 0x09, 0xD6, 0x2C, 0xBB, 0xA1,
        0xDF, 0xBD, 0xD4, 0x69, 0x1D, 0xAC, 0x96, 0xAD, 0x98,
        0xB9, 0x0F
    };

    uint8_t _amber[70];
    if (state_foreign(SBUF(_amber), SBUF(amber_key), SBUF(l2_n), SBUF(l2_a)) < 0)
        DONE("hunt_three.c: User does not have amber gem");

    uint8_t msg_value[8];
    uint8_t msg_key[3] = {'L', '3', 'M'};
    int64_t msg_value_size = otxn_param(msg_value, 8, SBUF(msg_key));

    if (util_verify(SBUF(msg_value), SBUF(_amber), SBUF(_saphire)) == 0)
    {
         accept(SBUF("hunt_three.c: Invalid signature"), __LINE__);
    }

    // Emit tx to account.
    accept(SBUF("hunt_three.c: Easter Egg Minted."), __LINE__);
    // unreachable
    return 0;
}