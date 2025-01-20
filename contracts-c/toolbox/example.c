/**
 *
 */
#include "hookapi.h"

int64_t hook(uint32_t reserved) {
    _g(1,1);

    // ACCOUNT: Hook Account
    uint8_t hook_acc[20];
    hook_account(SBUF(hook_acc));

    return accept(SBUF(hook_acc), 13);
}