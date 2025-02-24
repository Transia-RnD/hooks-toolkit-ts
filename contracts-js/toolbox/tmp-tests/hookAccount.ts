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
  let acc2 = hook_account()
  trace('acc2', acc2, true)
  trace('number', 1, false)
  ASSERT(acc2.length == 20)
  return accept(acc2, 13, true)
}
