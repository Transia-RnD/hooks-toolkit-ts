#include "hookapi.h"


int64_t hook(uint32_t reserved) {
    TRACESTR("keylet_account_balance: Start.");

    uint8_t hook_accid[20];
    hook_account(SBUF(hook_accid));

    // KEYLET: Account Root
    uint8_t bal_kl[34];
    util_keylet(SBUF(bal_kl), KEYLET_ACCOUNT, hook_accid, SFS_AMOUNT_IOU, 0,0,0,0);

    // SLOT SET: Slot 1
    if (slot_set(SBUF(bal_kl), 1) != 20)
        accept(SBUF("keylet_account_balance: Could not load target balance"), __LINE__);

    // SLOT SUBFIELD: sfBalance
    if (slot_subfield(1, sfBalance, 1) != 20)
        accept(SBUF("keylet_account_balance: Could not load target balance 2"), __LINE__);

    int64_t balance = slot_float(1); // <- amount as xrp

    // Your code here...

    TRACESTR("keylet_account_balance: End.");
    accept(SBUF(balance), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}