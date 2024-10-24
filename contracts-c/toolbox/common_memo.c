/**
 * 
 */
#include "hookapi.h"

#define MAX_MEMO_SIZE 4096
#define MEMO_FORMAT "unsigned/signature"
#define MEMO_DATA_LENGTH 64

#define COPY_BUFM(lhsbuf, lhsbuf_spos, rhsbuf, rhsbuf_spos, len, n) \
    for (int i = 0; GUARDM(len, n), i < len; ++i)                   \
        lhsbuf[lhsbuf_spos + i] = rhsbuf[rhsbuf_spos + i];


int64_t hook(uint32_t reserved ) {

    TRACESTR("common_memo: called");

    uint8_t memos[MAX_MEMO_SIZE];
    int64_t memos_len = otxn_field(SBUF(memos), sfMemos);

    if (memos_len < 0)
    {
        accept(SBUF("common_memo: Invalid Memo transaction"), 2);
    }

    int64_t   memo_lookup = sto_subarray(memos, memos_len, 0);
    uint8_t*  memo_ptr = SUB_OFFSET(memo_lookup) + memos;
    uint32_t  memo_len = SUB_LENGTH(memo_lookup);

    memo_lookup = sto_subfield(memo_ptr, memo_len, sfMemo);
    memo_ptr = SUB_OFFSET(memo_lookup) + memo_ptr;
    memo_len = SUB_LENGTH(memo_lookup);

    if (memo_lookup < 0)
        rollback(SBUF("common_memo: Incoming txn had a blank sfMemos, abort."), 1);

    int64_t  format_lookup   = sto_subfield(memo_ptr, memo_len, sfMemoFormat);
    uint8_t* format_ptr = SUB_OFFSET(format_lookup) + memo_ptr;
    uint32_t format_len = SUB_LENGTH(format_lookup);

    int is_unsigned_payload = 0;
    BUFFER_EQUAL_STR_GUARD(is_unsigned_payload, format_ptr, format_len, MEMO_FORMAT, 1);
    if (!is_unsigned_payload)
        accept(SBUF("common_memo: Memo is an invalid format. Passing txn."), 50);
    
    int64_t  data_lookup = sto_subfield(memo_ptr, memo_len, sfMemoData);
    uint8_t* data_ptr = SUB_OFFSET(data_lookup) + memo_ptr;

    uint32_t data_len = SUB_LENGTH(data_lookup);
    if (data_len > MAX_MEMO_SIZE)
        rollback(SBUF("common_memo: Memo too large (4kib max)."), 4);

    uint8_t data_value[data_len];
    COPY_BUFM(data_value, 0, data_ptr, 0, MEMO_DATA_LENGTH, MEMO_DATA_LENGTH);
    TRACEHEX(data_value) // <- memo data
    
    TRACESTR("common_memo: End.");
    accept(SBUF("common_memo: Finished."), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}