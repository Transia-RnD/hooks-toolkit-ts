/**
 * OfferCreate Txn
 */
#include "hookapi.h"

uint8_t txn[310] =
{
    /* size,upto */
    /*   3,  0  */ 0x12U, 0x00U, 0x07U,                                                             /* tt = OfferCreate */
    /*   5,  3  */ 0x22U, 0x80U, 0x00U, 0x00U, 0x00U,                                               /* flags = tfCanonical */
    /*   5,  8  */ 0x24U, 0x00U, 0x00U, 0x00U, 0x00U,                                               /* sequence = 0 */
    /*   5, 13  */ 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                                               /* dtag, flipped */
    /*   6, 18  */ 0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,                                        /* first ledger seq */
    /*   6, 24  */ 0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,                                        /* last ledger seq */
    /*  49, 30  */ 0x64U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                          /* taker pays field 9 or 49 bytes */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99,                                                                           /* cont...  */
    /*  49, 79  */ 0x65U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                          /* taker gets field 9 or 49 bytes */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                         /* cont...  */
                    0x99,                                                                           /* cont...  */
    /*   9, 128 */ 0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,                          /* fee      */
                    0x00U,                                                                          /* cont...  */
    /*  35, 137 */ 0x73U, 0x21U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, /* pubkey   */
    /*  22, 172 */ 0x81U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                           /* src acc  */
    /* 116, 194 */                                                                                  /* emit details */
    /*   0, 310 */
};

// TX BUILDER
#define FLS_OUT (txn + 20U)
#define LLS_OUT (txn + 26U)
#define DTAG_OUT (txn + 14U)
#define TAKER_PAYS_OUT (txn + 30U)
#define TAKER_GETS_OUT (txn + 79U)
#define HOOK_ACC (txn + 174U)
#define FEE_OUT (txn + 129U)
#define EMIT_OUT (txn + 194U)

int64_t hook(uint32_t reserved) {

    TRACESTR("txn_offer_create.c: Called.");
    
    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(HOOK_ACC, 20);

    uint8_t txn_currency[20] = {
        0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,
        0x00U, 0x00U, 0x55U, 0x53U, 0x44U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U
    };
    
    uint8_t txn_issuer[20] = {
        0xA4U, 0x07U, 0xAF, 0x58U, 0x56U, 0xCCU, 0xF3U, 0xC4U, 0x26U, 0x19U, 
        0xDAU, 0xA9U, 0x25U, 0x81U, 0x3FU, 0xC9U, 0x55U, 0xC7U, 0x29U, 0x83U
    };
    
    uint64_t txn_amount = 6107881094714392576;  // 10
    uint64_t txn_drops = 10000000; // 10 XRP in drops

    // TXN: PREPARE: Init
    etxn_reserve(1);

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t*)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4 ;
    *((uint32_t*)(LLS_OUT)) = FLIP_ENDIAN(lls);

    // TXN PREPARE: TakerPays
    uint64_t drops = txn_drops;
    uint8_t* b = TAKER_PAYS_OUT + 1;
    *b++ = 0b01000000 + (( drops >> 56 ) & 0b00111111 );
    *b++ = (drops >> 48) & 0xFFU;
    *b++ = (drops >> 40) & 0xFFU;
    *b++ = (drops >> 32) & 0xFFU;
    *b++ = (drops >> 24) & 0xFFU;
    *b++ = (drops >> 16) & 0xFFU;
    *b++ = (drops >>  8) & 0xFFU;
    *b++ = (drops >>  0) & 0xFFU;

    // TXN PREPARE: TakerGets
    float_sto(
        TAKER_GETS_OUT,
        49,
        txn_currency,
        20,
        txn_issuer,
        20,
        txn_amount,
        sfTakerGets
    );

    // TXN PREPARE: Dest Tag <- Source Tag
    if (otxn_field(DTAG_OUT, 4, sfSourceTag) == 4)
        *(DTAG_OUT-1) = 0x2EU;

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

    TRACEHEX(txn);  // <- final tx blob
    
    // TXN: Emit/Send Txn
    uint8_t emithash[32];
    int64_t emit_result = emit(SBUF(emithash), SBUF(txn));
    if (emit_result > 0)
    {
        accept(SBUF("txn_offer_create.c: Tx emitted success."), __LINE__);
    }
    accept(SBUF("txn_offer_create.c: Tx emitted failure."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}