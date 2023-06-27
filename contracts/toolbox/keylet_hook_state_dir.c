#include "hookapi.h"

#define FLIP_ENDIAN_64(n) ((uint64_t) (((n & 0xFFULL) << 56ULL) | \
                                        ((n & 0xFF00ULL) << 40ULL) | \
                                        ((n & 0xFF0000ULL) << 24ULL) | \
                                        ((n & 0xFF000000ULL) << 8ULL) | \
                                        ((n & 0xFF00000000ULL) >> 8ULL) | \
                                        ((n & 0xFF0000000000ULL) >> 24ULL) | \
                                        ((n & 0xFF000000000000ULL) >> 40ULL) | \
                                        ((n & 0xFF00000000000000ULL) >> 56ULL)))

#define BINARY_MODEL_SIZE 29
uint8_t b_model[29] = {};

#define UPDATED_TIME_OFFSET 0
#define MESSAGE_OFFSET 8

#define VL_TO_BUF(offset, value) \
    uint8_t* b = b_model + offset; \
    for (int i = 0; GUARD(sizeof(value)), i < sizeof(value); i++) { \
        *b++ = ((uint8_t*)&value)[i]; \
    }

#define PARAM_NAME_SIZE 4
#define PARAM_NAME ((uint8_t[PARAM_NAME_SIZE]){ \
    0x54U, 0x45U, 0x53U, 0x54U})

int64_t hook(uint32_t reserved) {
    TRACESTR("keylet_hook_state_dir: Start.");

    uint8_t hook_accid[SFS_ACCOUNT];
    hook_account(SBUF(hook_accid));

    int64_t otxn_param_size = otxn_param(b_model, BINARY_MODEL_SIZE, PARAM_NAME, PARAM_NAME_SIZE);
    TRACEHEX(b_model);

    state_set(SBUF(b_model), hook_accid, SFS_ACCOUNT);

    uint8_t namespace[32] = {
        0x8DU,0x51U,0xDFU,0x7FU,0x43U,0x3BU,0xF4U,0x83U,0xCCU,0x13U,
        0x27U,0xF4U,0x9FU,0x3FU,0x15U,0x9EU,0x6EU,0x70U,0xB8U,0x08U,
        0x52U,0x53U,0xC8U,0xE1U,0xEDU,0x2BU,0x10U,0xD2U,0x20U,0x4FU,
        0x8EU,0x94U
    };
    TRACEHEX(namespace);

    // KEYLET: Hook State Dir
    uint8_t hook_state_dir[34];
    util_keylet(SBUF(hook_state_dir), KEYLET_HOOK_STATE_DIR, hook_accid, SFS_ACCOUNT,  SBUF(namespace), 0, 0);

    // SLOT SET:
    if (slot_set(SBUF(hook_state_dir), 1) != 1)
        accept(SBUF("keylet_hook_state_dir: Could not load keylet"), __LINE__);

    // SLOT SUBFIELD: Indexs (array of ledger entry keys)
    if (slot_subfield(1, sfIndexes, 2) != 2)
        accept(SBUF("keylet_owner_dir: Could not load sfIndexes"), __LINE__);

    // uint8_t arrays[33];
    // int64_t arrays_len = slot(SBUF(arrays), 2);
    // TRACEVAR(arrays_len);
    // TRACEHEX(arrays);
    // 20742F8C6D37F61D3DC5906B93C1A7545A2E761A05CC8B5C23AD58FAA2090A085700
    // 20 - 742F8C6D37F61D3DC5906B93C1A7545A2E761A05CC8B5C23AD58FAA2090A0857

    uint8_t index[32] = {
        0xCB, 0xE1, 0x72, 0x1E, 0xB1, 0xF4, 0xD2, 0x80, 
        0x2E, 0xA5, 0x8B, 0xB9, 0x6A, 0x07, 0xE9, 0x28, 
        0xB8, 0x5F, 0x7F, 0x85, 0xA3, 0x05, 0x13, 0xDF, 
        0x0B, 0x4C, 0xC3, 0x10, 0xE8, 0x67, 0xCA, 0x47
    };

    uint8_t hook_state[34];
    util_keylet(SBUF(hook_state), KEYLET_UNCHECKED, SBUF(index),  0, 0, 0, 0);

    if (slot_set(SBUF(hook_state), 4) != 4)
        accept(SBUF("keylet_hook_state_dir: Could not load inner keylet"), __LINE__);
    
    // UPDATE_BINARY_MODEL(MESSAGE_OFFSET, "hello1");
    int64_t timestamp = FLIP_ENDIAN_64(1685216402777);
    UPDATE_BINARY_MODEL(UPDATED_TIME_OFFSET, timestamp);
    TRACEHEX(b_model);

    if (slot_subfield(4, sfHookStateKey, 5) != 5)
        accept(SBUF("keylet_owner_dir: Could not load sfHookStateKey"), __LINE__);

    if (slot_subfield(4, sfHookStateData, 6) != 6)
        accept(SBUF("keylet_owner_dir: Could not load sfHookStateKey"), __LINE__);

    state_set(SBUF(b_model), hook_accid, SFS_ACCOUNT);

    TRACESTR("keylet_hook_state_dir: End.");
    accept(SBUF(b_model), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}