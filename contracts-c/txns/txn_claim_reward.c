/**
 * ClaimReward Txn
 */
#include "hookapi.h"

#define SVAR(x) &x, sizeof(x)

// clang-format off 
uint8_t txn[207] =
{
/* size,upto */
/* 3,    0, tt = ClaimReward      */   0x12U, 0x00U, 0x62U,
/* 5,    3  flags = tfCanonical   */   0x22U, 0x80U, 0x00U, 0x00U, 0x00U,
/* 5,    8, sequence              */   0x24U, 0x00U, 0x00U, 0x00U, 0x00U,
/* 6,   13, firstledgersequence   */   0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,
/* 6,   19, lastledgersequence    */   0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,
/* 9,   25, fee                   */   0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,
/* 35,  34, signingpubkey         */   0x73U, 0x21U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
/* 22,  69, account               */   0x81U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
/* 116, 91  emit details          */   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                                       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                                       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
/* 0,  207                        */ 
};
// clang-format on

// TX BUILDER
#define FLAGS_OUT (txn + 4U) // + leading bytes (1)
#define FLS_OUT (txn + 15U) // + leading bytes (2)
#define LLS_OUT (txn + 21U) // + leading bytes (2)
#define FEE_OUT (txn + 26U) // + leading bytes (1)
#define ACCOUNT_OUT (txn + 71U) // + leading bytes (2)
#define EMIT_OUT (txn + 91U) // + leading bytes (0)

int64_t hook(uint32_t reserved) {

    TRACESTR("txn_claim_reward.c: Called.");

    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(ACCOUNT_OUT, 20);

    // OTXN PARAM: Flags
    int32_t flags;
    otxn_param(SVAR(flags), "F", 1);
    TRACEVAR(flags);

    // TXN: PREPARE: Init
    etxn_reserve(1);

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t *)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4;
    *((uint32_t *)(LLS_OUT)) = FLIP_ENDIAN(lls);

    *((uint32_t *)(FLAGS_OUT)) = FLIP_ENDIAN(flags);

    // TXN PREPARE: Emit Metadata
    etxn_details(EMIT_OUT, 116U);

    // TXN PREPARE: Fee
    {
        int64_t fee = etxn_fee_base(SBUF(txn));
        uint8_t *b = FEE_OUT;
        *b++ = 0b01000000 + ((fee >> 56) & 0b00111111);
        *b++ = (fee >> 48) & 0xFFU;
        *b++ = (fee >> 40) & 0xFFU;
        *b++ = (fee >> 32) & 0xFFU;
        *b++ = (fee >> 24) & 0xFFU;
        *b++ = (fee >> 16) & 0xFFU;
        *b++ = (fee >> 8) & 0xFFU;
        *b++ = (fee >> 0) & 0xFFU;
    }

    TRACEHEX(txn); // <- final tx blob

    // TXN: Emit/Send Txn
    uint8_t emithash[32];
    int64_t emit_result = emit(SBUF(emithash), SBUF(txn));
    if (emit_result > 0)
    {
        accept(SBUF("txn_claim_reward.c: Tx emitted success."), __LINE__);
    }
    accept(SBUF("txn_claim_reward.c: Tx emitted failure."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}