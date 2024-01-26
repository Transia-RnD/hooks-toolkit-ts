/**
 * EscrowFinish Txn
 */
#include "hookapi.h"

// clang-format off
uint8_t txn[268] =
{
/* size,upto */
/*   3,  0 */ 0x12U, 0x00U, 0x02U,                                                             /* tt = EscrowFinish */
/*   5,  3 */ 0x22U, 0x80U, 0x00U, 0x00U, 0x00U,                                               /* flags = tfCanonical */
/*   5,  8 */ 0x24U, 0x00U, 0x00U, 0x00U, 0x00U,                                               /* sequence = 0 */
/*   5, 13 */ 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                                               /* dtag, flipped */
/*   6, 18 */ 0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,                                        /* first ledger seq */
/*   6, 24 */ 0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,                                        /* last ledger seq */
/*  34, 30 */ 0x50U, 0x23U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,   /* hash256 id */
/*   9, 64 */ 0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,                   /* fee      */
/*  35, 73 */ 0x73U, 0x21U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, /* pubkey   */
/*  22,108 */ 0x81U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                           /* src acc  */
/*  22,130 */ 0x82U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                           /* owner acc  */
/* 116,152 */                                                                                  /* emit details */
/*   0,268 */
};
// clang-format on

// TXS
#define DTAG_OUT (txn + 14U)
#define FLS_OUT (txn + 20U)
#define LLS_OUT (txn + 26U)
#define ID_OUT (txn + 32U)
#define FEE_OUT (txn + 65U)
#define HOOK_ACC (txn + 110U)
#define OWNER_OUT (txn + 132U)
#define EMIT_OUT (txn + 152U)

int64_t hook(uint32_t reserved)
{
    TRACESTR("txn_escrow_finish_id.c: Called.");

    // ACCOUNT: Hook Account
    hook_account(HOOK_ACC, 20);

    // ACCOUNT: Owner Account
    uint8_t owner_key[2] = {'O', 'A'};
    otxn_param(OWNER_OUT, 20, SBUF(owner_key));

    // ACCOUNT: Ewscow ID
    uint8_t id_key[2] = {'I', 'D'};
    otxn_param(ID_OUT, 32, SBUF(id_key));

    // TXN: PREPARE: Init
    etxn_reserve(1);

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t *)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4;
    *((uint32_t *)(LLS_OUT)) = FLIP_ENDIAN(lls);

    // TXN PREPARE: Dest Tag <- Source Tag
    if (otxn_field(DTAG_OUT, 4, sfSourceTag) == 4)
        *(DTAG_OUT - 1) = 0x2EU;

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
        accept(SBUF("txn_escrow_finish_id.c: Tx emitted success."), __LINE__);
    }
    accept(SBUF("txn_escrow_finish_id.c: Tx emitted failure."), __LINE__);

    _g(1, 1);
    // unreachable
    return 0;
}