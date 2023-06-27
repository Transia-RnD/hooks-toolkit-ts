#include "hookapi.h"
#include <stdint.h>

#define DEBUG 1

uint8_t txn[283] =
{
/* size,upto */
/*   3,  0 */   0x12U, 0x00U, 0x00U,                                                               /* tt = Payment */
/*   5,  3*/    0x22U, 0x80U, 0x00U, 0x00U, 0x00U,                                          /* flags = tfCanonical */
/*   5,  8 */   0x24U, 0x00U, 0x00U, 0x00U, 0x00U,                                                 /* sequence = 0 */
/*   5, 13 */   0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                                                /* dtag, flipped */
/*   6, 18 */   0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,                                      /* first ledger seq */
/*   6, 24 */   0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,                                       /* last ledger seq */
/*  49, 30 */   0x61U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,              /* amount field 9 or 49 bytes */
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99,
/*   9, 79 */   0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,                         /* fee      */
/*  35, 88 */   0x73U, 0x21U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,       /* pubkey   */
/*  22,123 */   0x81U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                                 /* src acc  */
/*  22,145 */   0x83U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                                 /* dst acc  */
/* 116,167 */   /* emit details */
/*   0,283 */
};


/**
 * 
    Direct Debit Hook
        All integer values are marked for size and endianness
        
        Parameter Name: <20 byte account ID of receiver>
        Parameter Value: 8 or 48 bytes
            <8 byte xfl LE allowance per month>
            [20 byte currency code, not present if xrp]
            [20 byte issuer code not present is xrp]
**/

// ACCOUNTS
#define HOOK_ACC (txn + 125U)
#define OTX_ACC (txn + 147U)

// TXS
#define FLS_OUT (txn + 20U)                                                                                            
#define LLS_OUT (txn + 26U)                                                                                            
#define DTAG_OUT (txn + 14U)                                                                                           
#define AMOUNT_OUT (txn + 30U)                                                                                                                                                                                
#define EMIT_OUT (txn + 167U)                                                                                          
#define FEE_OUT (txn + 80U)

