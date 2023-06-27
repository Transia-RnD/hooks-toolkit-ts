#include "hookapi.h"

#define VL_TO_BUF(out, value) \
    uint8_t* b = out; \
    for (int i = 0; GUARD(sizeof(value)), i < sizeof(value); i++) { \
        *b++ = ((uint8_t*)&value)[i]; \
    }

#define STATE_KEY_TO_BUF(out, value) \
    uint8_t* s = out; \
    for (int i = 0; GUARD(sizeof(value)), i < sizeof(value); i++) { \
        *s++ = ((uint8_t*)&value)[i]; \
    }


// BINARY MODEL
#define BINARY_MODEL_SIZE 34
uint8_t b_model[BINARY_MODEL_SIZE] = {};

// FIELDS
#define VALUE_OUT (b_model + 1U)
#define WIN_OUT (b_model + 9U)
#define TO_SEAL_OUT (b_model + 17U)

uint8_t index_buffer[33] = {};
uint8_t i_buffer[32] = {};
#define INDEX_OUT (i_buffer - 1U)

uint8_t state_key_buf[34];
uint8_t state_key[20];
#define STATE_KEY_OUT (state_key - 12U)

// TX PARAMS
#define PARAM_NAME_SIZE 2
#define PARAM_NAME ((uint8_t[PARAM_NAME_SIZE]){0x47U, 0x53U})

