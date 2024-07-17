const ASSERT = (x, code) => {
  if (!x) {
    rollback(x.toString(), code)
  }
}

const toHex = (arr) => {
  return arr
    .map((num) => num.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

const Hook = (arg) => {
  const hash = ledger_last_hash()
  ASSERT(hash.length === 32)

  // return the hash
  return accept(toHex(hash), 0)
}
