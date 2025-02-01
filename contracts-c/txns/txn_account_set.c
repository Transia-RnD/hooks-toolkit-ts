/**
 * AccountSet Txn
 */
#include "hookapi.h"

// GLOBAL MACROS

#define ENCODE_VL(vl, vl_len)\
    {\
        if (vl_len <= 193) \
        {\
            vl[0] = vl_len;\
        }\
        else if (vl_len <= 12480) \
        {\
            vl_len -= 193;\
            int byte1 = (vl_len >> 8) + 193;\
            int byte2 = vl_len & 0xFFU;\
            vl[0] = byte1;\
            vl[1] = byte2;\
        }\
        else if (vl_len > 12480) \
        {\
            vl_len -= 193;\
            int byte1 = (vl_len >> 8) + 193;\
            int byte2 = vl_len & 0xFFU;\
            vl[0] = byte1;\
            vl[1] = byte2;\
            vl[2] = byte2;\
        }\
    }

#define VL_TO_BUF(buf_raw, vl)\
{\
    unsigned char* buf = (unsigned char*)buf_raw;\
    for (int i = 0; GUARD(32), i < 32; ++i) \
        *(((uint64_t*)buf) + i) = *(((uint64_t*)vl) + i); \
}

// clang-format off 
uint8_t txn[] =
{
/* size,upto */
/* 3,    0, tt = AccountSet       */   0x12U, 0x00U, 0x03U,
/* 5,    3, sequence              */   0x24U, 0x00U, 0x00U, 0x00U, 0x00U,
/* 6,    8, firstledgersequence   */   0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,
/* 6,   14, lastledgersequence    */   0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,
/* 9,   20, fee                   */   0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,
/* 35,  29, signingpubkey         */   0x73U, 0x21U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
/* 22,  64, account               */   0x81U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
/* 116, 86  emit details          */   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                                       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                                       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
/* 1,  202, domain                */   0x77U,
/* 0,  203                        */ 
};
// clang-format on

// TX BUILDER
#define BYTES_LEN 203U
#define FLS_OUT (txn + 10U) // + leading bytes (2)
#define LLS_OUT (txn + 16U) // + leading bytes (2)
#define DOMAIN_OUT (txn + 203U) // + leading bytes (1)
#define FEE_OUT (txn + 21U) // + leading bytes (1)
#define ACCOUNT_OUT (txn + 66U) // + leading bytes (2)
#define EMIT_OUT (txn + 86U) // + leading bytes (0)

int64_t hook(uint32_t reserved) {

    TRACESTR("txn_account_set.c: Called.");

    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(ACCOUNT_OUT, 20);

    // OTXN PARAM: Domain Length
    uint8_t len_buffer[8];
    uint8_t len_key[2] = {'D', 'L'};
    otxn_param(SBUF(len_buffer), SBUF(len_key));
    int64_t len_domain = UINT64_FROM_BUF(len_buffer);
    TRACEVAR(len_domain);

    uint64_t padding = len_domain <= 193 ? 1 : len_domain <= 12480 ? 2 : 3;

    // HOOK PARAM: Amount
    uint8_t d_buffer[padding + len_domain];
    uint8_t d_key[1] = {'D'};
    otxn_param(d_buffer + padding, padding + len_domain, SBUF(d_key));
    TRACEHEX(d_buffer);

    uint64_t vl_len = len_domain;
    ENCODE_VL(d_buffer, vl_len);
    TRACEHEX(d_buffer);

    // TXN: PREPARE: Init
    etxn_reserve(1);

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t *)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4;
    *((uint32_t *)(LLS_OUT)) = FLIP_ENDIAN(lls);

    VL_TO_BUF(DOMAIN_OUT, d_buffer);

    // TXN PREPARE: Emit Metadata
    etxn_details(EMIT_OUT, 116U);

    // TXN PREPARE: Fee
    {
        int64_t fee = etxn_fee_base(txn, BYTES_LEN + padding + len_domain);
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
    int64_t emit_result = emit(SBUF(emithash), txn, BYTES_LEN + padding + len_domain);
    if (emit_result > 0)
    {
        accept(SBUF("txn_account_set.c: Tx emitted success."), __LINE__);
    }
    accept(SBUF("txn_account_set.c: Tx emitted failure."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}