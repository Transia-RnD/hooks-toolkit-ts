import type { Transaction } from '@transia/xahau-models'
import {
  SUCCESS,
  OUT_OF_BOUNDS,
  INTERNAL_ERROR,
  TOO_BIG,
  TOO_SMALL,
  DOESNT_EXIST,
  NO_FREE_SLOTS,
  INVALID_ARGUMENT,
  ALREADY_SET,
  PREREQUISITE_NOT_MET,
  FEE_TOO_LARGE,
  EMISSION_FAILURE,
  TOO_MANY_NONCES,
  TOO_MANY_EMITTED_TXN,
  NOT_IMPLEMENTED,
  INVALID_ACCOUNT,
  GUARD_VIOLATION,
  INVALID_FIELD,
  PARSE_ERROR,
  RC_ROLLBACK,
  RC_ACCEPT,
  NO_SUCH_KEYLET,
  NOT_AN_ARRAY,
  NOT_AN_OBJECT,
  INVALID_FLOAT,
  DIVISION_BY_ZERO,
  MANTISSA_OVERSIZED,
  MANTISSA_UNDERSIZED,
  EXPONENT_OVERSIZED,
  EXPONENT_UNDERSIZED,
  // XFL_OVERFLOW,
  NOT_IOU_AMOUNT,
  NOT_AN_AMOUNT,
  CANT_RETURN_NEGATIVE,
  NOT_AUTHORIZED,
  PREVIOUS_FAILURE_PREVENTS_RETRY,
  TOO_MANY_PARAMS,
  INVALID_TXN,
  RESERVE_INSUFFICIENT,
  COMPLEX_NOT_SUPPORTED,
  DOES_NOT_MATCH,
  // INVALID_KEY,
  // NOT_A_STRING,
  // MEM_OVERLAP,
  // TOO_MANY_STATE_MODIFICATIONS,
  // TOO_MANY_NAMESPACES,
} from 'jshooks-api/dist/npm/src/error'

export type ErrorCode =
  | typeof SUCCESS
  | typeof OUT_OF_BOUNDS
  | typeof INTERNAL_ERROR
  | typeof TOO_BIG
  | typeof TOO_SMALL
  | typeof DOESNT_EXIST
  | typeof NO_FREE_SLOTS
  | typeof INVALID_ARGUMENT
  | typeof ALREADY_SET
  | typeof PREREQUISITE_NOT_MET
  | typeof FEE_TOO_LARGE
  | typeof EMISSION_FAILURE
  | typeof TOO_MANY_NONCES
  | typeof TOO_MANY_EMITTED_TXN
  | typeof NOT_IMPLEMENTED
  | typeof INVALID_ACCOUNT
  | typeof GUARD_VIOLATION
  | typeof INVALID_FIELD
  | typeof PARSE_ERROR
  | typeof RC_ROLLBACK
  | typeof RC_ACCEPT
  | typeof NO_SUCH_KEYLET
  | typeof NOT_AN_ARRAY
  | typeof NOT_AN_OBJECT
  | typeof INVALID_FLOAT
  | typeof DIVISION_BY_ZERO
  | typeof MANTISSA_OVERSIZED
  | typeof MANTISSA_UNDERSIZED
  | typeof EXPONENT_OVERSIZED
  | typeof EXPONENT_UNDERSIZED
  // | typeof XFL_OVERFLOW
  | typeof NOT_IOU_AMOUNT
  | typeof NOT_AN_AMOUNT
  | typeof CANT_RETURN_NEGATIVE
  | typeof NOT_AUTHORIZED
  | typeof PREVIOUS_FAILURE_PREVENTS_RETRY
  | typeof TOO_MANY_PARAMS
  | typeof INVALID_TXN
  | typeof RESERVE_INSUFFICIENT
  | typeof COMPLEX_NOT_SUPPORTED
  | typeof DOES_NOT_MATCH
// | typeof INVALID_KEY
// | typeof NOT_A_STRING
// | typeof MEM_OVERLAP
// | typeof TOO_MANY_STATE_MODIFICATIONS
// | typeof TOO_MANY_NAMESPACES

