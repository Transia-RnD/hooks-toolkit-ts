const ASSERT = (x, code) => {
  if (!x) {
    rollback(x.toString(), code)
  }
}

const DOESNT_EXIST = -5

const names = ['param0', 'param1', 'param2', 'param3']

function toHex(str) {
  let hexString = ''
  for (let i = 0; i < str.length; i++) {
    hexString += str.charCodeAt(i).toString(16).padStart(2, '0')
  }
  return hexString.toUpperCase()
}

const Hook = (arg) => {
  ASSERT(hook_param(toHex('checker')) == DOESNT_EXIST)

  // this entry should havebeen added by the setter
  let buf = hook_param(toHex('hello'))
  ASSERT(buf.length === 5)
  ASSERT(
    buf[0] == 'w' &&
      buf[1] == 'o' &&
      buf[2] == 'r' &&
      buf[3] == 'l' &&
      buf[4] == 'd'
  )

  // these pre-existing entries should be modified by the setter
  for (let i = 0; i < 4; ++i) {
    buf = hook_param(toHex(names[i]))
    ASSERT(buf.length == 6)
    ASSERT(
      buf[0] == 'v' &&
        buf[1] == 'a' &&
        buf[2] == 'l' &&
        buf[3] == 'u' &&
        buf[4] == 'e' &&
        buf[5] == '0' + i
    )
  }

  return accept('', 0)
}
