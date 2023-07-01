#include "hookapi.h"


int64_t hook(uint32_t reserved) {
    TRACESTR("keylet_owner_dir: Start.");
    const uint32_t currency = (uint32_t)"USD";

    uint8_t hook_accid[20];
    hook_account(SBUF(hook_accid));

    uint8_t owner_dir[34];
    util_keylet(SBUF(owner_dir), KEYLET_OWNER_DIR, hook_accid, SFS_ACCOUNT, 0, 0, 0, 0);

    TRACEHEX(owner_dir);

    // SLOT SET:
    if (slot_set(SBUF(owner_dir), 1) != 1)
        accept(SBUF("keylet_owner_dir: Could not load keylet"), __LINE__);

    if (slot_subfield(1, sfIndexes, 2) != 2)
        accept(SBUF("keylet_owner_dir: Could not load sfIndexes"), __LINE__);

    // uint8_t arrays[65];
    // int64_t arrays_len = slot(SBUF(arrays), 2);
    // TRACEVAR(arrays_len);
    // TRACEHEX(arrays);

    // 40 2448F6F57C6B3636716BDE3AD860EC7C92D1B029006770E7F396234469324934F86293A1654AC5F6A5E18261308D7409E4302131F6CB0C97D78261E2E14827BC
    // 2448F6F57C6B3636716BDE3AD860EC7C92D1B029006770E7F396234469324934
    // F86293A1654AC5F6A5E18261308D7409E4302131F6CB0C97D78261E2E14827BC

    uint8_t index1[32] = {
        0xF8, 0x62, 0x93, 0xA1, 0x65, 0x4A, 0xC5, 0xF6,
        0xA5, 0xE1, 0x82, 0x61, 0x30, 0x8D, 0x74, 0x09,
        0xE4, 0x30, 0x21, 0x31, 0xF6, 0xCB, 0x0C, 0x97,
        0xD7, 0x82, 0x61, 0xE2, 0xE1, 0x48, 0x27, 0xBC
    };

    uint8_t dir_1[34];
    util_keylet(SBUF(dir_1), KEYLET_UNCHECKED, SBUF(index1),  0, 0, 0, 0);

    if (slot_set(SBUF(dir_1), 3) != 3)
        accept(SBUF("keylet_owner_dir: Could not load inner keylet"), __LINE__);

    if (slot_subfield(3, sfBalance, 4) != 4)
        accept(SBUF("keylet_owner_dir: Could not load sfBalance"), __LINE__);
    
    int64_t balance = float_int(slot_float(4), 0, 1);
    TRACEVAR(balance);
    // Your code here...

    TRACESTR("keylet_owner_dir: End.");
    accept(SBUF("balance"), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}