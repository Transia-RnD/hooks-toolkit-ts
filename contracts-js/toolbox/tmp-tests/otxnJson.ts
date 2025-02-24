const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

function arrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

const Hook = (arg) => {
  const txn = otxn_json()
  ASSERT(typeof txn === 'object', 1)
  ASSERT(txn.TransactionType === 'Invoke', 2)
  ASSERT(arrayEqual(util_accid(txn.Destination), hook_account()), 3)
  accept('', 0)
}

export { Hook }
