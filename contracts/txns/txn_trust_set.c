/**
 * TrustSet Txn
 */
#include "hookapi.h"

uint8_t txn[256] =
{
/* size,upto */
/*   3,  0 */   0x12U, 0x00U, 0x14U,                                                              /* tt = TrustSet */
/*   5,  3*/    0x22U, 0x00U, 0x02U, 0x00U, 0x00U,                                        /* flags = tfSetNoRipple */
/*   5,  8 */   0x24U, 0x00U, 0x00U, 0x00U, 0x00U,                                                 /* sequence = 0 */
/*   6, 13 */   0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,                                      /* first ledger seq */
/*   6, 19 */   0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,                                       /* last ledger seq */
/*  49, 25 */   0x63U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,             /* limit amount field 49 bytes */
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99,
/*   9, 74 */   0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,                         /* fee      */
/*  35, 83 */   0x73U, 0x21U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,       /* pubkey   */
/*  22,118 */   0x81U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                                 /* src acc  */
/* 116,140 */   /* emit details */
/*   0,256 */
};

// ACCOUNTS
#define HOOK_ACC (txn + 120U)

// TXS
#define FLS_OUT (txn + 15U)
#define LLS_OUT (txn + 21U)
#define LIMIT_OUT (txn + 25U)
#define EMIT_OUT (txn + 140U)
#define FEE_OUT (txn + 75U)

int64_t hook(uint32_t reserved)
{

    TRACESTR("txn_trust_set.c: Called.");

    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(HOOK_ACC, 20);

    // AMOUNT: Amount
    uint8_t amount_buf[8];
    uint8_t amount_key[1] = {'A'};
    hook_param(SBUF(amount_buf), SBUF(amount_key));
    int64_t amount = *((int64_t *)amount_buf);
    TRACEVAR(amount);
    if (float_compare(amount, 0, COMPARE_LESS | COMPARE_EQUAL) == 1)
        rollback(SBUF("txn_trust_set.c: Invalid Txn Parameter `A`"), __LINE__);

    // ACCOUNT: Issuer
    uint8_t issuer_buf[20];
    uint8_t issuer_key[1] = {'I'};
    hook_param(issuer_buf, 20, SBUF(issuer_key));

    // CURRENCY: Currency
    uint8_t currency_buf[20];
    uint8_t currency_key[1] = {'C'};
    hook_param(currency_buf, 20, SBUF(currency_key));

    // TXN: PREPARE: Init
    etxn_reserve(1);

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t *)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4;
    *((uint32_t *)(LLS_OUT)) = FLIP_ENDIAN(lls);

    // TXN PREPARE: LimitAmount
    float_sto(LIMIT_OUT, 49, currency_buf, 20, issuer_buf, 20, amount, sfLimitAmount);

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
        accept(SBUF("txn_trust_set.c: Tx emitted success."), __LINE__);
    }
    accept(SBUF("txn_trust_set.c: Tx emitted failure."), __LINE__);

    _g(1, 1);
    // unreachable
    return 0;
}