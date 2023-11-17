/**
 * URITokenMint Txn
 */
#include "hookapi.h"

#define NOPE(x)\
    rollback(SBUF(x), __LINE__);

#define FLIP_ENDIAN_64(n) ((uint64_t)(((n & 0xFFULL) << 56ULL) |             \
                                      ((n & 0xFF00ULL) << 40ULL) |           \
                                      ((n & 0xFF0000ULL) << 24ULL) |         \
                                      ((n & 0xFF000000ULL) << 8ULL) |        \
                                      ((n & 0xFF00000000ULL) >> 8ULL) |      \
                                      ((n & 0xFF0000000000ULL) >> 24ULL) |   \
                                      ((n & 0xFF000000000000ULL) >> 40ULL) | \
                                      ((n & 0xFF00000000000000ULL) >> 56ULL)))

int64_t hook(uint32_t reserved) {

    TRACESTR("txn_uritoken_mint.c: Called.");
    
    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(hook_acc, 20);

    uint8_t uril_buf[8];
    uint8_t uril_key[4] = { 'U', 'R', 'I', 'L' };
    otxn_param(SBUF(uril_buf), SBUF(uril_key));
    uint64_t uri_len = FLIP_ENDIAN_64(UINT64_FROM_BUF(uril_buf));
    uint64_t urilen = float_int(uri_len, 0, 1);
    TRACEVAR(urilen);
    TRACEHEX(uril_buf);

    uint8_t uri[256];
    uri[0] = urilen;
    uint8_t uri_key[3] = { 'U', 'R', 'I' };
    otxn_param(uri + 1, urilen, SBUF(uri_key));
    TRACEHEX(uri);

    uint8_t dest_acc[20];
    uint8_t dest_key[3] = { 'D', 'S', 'T' };
    if (otxn_param(SBUF(dest_acc), SBUF(dest_key)) != 20)
    {
        rollback(SBUF("txn_uritoken_mint.c: Invalid Txn Parameter `DST`"), __LINE__);
    }
    TRACEHEX(dest_acc);

    uint8_t amount_buf[9];
    uint8_t amount_key[3] = { 'A', 'M', 'T' };
    otxn_param(SBUF(amount_buf), SBUF(amount_key)) == 8;
    TRACEHEX(amount_buf);

    int64_t amount = *((int64_t*)amount_buf);
    TRACEVAR(amount);
    if (float_compare(amount, 0, COMPARE_LESS | COMPARE_EQUAL) == 1)
        rollback(SBUF("txn_uritoken_mint.c: Invalid Txn Parameter `AMT`"), __LINE__);

    uint64_t drops_amount = float_int(amount, 6, 1);
    TRACEVAR(amount);
    TRACEVAR(drops_amount);

    // TXN: PREPARE: Init
    etxn_reserve(1);
    uint8_t txn_buf[1024];
    int64_t txn_len;
    {
        uint8_t* buf_out = txn_buf;
        uint32_t cls = (uint32_t)ledger_seq();
        _01_02_ENCODE_TT                   (buf_out, ttURITOKEN_MINT                );
        _02_02_ENCODE_FLAGS                (buf_out, tfCANONICAL                    );
        _02_04_ENCODE_SEQUENCE             (buf_out, 0                              );
        _02_26_ENCODE_FLS                  (buf_out, cls + 1                        );
        _02_27_ENCODE_LLS                  (buf_out, cls + 5                        );
        _06_01_ENCODE_DROPS_AMOUNT         (buf_out, 0                              );
        uint8_t* fee_ptr = buf_out;
        _06_08_ENCODE_DROPS_FEE            (buf_out, 0                              );
        _07_03_ENCODE_SIGNING_PUBKEY_NULL  (buf_out                                 );

        // URI
        *buf_out++ = 0x75U;
        for (int i = 0; GUARD(32), i < 32; ++i)
            *(((uint64_t*)buf_out) + i) = *(((uint64_t*)uri) + i);
        buf_out += urilen + 1;

        _08_01_ENCODE_ACCOUNT_SRC          (buf_out, hook_acc                       );
        _08_03_ENCODE_ACCOUNT_DST          (buf_out, dest_acc                       );
        int64_t edlen = etxn_details((uint32_t)buf_out, 512);
        trace_num(SBUF("edlen"), edlen);
        buf_out += edlen;
        txn_len = buf_out - txn_buf;
        int64_t fee = etxn_fee_base(txn_buf, txn_len);
        _06_08_ENCODE_DROPS_FEE            (fee_ptr, fee                            );

    }

    TRACEHEX(txn_buf);  // <- final tx blob

    // TXN: Emit/Send Txn
    uint8_t etxid[32];
    if (emit(SBUF(etxid), txn_buf, txn_len) < 0)
    {
        NOPE("txn_uritoken_mint.c: Tx emitted failure");
    }
    
    accept(SBUF("txn_uritoken_mint.c: Tx emitted success."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}