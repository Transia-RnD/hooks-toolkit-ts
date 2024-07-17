/* eslint-disable @typescript-eslint/no-unused-vars */

// @ts-expect-error -- ignore
const Hook = (arg) => {
  trace('example.ts: Called.', false)

  const hook_accid = hook_account()
  trace('hook_accid', hook_accid, false)

  const hash = hook_hash(0)
  trace('hash', hash, false)

  const again = hook_again()
  trace('again', again, false)

  const fee = fee_base()
  trace('fee', fee, false)

  const sequence = ledger_seq()
  trace('sequence', sequence, false)

  const last_hash = ledger_last_hash()
  trace('last_hash', last_hash, false)

  const last_time = ledger_last_time()
  trace('last_time', last_time, false)

  const nonce = ledger_nonce()
  trace('nonce', nonce, false)

  // const ledger_key = ledger_keylet()
  // trace('ledger_key', ledger_key, false)

  const h_param = hook_param('CAFE')
  trace('h_param', h_param, false)

  // @ts-expect-error -- should typecase hash == number[]
  const h_param_set = hook_param_set('CAFE', 'CAFE', hash)
  trace('h_param_set', h_param_set, false)

  // // @ts-expect-error -- should typecase hash == number[]
  // const skip = hook_skip(hash)
  // trace('skip', skip, false)

  const pos = hook_pos()
  trace('pos', pos, false)

  return accept('example.ts: Finished.', 18)
}

// ADD_JS_FUNCTION(util_raddr, ctx)
// ADD_JS_FUNCTION(util_accid, ctx)
// ADD_JS_FUNCTION(util_verify, ctx)
// ADD_JS_FUNCTION(util_sha512h, ctx)
// ADD_JS_FUNCTION(util_keylet, ctx)

// ADD_JS_FUNCTION(hook_account, ctx): DONE
// ADD_JS_FUNCTION(hook_hash, ctx): DONE
// ADD_JS_FUNCTION(hook_again, ctx): DONE
// ADD_JS_FUNCTION(fee_base, ctx): DONE
// ADD_JS_FUNCTION(ledger_seq, ctx): DONE
// ADD_JS_FUNCTION(ledger_last_hash, ctx): DONE
// ADD_JS_FUNCTION(ledger_last_time, ctx): DONE
// ADD_JS_FUNCTION(ledger_nonce, ctx): DONE
// ADD_JS_FUNCTION(ledger_keylet, ctx): NOT DONE

// ADD_JS_FUNCTION(hook_param, ctx): DONE
// ADD_JS_FUNCTION(hook_param_set, ctx): DONE
// ADD_JS_FUNCTION(hook_skip, ctx): DONE
// ADD_JS_FUNCTION(hook_pos, ctx): DONE