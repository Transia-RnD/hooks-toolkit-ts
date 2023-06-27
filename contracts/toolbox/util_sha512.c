/**
 * Test/Show the tx parameter functionality
 */
#include "hookapi.h"


uint8_t dest_key[3] = { 'H', 'D', 'E' }; //484445
uint8_t dtag_key[3] = { 'H', 'D', 'T' }; //484454
uint8_t amt_key[3]  = { 'H', 'A', 'M' }; //48414D

int64_t hook(uint32_t reserved) {
    TRACESTR("util_sha512: Start.");

    // HASH FROM OTXN PARAM
    #define DEST1 (data1 + 0)
    #define DTAG1 (data1 + 21)
    #define AMT1 (data1 + 25)

    uint8_t data1[73];
    int64_t has_dest1 = otxn_param(DEST1, 20, SBUF(dest_key)) == 20;
    uint8_t has_dtag1 = otxn_param(DTAG1, 4, SBUF(dtag_key)) == 4;
    int64_t amt_size1 = otxn_param(AMT1, 48,  SBUF(amt_key));
    
    TRACEHEX(data1);
    // xrp: B0617ACF7D1D9AA5799E300FA21913D5BB499F390000000000400000000098968000000000000000000000000000000000000000000000000000000000000000000000000000000000
    // tkn: B0617ACF7D1D9AA5799E300FA21913D5BB499F390000000000D4C38D7EA4C680000000000000000000000000005553440000000000CAB5257201A442017DAAC66C637C12E68944DE6B

    *(data1 + 20) = has_dtag1;
    uint8_t hash1[32];
    util_sha512h(SBUF(hash1), SBUF(data1));
    TRACEHEX(hash1); // <- value

    // HASH FROM OTXN FIELD
    #define DEST2 (data2 + 0)
    #define DTAG2 (data2 + 21)
    #define AMT2 (data2 + 25)

    uint8_t data2[73];
    int64_t has_dest2 = otxn_field(DEST2, 20, sfDestination) == 20;
    uint8_t has_dtag2 = otxn_field(DTAG2, 4, sfDestinationTag) == 4;
    int64_t amt_size2 = otxn_field(AMT2, 48,  sfAmount);

    TRACEHEX(data2);
    // xrp: B0617ACF7D1D9AA5799E300FA21913D5BB499F390000000000400000000098968000000000000000000000000000000000000000000000000000000000000000000000000000000000
    // tkn: B0617ACF7D1D9AA5799E300FA21913D5BB499F390000000000D4C38D7EA4C680000000000000000000000000005553440000000000CAB5257201A442017DAAC66C637C12E68944DE6B
    
    *(data2 + 20) = has_dtag2;
    uint8_t hash2[32];
    util_sha512h(SBUF(hash2), SBUF(data2));
    TRACEHEX(hash2); // <- value

    if (hash1[1] != hash2[1] && hash1[2] != hash2[2]) {
        rollback(SBUF("util_sha512: Hashes do not match"), __LINE__);
    }

    // Your code here...

    TRACESTR("util_sha512: End.");
    accept(SBUF("util_sha512: Hashes match"), __LINE__);
    _g(1,1);   // every hook needs to import guard function and use it at least once
    // unreachable
    return 0;
}