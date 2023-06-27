#include "hookapi.h"


int64_t hook(uint32_t reserved) {
    TRACESTR("keylet_owner_dir: Start.");
    const uint32_t currency = (uint32_t)"USD";

    uint8_t hook_accid[20];
    hook_account(SBUF(hook_accid));

    int64_t count[1];
    count[0]++;

    state_set(SBUF(count), hook_accid, SFS_ACCOUNT);

    // uint8_t issuer_accid[20];
    // int64_t ret = util_accid(SBUF(issuer_accid), SBUF("rK7FWrmja5GYU1CY3Z3cTv92v7E74K6Nqy"));
    // TRACEVAR(ret);
    // TRACEHEX(issuer_accid);

    // KEYLET: TrustLine
    uint8_t namespace[32] = {
        0xDAU,0x4AU,0x3CU,0x64U,0x92U,0x0FU,0xC1U,0xEDU,0xCDU,0xD7U,
        0x2DU,0x9CU,0x5CU,0x8EU,0x9CU,0x78U,0x0EU,0x07U,0x6FU,0xF4U,
        0x4BU,0x2CU,0x81U,0x02U,0xE8U,0xE0U,0xFDU,0x63U,0x66U,0x52U,
        0x63U,0xD1U
    };

    uint8_t hook_state_dir[34];
    util_keylet(SBUF(hook_state_dir), KEYLET_HOOK_STATE_DIR, hook_accid, SFS_ACCOUNT,  SBUF(namespace), 0, 0);

    TRACEHEX(hook_state_dir);
    // TRACEVAR(slot_set(SBUF(hook_state_dir), 1));
    // uint8_t owner_dir_kl[34];
    // util_keylet(SBUF(owner_dir_kl), KEYLET_OWNER_DIR, hook_accid, SFS_ACCOUNT,  0, 0, 0, 0);

    // // SLOT SET:
    if (slot_set(SBUF(hook_state_dir), 1) != 1)
        accept(SBUF("keylet_owner_dir: Could not load keylet"), __LINE__);

    if (slot_subfield(1, sfIndexes, 2) != 2)
            accept(SBUF("keylet_owner_dir: Could not load sfIndexes"), __LINE__);

    // TRACEVAR(slot_count(1));
    // uint8_t entry_type[2];
    // int64_t bytes_written = slot(SBUF(entry_type), 2);
    // TRACEHEX(entry_type);
    // TRACESTR(entry_type);
    // TRACEVAR(slot_subarray(1, sfIndexes, 2));
    // slot_subarray(1, sfIndexes, 2);

    // if (slot_subarray(1, sfIndexes, 2) != 2)
    // {
    //     accept(SBUF("keylet_owner_dir: Could not load sfIndexes"), __LINE__);
    // } 
    // else
    // {
    //     TRACESTR("SLOT INDEXS");
    //     // SLOT SUBFIELD: sfTakerGets
    //     if (slot_subfield(2, sfTakerGets, 3) != 3)
    //         accept(SBUF("keylet_owner_dir: Could not load target balance 2"), __LINE__);

    //     int64_t balance = slot_float(3); // <- amount as xrp
    //     TRACEVAR(balance);
    // }

    // Your code here...

    TRACESTR("keylet_owner_dir: End.");
    accept(SBUF("balance"), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}