/**
 * EscrowCreate Txn
 */
#include "hookapi.h"

// clang-format off
uint8_t txn[295] =
{
/* size,upto */
/*   3,  0 */ 0x12U, 0x00U, 0x01U,                                                             /* tt = EscrowCreate */
/*   5,  3 */ 0x22U, 0x80U, 0x00U, 0x00U, 0x00U,                                               /* flags = tfCanonical */
/*   5,  8 */ 0x24U, 0x00U, 0x00U, 0x00U, 0x00U,                                               /* sequence = 0 */
/*   5, 13 */ 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                                               /* dtag, flipped */
/*   6, 18 */ 0x20U, 0x24U, 0x00U, 0x00U, 0x00U, 0x00U,                                        /* cancel after */
/*   6, 24 */ 0x20U, 0x25U, 0x00U, 0x00U, 0x00U, 0x00U,                                        /* finish after */
/*   6, 30 */ 0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,                                        /* first ledger seq */
/*   6, 36 */ 0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,                                        /* last ledger seq */
/*  49, 42 */  0x61U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* amount field 9 or 49 bytes */
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99,
/*   9, 91 */ 0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,                   /* fee      */
/*  35, 100 */ 0x73U, 0x21U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, /* pubkey   */
/*  22,135 */ 0x81U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                           /* acc acc  */
/*  22,157 */ 0x83U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                           /* dest acc  */
/* 116,179 */                                                                                  /* emit details */
/*   0,295 */
};
// clang-format on

// TXS
#define DTAG_OUT (txn + 14U)
#define CANA_OUT (txn + 20U)
#define FINA_OUT (txn + 26U)
#define FLS_OUT (txn + 32U)
#define LLS_OUT (txn + 38U)
#define AMT_OUT (txn + 42U)
#define FEE_OUT (txn + 92U)
#define HOOK_ACC (txn + 137U)
#define DEST_OUT (txn + 159U)
#define EMIT_OUT (txn + 179U)

int64_t hook(uint32_t reserved)
{

    TRACESTR("txn_escrow_create.c: Called.");

    // ACCOUNT: Hook Account
    hook_account(HOOK_ACC, 20);

    // ACCOUNT: Destination
    uint8_t dest_key[3] = {'D', 'S', 'T'};
    otxn_param(DEST_OUT, 20, SBUF(dest_key));

    // AMOUNT: Amount
    uint8_t amt_key[3] = {'A', 'M', 'T'};
    uint8_t amt_buffer[8];
    otxn_param(SBUF(amt_buffer), SBUF(amt_key));

    int64_t amount = *((int64_t *)amt_buffer);
    uint64_t drops = float_int(amount, 6, 1);
    uint8_t *b = AMT_OUT + 1;
    *b++ = 0b01000000 + ((drops >> 56) & 0b00111111);
    *b++ = (drops >> 48) & 0xFFU;
    *b++ = (drops >> 40) & 0xFFU;
    *b++ = (drops >> 32) & 0xFFU;
    *b++ = (drops >> 24) & 0xFFU;
    *b++ = (drops >> 16) & 0xFFU;
    *b++ = (drops >> 8) & 0xFFU;
    *b++ = (drops >> 0) & 0xFFU;
    
    // UINT32: Cancel After
    uint8_t ca_key[2] = {'C', 'A'};
    // uint8_t ca_buffer[8];
    otxn_param(CANA_OUT, 4, SBUF(ca_key));
    // TRACEHEX(ca_buffer);

    // UINT32: Finish After
    uint8_t fa_key[2] = {'F', 'A'};
    // uint8_t fa_buffer[8];
    otxn_param(FINA_OUT, 4, SBUF(fa_key));

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
        accept(SBUF("txn_escrow_create.c: Tx emitted success."), __LINE__);
    }
    accept(SBUF("txn_escrow_create.c: Tx emitted failure."), __LINE__);

    _g(1, 1);
    // unreachable
    return 0;
}