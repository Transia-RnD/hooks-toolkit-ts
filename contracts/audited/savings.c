#include "hookapi.h"
#include <stdint.h>

/**
    All integer values are marked for size and endianness

    Savings Hook
        Parameter Name: 0x53444F ('SDO')
        Parameter Value: <trigger threshold for outgoing xrp payments (uint64)><% as xfl LE>
        Parameter Name: 0x534449 ('SDI')
        Parameter Value: <trigger threshold for incoming xrp payments (uint64)><% as xfl LE>
        Parameter Name: 0x53544F ('STO')
        Parameter Value: <trigger threshold for outgoing trustline payments (xfl)><% as xfl LE>
        Parameter Name: 0x535449 ('STI')
        Parameter Value: <trigger threshold for incoming trustline payments (xfl)><% as xfl LE>
        Parameter Name: 0x5341 ('SA')
        Parameter Value: <20 byte AccountID of savings destination>
        Parameter Name: 0x5344 ('SD')
        Parameter Value: <4 byte dest tag BE>
**/

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

#define FLS_OUT (txn + 20U)
#define LLS_OUT (txn + 26U)
#define DTAG_OUT (txn + 14U)
#define AMOUNT_OUT (txn + 30U)
#define HOOK_ACC (txn + 125U)
#define SAVINGS_ACC (txn + 147U)
#define EMIT_OUT (txn + 167U)
#define FEE_OUT (txn + 80U)

uint8_t errmsg[] = "Savings: Threshold doesn't exist   ";