declare global {
  /********************************************************************************************************************* */

  /**
   * Write logging information to the trace log of nodes. Used for debugging purposes.
   *
   * @param message The 'logging key', message to output before the buffer (can be null)
   * @param data    The data to log
   * @param hex     (Optional) Should it log formatted in HEX? (default: false)
   * @returns       int64_t, value is 0 if successful, If negative, an error: OUT_OF_BOUNDS
   */
  const trace: (message: string | null, data: any, hex?: boolean) => ErrorCode

  /********************************************************************************************************************* */

  /**
   * Definition of a Hook (smart contract) written in TS/JS.
   *
   * @param reserved uint32_t, Reserved for future use.
   * @returns        int64_t, An arbitrary return code you wish to return from your hook. This will
   *                 be present in the metadata of the originating transaction.
   */
  type Hook = (reserved?: number) => ErrorCode

  /**
   * Definition of a Hook Callback - user defined function called in order to inform your hook about the
   * status of a previously emitted transaction. State changes and further emit calls can be made from
   * cbak but it cannot rollback a transaction. When Callback is executed the emitted transaction to
   * which the callback relates is now the originating transaction.
   *
   * @param reserved uint32_t, If 0: the emittted transaction to which this callback
   *                       relates was successfully accepted into a ledger.
   *                       If 1: the emitted transaction to which the callback relates was NOT
   *                       successfully accepted into a ledger before it expired.
   * @returns              int64_t, An arbitrary return code you wish to return from your hook.
   *                       This will be present in the metadata of the originating transaction.
   */
  type Callback = (reserved?: number) => ErrorCode

  /********************************************************************************************************************* */

  /**
   * Accept the originating transaction and commit any changes the hook made. End the execution of the hook
   * with status: success. Record a return string and return code in transaction metadata. Commit all state
   * changes. Submit all emit() transactions, allow originating transaction to continue.
   *
   * @param msg    String to be stored in execution metadata. This is any string the
   *               hook-developer wishes to return with the acceptance.
   * @param code   A return code specific to this hook to be stored in execution metadata.
   *               Similar to the return code of an application on a *nix system.
   *               By convention success is zero.
   * @returns      int64_t, accept ends the hook, therefore no value is returned to the
   *               caller. By convention all Hook APIs return int64_t, but in this
   *               case nothing is returned.
   */
  const accept: (msg: string, code: number) => ErrorCode

  /********************************************************************************************************************* */

  /**
   * Reject the originating transaction and discard any changes the hook made. End the execution of the
   * hook with status: reject. Record a return string and return code in transaction metadata. Discard all
   * state changes. Discard all emit() transactions. Disallow originating transaction to continue.
   *
   * The originating transaction will fail with tecHOOK_REJECTED and a fee will be charged
   *
   * @param error_msg     String to be stored in execution metadata. This is any string the
   *                      hook-developer wishes to return with the rollback.
   * @param error_code    A return code specific to this hook to be stored in execution metadata.
   *                      Similar to the return code of an application on a *nix system.
   *                      By convention success is zero.
   * @returns             int64_t, rollback ends the hook, therefore no value is returned to
   *                      the caller. By convention all Hook APIs return int64_t, but in this
   *                      case nothing is returned.
   */
  const rollback: (error_msg: string, error_code: number) => ErrorCode

  /********************************************************************************************************************* */
  // UTIL APIS

  /**
   * Format an r-address as Account ID
   *
   * @param raddress The r-address to format as HEX accountid
   * @returns HEX Account ID
   */
  const util_accid: (raddress: string) => ErrorCode | number[]

  /**
   * Format an Acocunt ID as r-address
   *
   * @param accountid The HEX accountid to return as r-address
   * @returns r-address
   */
  const util_raddr: (accountid: number[] | string) => ErrorCode | string

  /**
   * Verify a cryptographic signature. If the public key is prefixed with 0xED then use ED25519, otherwise assume SECP256k1
   *
   * @param signedData The signed data to verify
   * @param signature The signature (secp256k1 / ed25519)
   * @param pubkey The public key responsible for the signature
   * @returns Number 1: validation succeeded, the signature is valid, Number 0 if the signature is invalid
   */
  const util_verify: (
    signedData: number[] | string,
    signature: number[] | string,
    pubkey: number[] | string
  ) => 0 | 1

  /**
   * Compute an sha512-half over some data
   *
   * @param data The data to compute the hash over
   * @returns Sha512half hash
   */
  const util_sha512h: (data: number[] | string) => ErrorCode | number[]

  const util_keylet: (
    keylet_type: number,
    keylet_data_a?: number[] | string | number,
    keylet_data_b?: number[] | string | number,
    keylet_data_c?: number[] | string | number
  ) => ErrorCode | number[]

  /********************************************************************************************************************* */
  // HOOK APIS

  /**
   * Retreive the 20 byte Account ID the Hook is executing on
   *
   * @returns Account ID the Hook is executing on
   */
  const hook_account: () => ErrorCode | number[]

  /**
   * Look up the hash of the hook installed on hook account at position hookno
   *
   * @param hookno The position in the hook chain the hook is located at, or -1 for the currently executing hook
   * @returns Namespace biased SHA512H of the currently executing Hook,
   */
  const hook_hash: (hookno: number) => ErrorCode | number[]

  const hook_param_set: (
    val: number[] | string,
    key: number[] | string,
    hash: number[] | string
  ) => number
  const hook_param: (key: number[] | string) => ErrorCode | number[]
  const hook_skip: (hash: number[] | string, flag: number) => ErrorCode | number
  const hook_pos: () => ErrorCode | number
  const hook_again: () => ErrorCode | number

  /********************************************************************************************************************* */
  // OTXN APIS

  /**
   * Look up the value for a named parameter specified on the originating transaction (ttINVOKE only)
   *
   * @param name Parameter's name
   * @returns Param's value
   */
  const otxn_param: (name: number[] | string) => ErrorCode | number[]

  /**
   * Return the Transaction Type of the originating transaction
   *
   * @returns number as Transaction Type
   */
  const otxn_type: () => ErrorCode | number

  /**
   * Output the canonical hash of the originating transaction
   *
   * @param flag 0 = hash of the originating transaction, flag 1 & emit_failure = hash of emitting tx (default: 0)
   * @returns TX Hash
   */
  const otxn_id: (flag?: number) => ErrorCode | number[]

  const otxn_slot: (slotno: number) => ErrorCode | number[]
  const otxn_field: (field_id: number) => ErrorCode | number[]
  const otxn_json: () => ErrorCode | Record<string, any> | Transaction // Triggering transaction

  /********************************************************************************************************************* */
  // FLOAT APIS

  const float_one: () => ErrorCode | bigint
  const float_set: (exponent: number, mantissa: number) => ErrorCode | bigint
  const float_multiply: (f1: bigint, f2: bigint) => ErrorCode | bigint
  const float_mulratio: (
    f1: bigint,
    round_up: number,
    numerator: number,
    denominator: number
  ) => ErrorCode | bigint
  const float_negate: (f1: bigint) => ErrorCode | bigint
  const float_compare: (
    f1: bigint,
    f2: bigint,
    mode: number
  ) => ErrorCode | number
  const float_sum: (f1: bigint, f2: bigint) => ErrorCode | bigint
  const float_sto: (
    cur: number[] | string | undefined,
    isu: number[] | string | undefined,
    f1: bigint,
    field_code: number
  ) => ErrorCode | number[]
  const float_sto_set: (buf: number[] | string) => ErrorCode | number
  const float_invert: (f1: bigint) => ErrorCode | bigint
  const float_divide: (f1: bigint, f2: bigint) => ErrorCode | bigint
  const float_mantissa: (f1: bigint) => ErrorCode | bigint
  const float_sign: (f1: bigint) => ErrorCode | bigint
  const float_int: (
    f1: bigint,
    decimal_places: number,
    abs: number
  ) => ErrorCode | number
  const float_log: (f1: bigint) => ErrorCode | bigint
  const float_root: (f1: bigintt, n: number) => ErrorCode | bigint

  /********************************************************************************************************************* */
  // STO APIS

  /**
   * Format an STO object (binary encoded ledger data) as JSON format
   *
   * @param blob The blob (e.g. serialized transaction)
   * @returns Decoded JSON
   */
  const sto_to_json: (
    blob: number[] | string
  ) => ErrorCode | Record<string, any> | Transaction

  /**
   * Validate an STO object (binary encoded ledger data)
   *
   * @param blob The blob (e.g. serialized transaction)
   * @returns Returns number 1 if the STObject pointed to by read_ptr is a valid STObject, 0 if it isn't.
   */
  const sto_validate: (blob: number[] | string) => ErrorCode | number

  /**
   * Format JSON as an STO object (binary encoded ledger data)
   *
   * @param jsonobj JSON object
   * @returns STO Object (binary encoded ledger data)
   */
  const sto_from_json: (
    jsonobj: Record<string, any> | Transaction
  ) => ErrorCode | number[]

  const sto_subfield: (
    sto: number[] | string,
    field_id: number
  ) => ErrorCode | number
  const sto_subarray: (
    sto: number[] | string,
    array_id: number
  ) => ErrorCode | number
  const sto_emplace: (
    sto: number[] | string,
    field_bytes: number[] | string,
    field_id: number
  ) => ErrorCode | number[]
  const sto_erase: (
    sto: number[] | string,
    field_id: number
  ) => ErrorCode | number[]

  /********************************************************************************************************************* */
  // LEDGER APIS

  /**
   * Search for a keylet within a specified range on the current ledger
   * Search the ledger for the first (lowest) Keylet of this type in this range
   *
   * @param low Pointer to the 34 byte serialised Keylet that represents the lower boundary of the Keylet range to search
   * @param high Pointer to the 34 byte serialised Keylet that represents the upper boundary of the Keylet range to search
   * @returns The number of bytes written (34 bytes) on success
   */
  const ledger_keylet: (
    low: number[] | string,
    high: number[] | string
  ) => ErrorCode | number[]

  const ledger_last_hash: () => ErrorCode | number[]
  const ledger_last_time: () => ErrorCode | number
  const ledger_nonce: () => ErrorCode | number[]
  const ledger_seq: () => ErrorCode | number

  /********************************************************************************************************************* */
  // SLOT APIS

  const slot_json: (slotno: number) => ErrorCode | number[]
  const slot: (slotno: number) => ErrorCode | number[]
  const slot_clear: (slotno: number) => ErrorCode | number
  const slot_count: (slotno: number) => ErrorCode | number
  const slot_set: (kl: number[] | string, slotno: number) => ErrorCode | number
  const slot_size: (slotno: number) => ErrorCode | number
  const slot_subarray: (
    parent_slotno: number,
    array_id: number,
    new_slotno: number
  ) => ErrorCode | number
  const slot_subfield: (
    parent_slotno: number,
    field_id: number,
    new_slotno: number
  ) => ErrorCode | number
  const slot_type: (slotno: number, flags: number) => ErrorCode | number
  const slot_float: (slotno: number) => ErrorCode | number
  const meta_slot: (slotno: number) => ErrorCode | number
  const xpop_slot: (
    slotno_tx: number,
    slotno_meta: number
  ) => ErrorCode | number

  /********************************************************************************************************************* */
  // STATE APIS
  /**
   * Get Hook State
   *
   * @param key Key of the Hook State
   * @returns Hook State value for key
   */
  const state: (key: number[] | string) => ErrorCode | number[]

  /**
   * Set Hook State
   *
   * @param value The value of data to persist
   * @param key Key of the Hook State
   * @returns The number of bytes written to Hook State (the length of the data), negative on error.
   */
  const state_set: (
    value: number[] | string | undefined | null,
    key: number[] | string
  ) => ErrorCode | number

  /**
   * Get Foreign Hook State (belonging to another account)
   *
   * @param key Key of the Hook State
   * @param namespace The Hook namespace to look in
   * @param accountid The owner of the state
   * @returns Hook State value for key
   */
  const state_foreign: (
    key: number[] | string,
    namespace: number[] | string | undefined | null,
    accountid: number[] | string | undefined | null
  ) => ErrorCode | number[]

  /**
   * Set Foreign Hook State - Authorized, needs a Grant to allows this
   *
   * @param value The value of data to persist
   * @param key Key of the Hook State
   * @param namespace The Hook namespace to look in
   * @param accountid The owner of the state
   * @returns The number of bytes written to Hook State (the length of the data), negative on error.
   */
  const state_foreign_set: (
    value: number[] | string | undefined | null,
    key: number[] | string,
    namespace: number[] | string | undefined | null,
    accountid: number[] | string | undefined | null
  ) => ErrorCode | number

  /********************************************************************************************************************* */
  // EMIT APIS

  /**
   * Prepare a JSON transaction for being Emitted
   *
   * @param txJson The transaction JSON, must be a complete transaction except for Account (always the Hook account)
   */
  const prepare: (
    txJson: Record<string, any> | Transaction
  ) => ErrorCode | Record<string, any> | Transaction

  /**
   * Emit a transaction, returns number on error, number of emitted TX Hash in case of emit success
   *
   * @param txJson The TX JSON to emit
   */
  const emit: (txJson: Record<string, any> | Transaction) => ErrorCode | number

  /**
   * Configure the amount of transactions this Hook is allowed to emit.
   *
   * @param txCount The max amount of transactions this Hook is allowed to emit in its lifecycle
   */
  const etxn_reserve: (txCount: number) => ErrorCode | number

  const etxn_fee_base: (txblob: number[] | string) => ErrorCode | number
}

export {}
