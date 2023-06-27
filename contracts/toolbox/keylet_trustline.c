#include "hookapi.h"


int64_t hook(uint32_t reserved) {
    TRACESTR("keylet_trustline_balance: Start.");
    const char issuer[] = "rMEGJtK2SttrtAfoKaqKUpCrDCi9saNuLg";
    const uint32_t currency = (uint32_t)"USD";

    uint8_t hook_accid[20];
    hook_account(SBUF(hook_accid));

    // KEYLET: TrustLine
    uint8_t bal_kl[34];
    util_keylet(SBUF(bal_kl), KEYLET_LINE, hook_accid, SFS_ACCOUNT,  (uint32_t)issuer, SFS_ACCOUNT, currency, 20);

    // SLOT SET:
    if (slot_set(SBUF(bal_kl), 1) != 20)
        accept(SBUF("keylet_trustline_balance: Could not load target balance"), __LINE__);
    
    // SLOT SUBFIELD: sfBalance
    if (slot_subfield(1, sfBalance, 1) != 20)
        accept(SBUF("keylet_trustline_balance: Could not load target balance 2"), __LINE__);

    int64_t balance = slot_float(1); // <- amount as token

    // Your code here...

    TRACESTR("keylet_trustline_balance: End.");
    accept(SBUF(balance), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}