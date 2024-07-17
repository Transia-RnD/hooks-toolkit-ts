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

const names = ['param0', 'param1', 'param2', 'param3']
const values = ['value0', 'value1', 'value2', 'value3']

const Hook = (arg) => {
  const checker_hash = hook_param(toHex('checker'))
  ASSERT(checker_hash.length === 32)

  for (let i = 0; i < 4; ++i) {
    ASSERT(
      hook_param_set(toHex(values[i]), toHex(names[i]), checker_hash).length ==
        6
    )
  }

  // "delete" the checker entry" for when the checker runs
  ASSERT(hook_param_set('', toHex('checker'), checker_hash) == 0)

  // add a parameter that did not previously exist
  ASSERT(hook_param_set(toHex('world'), toHex('hello'), checker_hash) == 5)

  // ensure this hook's parameters did not change
  for (let i = 0; i < 4; ++i) {
    const buf = hook_param(toHex(names[i]))
    ASSERT(buf.length == 6)

    ASSERT(
      buf[0] == 'v' &&
        buf[1] == 'a' &&
        buf[2] == 'l' &&
        buf[3] == 'u' &&
        buf[4] == 'e' &&
        buf[5] == '0'
    )
  }

  return accept('', 0)
}
