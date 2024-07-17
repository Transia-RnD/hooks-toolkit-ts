const ASSERT = (x, code) => {
  if (!x) {
    rollback(x.toString(), code)
  }
}

const DOESNT_EXIST = -5

const names = [
  'param0',
  'param1',
  'param2',
  'param3',
  'param4',
  'param5',
  'param6',
  'param7',
  'param8',
  'param9',
  'param10',
  'param11',
  'param12',
  'param13',
  'param14',
  'param15',
]
const values = [
  'value0',
  'value1',
  'value2',
  'value3',
  'value4',
  'value5',
  'value6',
  'value7',
  'value8',
  'value9',
  'value10',
  'value11',
  'value12',
  'value13',
  'value14',
  'value15',
]

const Hook = (arg) => {
  ASSERT(hook_param('') == DOESNT_EXIST)

  for (var i = 0; i < 16; ++i) {
    var s = 6 + (i < 10 ? 0 : 1)
    var buf = hook_param(names[i])
    ASSERT(buf.length == s)

    ASSERT(
      buf[0] == 'v' &&
        buf[1] == 'a' &&
        buf[2] == 'l' &&
        buf[3] == 'u' &&
        buf[4] == 'e'
    )
    ASSERT(buf[buf.length - 1] == values[i][buf.length - 1])
    ASSERT(buf[buf.length - 2] == values[i][buf.length - 2])
  }
  return accept('', 0)
}