int64_t hook(uint32_t r)
{
    _g(1,1);

    // TT: Transation Type
    if (otxn_type() != ttPAYMENT)
        return accept(SBUF("Savings: Passing non-payment txn"), __LINE__);

    // ACCOUNT:
    uint8_t otxn_account[20];
    otxn_field(SBUF(otxn_account), sfAccount);
    hook_account(HOOK_ACC, 20);

    uint8_t outgoing = BUFFER_EQUAL_20(HOOK_ACC, otxn_account);

    // DESTINATION:
    uint8_t dest_account[20];
    otxn_field(SBUF(dest_account), sfDestination);

    // AMOUNT:
    int64_t amount_native = 0;
    uint8_t amount_buf[48];
    otxn_slot(1);

    // *SENDMAX:
    if (!(outgoing && slot_subfield(1, sfSendMax, 10) == 10))
        slot_subfield(1, sfAmount, 10);

    amount_native = slot_size(10) == 8;
    slot(SBUF(amount_buf), 10);

    // BALANCE: Account Root
    int64_t balance, prior_balance;
    // we need to check balance mutation before and after successful application of the payment txn
    // we do that by getting the balance of the relevant currency and saving it in ephemeral state
    {

        if (DEBUG)
        {
            TRACEHEX(otxn_account);
            TRACEHEX(dest_account);
            TRACEHEX(amount_buf);
            TRACEVAR(amount_native);
            trace(SBUF("currency"), amount_buf + 8, 20, 1);
        }
        // KEYLET: Account Root
        uint8_t bal_kl[34];
        if (amount_native)
            util_keylet(SBUF(bal_kl), KEYLET_ACCOUNT, HOOK_ACC, 20, 0,0,0,0);
        else
            util_keylet(SBUF(bal_kl), KEYLET_LINE, otxn_account, 20, dest_account, 20, amount_buf + 8, 20);

        if (DEBUG)
            trace(SBUF("Balance Keylet:"), SBUF(bal_kl), 1);

        // SLOT KEYLET: Account Root
        if (slot_set(SBUF(bal_kl), 20) != 20)
            accept(SBUF("Savings: Could not load target balance"), __LINE__);

        if (slot_subfield(20, sfBalance, 20) != 20)
            accept(SBUF("Savings: Could not load target balance 2"), __LINE__);

        if (DEBUG)
        {
            uint8_t raw[49];
            int64_t bytes = slot(SBUF(raw), 20);
            trace(SBUF("raw:"), raw, bytes, 1);
        }

        balance = slot_float(20);

        if (DEBUG)
            TRACEVAR(balance);
    }
    
    // HASH:
    uint8_t key[32];
    otxn_id(SBUF(key), 0);

    // TSH: WEAK vs STRONG
    TRACEVAR(r);
    if (r == 0)
    {
        // we'll store this for the weak execution
        if (DEBUG)
            trace_float(SBUF("before balance"), balance);

        if (state_set(&balance, sizeof(balance), SBUF(key)) != sizeof(balance))
            accept(SBUF("Savings: state save failed due to low reserve, passing txn without emitting"), __LINE__);

        hook_again();
        accept(SBUF("Savings: requesting weak execution."), __LINE__);
    }
    else
    {
        // load the amount before exeuction
        if (state(&prior_balance, sizeof(prior_balance), SBUF(key)) != 8)
            accept(SBUF("Savings: state load failed, passing txn without emitting"), __LINE__);

        if (DEBUG)
            TRACEVAR(prior_balance);
        
        state_set(0,0, SBUF(key));

        if (DEBUG)
        {
            trace_float(SBUF("before balance loaded"), prior_balance);
            trace_float(SBUF("after balance"), balance);
        }
    }

    // VALIDATION: Math
    int64_t amount = float_sum(float_negate(balance), prior_balance);
    if (float_compare(amount, 0, COMPARE_LESS) == 1)
        amount = float_negate(amount);

    if (DEBUG)
        trace_float(SBUF("balance mutation:"), amount);

    // HOOK PARAM: XRPL Account
    uint8_t param_name[3] = {0x53U, 0x41U, 0};
    uint8_t kl[34];
    if (hook_param(SAVINGS_ACC, 20, param_name, 2) != 20)
        accept(SBUF("Savings: No account set"), __LINE__);

    // KEYLET: Account Root
    util_keylet(SBUF(kl), KEYLET_ACCOUNT, SAVINGS_ACC, 20, 0,0,0,0);

    if (slot_set(SBUF(kl), 2) != 2)
        accept(SBUF("Savings: Dest account doesn't exist"), __LINE__);

    // PARAM: Amount Native
    // PARAM: Amount Outgoing
    param_name[1] = amount_native   ? 0x44U : 0x54U; // D / T
    param_name[2] = outgoing        ? 0x4FU : 0x49U; // O / I

    errmsg[33] = param_name[1];
    errmsg[34] = param_name[2];

    // Hook PARAM: XRPL Account
    uint8_t threshold_raw[16];
    int64_t result = hook_param(threshold_raw, 16, SBUF(param_name));
    TRACEVAR(result);
    if (hook_param(threshold_raw, 16, SBUF(param_name)) != 16)
    {
        TRACEVAR(threshold_raw);
        accept(SBUF(errmsg), __LINE__);
    }

    uint64_t threshold = *((uint64_t*)threshold_raw);

    // VALIDATION: Math
    if (amount_native)
        threshold = float_mulratio(threshold, 1UL, 1UL, 1000000UL);

    if (DEBUG)
    {
        trace_float(SBUF("amount"), amount);
        trace_float(SBUF("threshold"), threshold);
    }

    // VALIDATION: Math
    if (float_compare(amount, threshold, COMPARE_LESS) == 1)
        accept(SBUF("Savings: Threshold not met"), __LINE__); 

    uint64_t percent =  *(((uint64_t*)(threshold_raw)) + 1);

    if (DEBUG)
        trace_num(SBUF("percent"), percent);

    // VALIDATION: Math
    int64_t tosend_xfl = float_multiply(amount, percent);

    if (tosend_xfl <= 0)
        accept(SBUF("Savings: Skipping 0 / invalid send."), __LINE__);

    // VALIDATION: Trustline
    if (!amount_native)
    {
        // check if destination has a trustline for the currency
        // first generate the keylet
        if (
            util_keylet(SBUF(kl), KEYLET_LINE,
                SAVINGS_ACC, 20,
                amount_buf + 28, 20,         /* issuer */
                amount_buf +  8, 20) != 34   /* currency code */
        ||
        // then check it on the ledger
        slot_set(SBUF(kl), 3) != 3)
            accept(SBUF("Savings: Trustline missing on dest account"), __LINE__);
    }

    // TXN: PREPARE: Init
    etxn_reserve(1);

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t*)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4 ;
    *((uint32_t*)(LLS_OUT)) = FLIP_ENDIAN(lls);

    // TXN PREPARE: Dest Tag <- Source Tag
    param_name[1] = 'D';
    if (hook_param(DTAG_OUT, 4, param_name, 2) == 4)
        *(DTAG_OUT-1) = 0x2EU;
    
    // TXN PREPARE: Amount
    if (amount_native)
    {
        uint64_t drops = float_int(tosend_xfl, 6, 1);
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
        float_sto(AMOUNT_OUT, 49, amount_buf + 8, 20, amount_buf + 28, 20, tosend_xfl, sfAmount);
    
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

    // TXN: Emit/Send Txn
    uint8_t emithash[32];
    int64_t emit_result = emit(SBUF(emithash), SBUF(txn));
    if (emit_result > 0)
        accept(SBUF("Savings: Successfully emitted"), __LINE__);
   
    if (DEBUG)
        trace(SBUF("txnraw"), SBUF(txn), 1); 
    
    return accept(SBUF("Savings: Emit unsuccessful"), __LINE__);
}