int64_t hook(uint32_t reserved) {
    TRACESTR("gambit: Start.");

    // ACCOUNT: Hook Account
    uint8_t hook_acc[SFS_ACCOUNT];
    hook_account(SBUF(hook_acc));

    // ACCOUNT: Origin Tx Account
    uint8_t otx_acc[SFS_ACCOUNT];
    otxn_field(otx_acc, SFS_ACCOUNT, sfAccount);
    TRACEHEX(otx_acc);

    int64_t otxn_param_size = otxn_param(b_model, BINARY_MODEL_SIZE, PARAM_NAME, PARAM_NAME_SIZE);

    int64_t amount_xfl = -1;
    otxn_slot(1);
    if (slot_subfield(1, sfAmount, 1) == 1)
    {
        amount_xfl = slot_float(1);
    }
    TRACEVAR(amount_xfl);

    INT64_TO_BUF(VALUE_OUT, amount_xfl);

    int64_t position = 1;

    int64_t win = 0;
    int64_t newValue = 0;

    int64_t odd = 6090866696204910592;
    // TRACEVAR(odd)

    // 1 for yes
    if (position == 1) {
        win = float_multiply(amount_xfl, odd);
    }
    // 2 for no
    if (position == 2) {
        win = float_divide(amount_xfl, odd);
    }
    // TRACEVAR(win)
    INT64_TO_BUF(WIN_OUT, win);

    int64_t new_value = amount_xfl;
    int8_t is_sealed = 0;
    {
        uint8_t namespace[32] = {
            0x5EU, 0x05U, 0xCBU, 0x51U, 0x5BU, 0x5EU, 0x6AU, 0xEEU, 0x84U, 0x32U,
            0x5AU, 0x8CU, 0xEEU, 0xB2U, 0x8AU, 0x92U, 0xC2U, 0xD8U, 0xD0U, 0x1CU,
            0x6BU, 0x0FU, 0x4BU, 0xB0U, 0xE7U, 0x43U, 0xBDU, 0x04U, 0xECU, 0xE7U,
            0x55U, 0x7EU
        };
        TRACEHEX(namespace);

        // KEYLET: Hook State Dir
        uint8_t hook_state_dir[34];
        util_keylet(SBUF(hook_state_dir), KEYLET_HOOK_STATE_DIR, hook_acc, SFS_ACCOUNT,  SBUF(namespace), 0, 0);

        // SLOT SET:
        if (slot_set(SBUF(hook_state_dir), 2) != 2)
            accept(SBUF("gambit: Could not load keylet"), __LINE__);

        // SLOT SUBFIELD: Indexs (array of ledger entry keys)
        if (slot_subfield(2, sfIndexes, 3) != 3)
            accept(SBUF("gambit: Could not load sfIndexes"), __LINE__);

        int64_t arrays_len = slot(SBUF(index_buffer), 3);
        // TRACEVAR(arrays_len);
        // TRACEHEX(index_buffer);

        VL_TO_BUF(INDEX_OUT, index_buffer);
        TRACEHEX(i_buffer);

        // new_buffer = &arrays[1];
        // TRACEHEX(new_buffer);
        // TRACEVAR(sizeof(new_buffer));
        // 20742F8C6D37F61D3DC5906B93C1A7545A2E761A05CC8B5C23AD58FAA2090A085700
        // 20 - 742F8C6D37F61D3DC5906B93C1A7545A2E761A05CC8B5C23AD58FAA2090A0857

        // uint8_t tmp_index[32] = {
        //     0xCB, 0xE1, 0x72, 0x1E, 0xB1, 0xF4, 0xD2, 0x80, 
        //     0x2E, 0xA5, 0x8B, 0xB9, 0x6A, 0x07, 0xE9, 0x28, 
        //     0xB8, 0x5F, 0x7F, 0x85, 0xA3, 0x05, 0x13, 0xDF, 
        //     0x0B, 0x4C, 0xC3, 0x10, 0xE8, 0x67, 0xCA, 0x47
        // };
        // uint8_t new_indexes[1] = { i_buffer };
 
        // for (int i = 0; GUARD(10), i < sizeof(new_indexes); i++) {
        // uint8_t index = new_indexes[i];
        // TRACEHEX(index);
        uint8_t hook_state[34];
        util_keylet(SBUF(hook_state), KEYLET_UNCHECKED, SBUF(i_buffer),  0, 0, 0, 0);

        if (slot_set(SBUF(hook_state), 4) != 4)
            accept(SBUF("gambit: Could not load inner keylet"), __LINE__);

        if (slot_subfield(4, sfHookStateKey, 5) != 5)
            accept(SBUF("gambit: Could not load sfHookStateKey"), __LINE__);

        if (slot_subfield(4, sfHookStateData, 6) != 6)
            accept(SBUF("gambit: Could not load sfHookStateData"), __LINE__);


        slot(SBUF(state_key_buf), 5);
        STATE_KEY_TO_BUF(STATE_KEY_OUT, state_key_buf);
        TRACEHEX(state_key);

        if (BUFFER_EQUAL_20(hook_acc, state_key)) {
            TRACESTR('SKIP OWN BET')
            // continue;
        }

        uint8_t b_model_buf[slot_size(6)];
        slot(SBUF(b_model_buf), 6);
        TRACEHEX(b_model_buf)

        uint8_t position[1];
        position[0] = b_model[0];

        uint8_t slip_pos[1];
        slip_pos[0] = b_model_buf[1];

        if (position != slip_pos) {
            TRACESTR('SKIP WRONG POSITION')
            // continue;
        }
        
        TRACEHEX(position);
        TRACEHEX(slip_pos);

        uint8_t to_seal[8];
        to_seal[0] = b_model_buf[18];
        to_seal[1] = b_model_buf[19];
        to_seal[2] = b_model_buf[20];
        to_seal[3] = b_model_buf[21];
        to_seal[4] = b_model_buf[22];
        to_seal[5] = b_model_buf[23];
        to_seal[6] = b_model_buf[24];
        to_seal[7] = b_model_buf[25];

        int64_t to_seal_amt = INT64_FROM_BUF(to_seal);
        TRACEHEX(to_seal);
        TRACEVAR(to_seal_amt);

        if (to_seal_amt > new_value)
        {
            TRACESTR('SKIP TOSEAL > VALUE')
            // continue;
        }

        TRACEVAR(new_value);

        new_value = new_value - to_seal_amt;
        is_sealed = 1;

        // state_set(SBUF(b_model), otx_acc, SFS_ACCOUNT);

        // }

        if (is_sealed == 0) {
            new_value = win;
        }
        TRACEVAR(new_value)

        INT64_TO_BUF(TO_SEAL_OUT, new_value);

        // state_set(SBUF(b_model), otx_acc, SFS_ACCOUNT);

        // TRACEHEX(b_model);
    }

    TRACESTR("gambit: End.");
    accept(SBUF(b_model), __LINE__);
    _g(1,1);
    // unreachable
    return 0;
}