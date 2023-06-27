#include "hookapi.h"
#include <stdint.h>

/**
 * Account Owner can:
 * ttINVOKE:
 *  Blob: (packed data) (up to 32)
 *      ( 1 byte action type + 20 byte account id ) +
 *
 * Action Type: 0 to remove account, 1 to add account 
 */

#define sfBlob ((7U << 16U) + 26U)

int64_t hook(uint32_t r)
{
    _g(1,1);

    // HOOK ON: Transation Type
    if (otxn_type() != ttINVOKE)
    {
        DONEEMPTY();
    }

    // ACCOUNT:
    uint8_t account_field[20];
    ASSERT(otxn_field(SBUF(account_field), sfAccount) == 20);

    // ACCOUNT:
    uint8_t hook_accid[20];
    hook_account(SBUF(hook_accid));
    
    // FILTER ON: SELF
    if (!BUFFER_EQUAL_20(hook_accid, account_field))
        DONEEMPTY();

    // FILTER ON: Destination
    uint8_t dest[20];
    if (otxn_field(SBUF(dest), sfDestination) == 20)
    {
        if (!BUFFER_EQUAL_20(hook_accid, dest))
        {
            // .. then they are invoking someone else's hook
            // and we need to not interfere with that.
            DONEEMPTY();
        }
    }

    uint8_t txn_id[32];
    ASSERT(otxn_id(txn_id, 32, 0) == 32);

    ASSERT(otxn_slot(1) == 1);
    ASSERT(slot_subfield(1, sfBlob, 2) == 2);
    
    uint8_t buffer[676];

    ASSERT(slot(SBUF(buffer), 2) > 0);

    trace(SBUF("blob-buffer"), buffer, 676, 1);

    uint16_t len = (uint16_t)buffer[0];
    uint8_t* ptr = buffer + 1;
    if (len > 192)
    {
        len = 193 + ((len - 193) * 256) + ((uint16_t)(buffer[1]));
        ptr++;
    }

    uint8_t* end = ptr + len;

    // execution to here means it's a valid modification instruction
    while (ptr < end)
    {
        GUARD(32);
        uint8_t* dptr = *ptr == 0 ? txn_id : 0;
        uint64_t dlen = *ptr == 0 ? 32 : 0;
        ASSERT(state_set(dptr, dlen, ptr+1, 20) == dlen);
        ptr += 21;
    }

    DONEEMPTY();
}
