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
  const hash = hook_hash(-1)
  ASSERT(hash.length == 32, 0)
  trace('hash', hash, false)

  // return the hash as the return string
  return accept(toHex(hash), 0)
}
