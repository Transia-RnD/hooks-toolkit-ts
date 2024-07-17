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
  // Test out of bounds check
  let nonce = ledger_nonce()
  ASSERT(nonce.length == 32)
  nonce = nonce.concat(ledger_nonce())
  ASSERT(nonce.length == 64)

  // return the two nonces as the return string
  accept(toHex(nonce), 0)
}
