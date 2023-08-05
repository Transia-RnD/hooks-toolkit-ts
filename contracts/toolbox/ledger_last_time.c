/**
 *
 */
#include "hookapi.h"

int64_t hook(uint32_t reserved ) {

    // ACCOUNT: Hook Account
    uint8_t hook_acc[SFS_ACCOUNT];
    hook_account(SBUF(hook_acc));

    uint8_t lastSavedTime[8];
    state(SBUF(lastSavedTime), hook_acc, SFS_ACCOUNT);
    int64_t lastLedgerTime = INT64_FROM_BUF(lastSavedTime);

    uint8_t ltbuffer[8];
    int64_t ledgerTime = ledger_last_time();
    INT64_TO_BUF(ltbuffer, ledgerTime);
    state_set(SBUF(ltbuffer), hook_acc, SFS_ACCOUNT);

    TRACEVAR(ledgerTime);
    TRACEVAR(lastLedgerTime);

    TRACESTR("Accept.c: Called.");
    accept (0,0,0); 

    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}