/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  /********************************************************************************************************************* */

  // Return number: int64
  //    An arbitrary return code you wish to return from your hook. This will be present in the metadata of the originating transaction.
  export type Hook = (reserved?: number) => bigint /** int64 */

  // Arg: uint32 'what'
  //    0 = the emittted transaction to which this callback relates was successfully accepted into a ledger.
  //    1 = the emitted transaction to which the callback relates was NOT successfully accepted into a ledger before it expired.
  // Return number: int64
  //    An arbitrary return code you wish to return from your hook. This will be present in the metadata of the originating transaction.
  export type Callback = (emittedTxError?: number) => bigint /** int64 */

  /********************************************************************************************************************* */

  type Trace = (message: string, data: any, hex?: boolean) => void

  const trace: Trace

  /********************************************************************************************************************* */

  // Rtrn
  type Accept = (error_msg: string, error_code: number) => bigint

  const accept: Accept

  /********************************************************************************************************************* */

  type Rollback = (error_msg: string, error_code: number) => bigint

  const rollback: Rollback

  /********************************************************************************************************************* */

  const util_raddr = (arg: any) => any
  const util_accid = (arg: any) => any
  const util_sha512h = (arg: any) => any
  const hook_account = (arg?: any) => any
  const state = (arg: any) => any
  const hook_hash = (arg: any) => any
  const state_set = (arg: any, arg: any) => any
  const otxn_type = () => any

  /********************************************************************************************************************* */
  const ttPAYMENT = 0
  const ttESCROW_CREATE = 1
  const ttESCROW_FINISH = 2
  const ttACCOUNT_SET = 3
  const ttESCROW_CANCEL = 4
  const ttREGULAR_KEY_SET = 5
  // const ttNICKNAME_SET = 6 // deprecated
  const ttOFFER_CREATE = 7
  const ttOFFER_CANCEL = 8
  const ttTICKET_CREATE = 10
  // const ttSPINAL_TAP = 11 // deprecated
  const ttSIGNER_LIST_SET = 12
  const ttPAYCHAN_CREATE = 13
  const ttPAYCHAN_FUND = 14
  const ttPAYCHAN_CLAIM = 15
  const ttCHECK_CREATE = 16
  const ttCHECK_CASH = 17
  const ttCHECK_CANCEL = 18
  const ttDEPOSIT_PREAUTH = 19
  const ttTRUST_SET = 20
  const ttACCOUNT_DELETE = 21
  const ttHOOK_SET = 22
  const ttNFTOKEN_MINT = 25
  const ttNFTOKEN_BURN = 26
  const ttNFTOKEN_CREATE_OFFER = 27
  const ttNFTOKEN_CANCEL_OFFER = 28
  const ttNFTOKEN_ACCEPT_OFFER = 29
  const ttURITOKEN_MINT = 45
  const ttURITOKEN_BURN = 46
  const ttURITOKEN_BUY = 47
  const ttURITOKEN_CREATE_SELL_OFFER = 48
  const ttURITOKEN_CANCEL_SELL_OFFER = 49
  const ttREMIT = 95
  const ttGENESIS_MINT = 96
  const ttIMPORT = 97
  const ttCLAIM_REWARD = 98
  export const ttINVOKE = 99
  const ttAMENDMENT = 100
  const ttFEE = 101
  const ttUNL_MODIFY = 102
  const ttEMIT_FAILURE = 103
  const ttUNL_REPORT = 104
  /********************************************************************************************************************* */
  const KEYLET_HOOK = 1
  const KEYLET_HOOK_STATE = 2
  const KEYLET_ACCOUNT = 3
  const KEYLET_AMENDMENTS = 4
  const KEYLET_CHILD = 5
  const KEYLET_SKIP = 6
  const KEYLET_FEES = 7
  const KEYLET_NEGATIVE_UNL = 8
  const KEYLET_LINE = 9
  const KEYLET_OFFER = 10
  const KEYLET_QUALITY = 11
  const KEYLET_EMITTED_DIR = 12
  const KEYLET_TICKET = 13
  const KEYLET_SIGNERS = 14
  const KEYLET_CHECK = 15
  const KEYLET_DEPOSIT_PREAUTH = 16
  const KEYLET_UNCHECKED = 17
  const KEYLET_OWNER_DIR = 18
  const KEYLET_PAGE = 19
  const KEYLET_ESCROW = 20
  const KEYLET_PAYCHAN = 21
  const KEYLET_EMITTED = 22
  const KEYLET_NFT_OFFER = 23
  const KEYLET_HOOK_DEFINITION = 24
  const KEYLET_HOOK_STATE_DIR = 25
  const KEYLET_URITOKEN = 26
  /********************************************************************************************************************* */
  const COMPARE_EQUAL = 1
  const COMPARE_LESS = 2
  const COMPARE_GREATER = 4
  /********************************************************************************************************************* */
  const SUCCESS = 0
  const OUT_OF_BOUNDS = -1
  const INTERNAL_ERROR = -2
  const TOO_BIG = -3
  const TOO_SMALL = -4
  const DOESNT_EXIST = -5
  const NO_FREE_SLOTS = -6
  const INVALID_ARGUMENT = -7
  const ALREADY_SET = -8
  const PREREQUISITE_NOT_MET = -9
  const FEE_TOO_LARGE = -10
  const EMISSION_FAILURE = -11
  const TOO_MANY_NONCES = -12
  const TOO_MANY_EMITTED_TXN = -13
  const NOT_IMPLEMENTED = -14
  const INVALID_ACCOUNT = -15
  const GUARD_VIOLATION = -16
  const INVALID_FIELD = -17
  const PARSE_ERROR = -18
  const RC_ROLLBACK = -19
  const RC_ACCEPT = -20
  const NO_SUCH_KEYLET = -21
  const NOT_AN_ARRAY = -22
  const NOT_AN_OBJECT = -23
  const INVALID_FLOAT = -10024
  const DIVISION_BY_ZERO = -25
  const MANTISSA_OVERSIZED = -26
  const MANTISSA_UNDERSIZED = -27
  const EXPONENT_OVERSIZED = -28
  const EXPONENT_UNDERSIZED = -29
  const OVERFLOW = -30
  const NOT_IOU_AMOUNT = -31
  const NOT_AN_AMOUNT = -32
  const CANT_RETURN_NEGATIVE = -33
  const NOT_AUTHORIZED = -34
  const PREVIOUS_FAILURE_PREVENTS_RETRY = -35
  const TOO_MANY_PARAMS = -36
  const INVALID_TXN = -37
  const RESERVE_INSUFFICIENT = -38
  const COMPLEX_NOT_SUPPORTED = -39
  const DOES_NOT_MATCH = -40
  /********************************************************************************************************************* */
}

export {}
