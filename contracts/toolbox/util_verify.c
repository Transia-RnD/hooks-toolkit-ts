/**
 * Test/Show the tx parameter functionality
 */
#include "hookapi.h"


uint8_t message_key[2] = { 'V', 'M' }; //
uint8_t pubkey_key[2] = { 'V', 'P' }; //
uint8_t sig_key[2] = { 'V', 'S' }; //

int64_t hook(uint32_t reserved) {
    TRACESTR("util_verify: Start.");

    // PARAM: Public Key - VP
    uint8_t pk_value[33];
    int64_t pk_value_size = hook_param(pk_value, 33, SBUF(pubkey_key));
    TRACEHEX(pk_value); // <- pk value

    // PARAM: Message - VM
    uint8_t msg_value[20];
    int64_t msg_value_size = hook_param(msg_value, 20, SBUF(message_key));
    TRACEHEX(msg_value); // <- msg value

    // TX PARAM: Signature - VS
    uint8_t sig_value[64];
    int64_t sig_value_size = otxn_param(sig_value, 64, SBUF(sig_key));

    if (util_verify(SBUF(msg_value), SBUF(sig_value), SBUF(pk_value)) == 0)
    {
         accept(SBUF("util_verify: Invalid signature"), __LINE__);
    }

    accept(SBUF("util_verify: Valid signature"), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}