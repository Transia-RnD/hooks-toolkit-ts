import { DOESNT_EXIST, INVALID_ARGUMENT, sfInvoiceID } from 'jshooks-api'

const ASSERT = (x, code) => {
  if (!x) {
    rollback(x.toString(), code)
  }
}

const Hook = (arg) => {
  // garbage check
  ASSERT(hook_skip([], 0) === DOESNT_EXIST)
  ASSERT(hook_skip([], 1) === DOESNT_EXIST)
  ASSERT(hook_skip([], 2) === INVALID_ARGUMENT)

  // the hook to skip is passed in by invoice id
  const skip = otxn_field(sfInvoiceID)
  ASSERT(skip.length === 32)

  // get this hook's hash
  const hash = hook_hash(hook_pos())
  ASSERT(hash.length === 32)

  // to test if the "remove" function works in the api we will add this hook hash itself and then
  // remove it again. Therefore if the hook is placed at positions 0 and 3, the one at 3 should still
  // run
  ASSERT(hook_skip(hash, 1) === DOESNT_EXIST)
  ASSERT(hook_skip(hash, 0) === 1)
  ASSERT(hook_skip(hash, 1) === 1)

  // finally skip the hook hash indicated by invoice id
  ASSERT(hook_skip(skip, 0))

  return accept('', hook_pos())
}