int64_t hook(uint32_t r)
{
    _g(1,1);

    // FILTER: Transation Type
    if (otxn_type() != ttINVOKE)
    {
        DONE("Direct debit: Passing non-Invoke txn");
    }

    // ACCOUNT:
    otxn_field(OTX_ACC, SFS_ACCOUNT, sfAccount);
    hook_account(HOOK_ACC, SFS_ACCOUNT);

    // GUARD ON: Destination
    if (BUFFER_EQUAL_20(HOOK_ACC, OTX_ACC))
        DONEMSG("Direct debit: Ignoring self-Invoke");

    // TX: PARAM -> REQAMT: < xlf 8b req amount, 20b currency, 20b issuer >
    uint8_t request_buf[48];
    uint8_t request_key[6] = { 'R', 'E', 'Q', 'A', 'M', 'T' };
    if (otxn_param(SBUF(request_buf), SBUF(request_key)) < 8)
        DONEMSG("Direct debit: Passing Invoke that lacks REQAMT otxn parameter");

    // VALIDATION: Math
    int64_t request = *((int64_t*)request_buf);
    if (float_compare(request, 0, COMPARE_LESS | COMPARE_EQUAL) == 1)
        rollback(SBUF("Direct debit: Invalid REQAMT"), __LINE__);

    // HOOK: PARAM -> AccountBast64: < xlf 8b req amount, 20b currency, 20b issuer >
    uint8_t limit_buf[48];
    int64_t limit_native = hook_param(SBUF(limit_buf), OTX_ACC, SFS_ACCOUNT) == 8;

    // TRUSTLINE:
    int64_t limit = *((int64_t*)limit_buf);
    if (limit == 0)
        rollback(SBUF("Direct debit: Requester is not authorized"), __LINE__);

    // VALIDATION: Math
    {
        uint64_t* req_issue = request_buf + 8;
        uint64_t* amt_issue = limit_buf + 8;

        if (req_issue[0] != amt_issue[0] ||
            req_issue[1] != amt_issue[1] ||
            req_issue[2] != amt_issue[2] ||
            req_issue[3] != amt_issue[3] ||
            req_issue[4] != amt_issue[4])
            rollback(SBUF("Direct debit: Requested currency/issuer differs from authorized currency/issuer"), __LINE__);
    }

    // STATE: GET - AccountBast64: < xfl amount used 8b LE, month number 8b LE >
    int64_t used[2];
    state(SBUF(used), OTX_ACC, SFS_ACCOUNT); // if state() fails then used is 0 by default
    
    // CALENDAR:
    SETUP_CURRENT_MONTH();

    // VALIDATION: Math
    if (used[1] != current_month)
    {
        used[1] = current_month;
        used[0] = 0;
    }

    if (DEBUG)
    {
        trace_float(SBUF("limit"), limit);
        trace_float(SBUF("used[0]"), used[0]);
    }

    // VALIDATION: Math
    used[0] = float_sum(used[0], request);
    if (used[0] <= 0 || float_compare(limit, used[0], COMPARE_LESS) == 1)
        rollback(SBUF("Direct debit: Would exceed monthly limit"), __LINE__);

    // TXN: PREPARE: Init
    etxn_reserve(1);

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t*)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4 ;
    *((uint32_t*)(LLS_OUT)) = FLIP_ENDIAN(lls);

    // TXN PREPARE: Amount
    if (limit_native)
    {
        uint64_t drops = float_int(request, 6, 1);
        uint8_t* b = AMOUNT_OUT + 1;
        *b++ = 0b01000000 + (( drops >> 56 ) & 0b00111111 );
        *b++ = (drops >> 48) & 0xFFU;
        *b++ = (drops >> 40) & 0xFFU;
        *b++ = (drops >> 32) & 0xFFU;
        *b++ = (drops >> 24) & 0xFFU;
        *b++ = (drops >> 16) & 0xFFU;
        *b++ = (drops >>  8) & 0xFFU;
        *b++ = (drops >>  0) & 0xFFU;
    }
    else
        float_sto(AMOUNT_OUT, 49, request_buf + 8, 20, request_buf + 28, 20, request, sfAmount);

    // TXN PREPARE: Dest Tag <- Source Tag
    if (otxn_field(DTAG_OUT, 4, sfSourceTag) == 4)
        *(DTAG_OUT-1) = 0x2EU;

    // TXN PREPARE: Emit Metadata
    etxn_details(EMIT_OUT, 116U);                                                                                      
                                                                                                                       
    // TXN PREPARE: Fee                                                                                                 
    {                                                                                                                  
        int64_t fee = etxn_fee_base(SBUF(txn));                                                                        
        if (DEBUG)                                                                                                     
            TRACEVAR(fee);                                                                                             
        uint8_t* b = FEE_OUT;                                                                                          
        *b++ = 0b01000000 + (( fee >> 56 ) & 0b00111111 );                                                             
        *b++ = (fee >> 48) & 0xFFU;                                                                                    
        *b++ = (fee >> 40) & 0xFFU;                                                                                    
        *b++ = (fee >> 32) & 0xFFU;                                                                                    
        *b++ = (fee >> 24) & 0xFFU;                                                                                    
        *b++ = (fee >> 16) & 0xFFU;                                                                                    
        *b++ = (fee >>  8) & 0xFFU;                                                                                    
        *b++ = (fee >>  0) & 0xFFU;                                                                                    
    }  

    if (DEBUG)
        trace(SBUF("txnraw"), SBUF(txn), 1);
    
    // TXN: Emit/Send Txn
    uint8_t emithash[32];
    int64_t emit_result = emit(SBUF(emithash), SBUF(txn));
    if (emit_result > 0)
    {
        // STATE: SET
        state_set(SBUF(used), OTX_ACC, 20);
        accept(SBUF("Direct debit: Successfully emitted"), __LINE__);
    }
    return rollback(SBUF("Direct debit: Emit unsuccessful"), __LINE__);
}
