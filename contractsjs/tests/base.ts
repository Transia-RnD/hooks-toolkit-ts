const ASSERT = (x, code) => {
  if (!x) {
    rollback(x.toString(), code)
  }
}

const names = [
  '706172616d30', // 'param0'
  '706172616d31', // 'param1'
  '706172616d32', // 'param2'
  '706172616d33', // 'param3'
]

function toHex(str) {
  let hexString = ''
  for (let i = 0; i < str.length; i++) {
    hexString += str.charCodeAt(i).toString(16).padStart(2, '0')
  }
  return hexString.toUpperCase()
}

const Hook = (arg) => {
  ASSERT(hook_param('636865636B6572') == DOESNT_EXIST)

  // this entry should havebeen added by the setter
  let buf = hook_param('68656C6C6F')
  ASSERT(buf.length === 5)
  ASSERT(
    buf[0] == 119 &&
      buf[1] == 111 &&
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
