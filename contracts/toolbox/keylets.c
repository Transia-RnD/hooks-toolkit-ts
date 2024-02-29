/**
 *
 */
#include "hookapi.h"

uint8_t currency_buffer[20] = {
    0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,
    0x00U, 0x00U, 0x55U, 0x53U, 0x44U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U
};

uint8_t issuer_buffer[20] = {
    0xA4U, 0x07U, 0xAF, 0x58U, 0x56U, 0xCCU, 0xF3U, 0xC4U, 0x26U, 0x19U, 
    0xDAU, 0xA9U, 0x25U, 0x81U, 0x3FU, 0xC9U, 0x55U, 0xC7U, 0x29U, 0x83U
};

int64_t hook(uint32_t reserved) {

    TRACESTR("Base.c: Called.");

    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(SBUF(hook_acc));

    // KEYLET: Account Root
    uint8_t acct_kl[34];
    util_keylet(SBUF(acct_kl), KEYLET_ACCOUNT, SBUF(hook_acc), 0,0,0,0);

    // SLOT SET: Slot 1
    if (slot_set(SBUF(acct_kl), 1) != 1)
        accept(SBUF("keylet.c: Could not load account keylet"), __LINE__);

    // SLOT SUBFIELD: sfBalance
    if (slot_subfield(1, sfBalance, 1) != 1)
        accept(SBUF("keylet.c: Could not load account keylet `sfBalance`"), __LINE__);

    int64_t balance = slot_float(1); // <- amount in xah

    // KEYLET: TrustLine
    uint8_t line_kl[34];
    util_keylet(SBUF(line_kl), KEYLET_LINE, hook_acc, 20, issuer_buffer, 20, currency_buffer, 20);

    // SLOT SET: Slot 1
    if (slot_set(SBUF(line_kl), 1) != 1)
        accept(SBUF("keylet.c: Could not load trustline"), __LINE__);

    // SLOT SUBFIELD: sfBalance
    if (slot_subfield(1, sfBalance, 1) != 1)
        accept(SBUF("keylet.c: Could not load trustline `sfBalance`"), __LINE__);

    int64_t balance = slot_float(1); // <- amount as token

    accept(SBUF("base: Finished."), __LINE__);

    _g(1,1);
    // unreachable
    return 0;
}