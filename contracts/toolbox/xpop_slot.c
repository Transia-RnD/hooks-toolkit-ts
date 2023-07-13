#include <stdint.h>
#include "hookapi.h"

#define ttIMPORT 97

int64_t hook(uint32_t r)
{
    _g(1,1);

    uint8_t hook_acc[20];
    hook_account(SBUF(hook_acc));

    uint8_t otxn_acc[20];
    otxn_field(SBUF(otxn_acc), sfAccount);

    // outgoing
    if (BUFFER_EQUAL_20(hook_acc, otxn_acc))
        accept(SBUF("xpop_slot.c: Passing outgoing txn."), __LINE__);

    if (otxn_type() != ttIMPORT)
        accept(SBUF("xpop_slot.c: Passing non ttIMPORT txn."), otxn_type());

    int64_t retval = xpop_slot(1, 2);

    if (retval <= 0)
        NOPE("xpop_slot.c:Failed to slot xpop");

    trace_num("xpop_slot.c: Slotted xpop", 12, retval);

	return accept(SBUF("xpop_slot.c: Finished."), __LINE__);
}