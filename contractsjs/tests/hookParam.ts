import { DOESNT_EXIST, INVALID_ARGUMENT } from 'jshooks-api'

const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const names = [
  '706172616d30', // 'param0'
  '706172616d31', // 'param1'
  '706172616d32', // 'param2'
  '706172616d33', // 'param3'
  '706172616d34', // 'param4'
  '706172616d35', // 'param5'
  '706172616d36', // 'param6'
  '706172616d37', // 'param7'
  '706172616d38', // 'param8'
  '706172616d39', // 'param9'
  '706172616d3130', // 'param10'
  '706172616d3131', // 'param11'
  '706172616d3132', // 'param12'
  '706172616d3133', // 'param13'
  '706172616d3134', // 'param14'
  '706172616d3135', // 'param15'
]
const values = [
  [118, 97, 108, 117, 101, 48], // 'value0'
  [118, 97, 108, 117, 101, 49], // 'value1'
  [118, 97, 108, 117, 101, 50], // 'value2'
  [118, 97, 108, 117, 101, 51], // 'value3'
  [118, 97, 108, 117, 101, 52], // 'value4'
  [118, 97, 108, 117, 101, 53], // 'value5'
  [118, 97, 108, 117, 101, 54], // 'value6'
  [118, 97, 108, 117, 101, 55], // 'value7'
  [118, 97, 108, 117, 101, 56], // 'value8'
  [118, 97, 108, 117, 101, 57], // 'value9'
  [118, 97, 108, 117, 101, 49, 48], // 'value10'
  [118, 97, 108, 117, 101, 49, 49], // 'value11'
  [118, 97, 108, 117, 101, 49, 50], // 'value12'
  [118, 97, 108, 117, 101, 49, 51], // 'value13'
  [118, 97, 108, 117, 101, 49, 52], // 'value14'
  [118, 97, 108, 117, 101, 49, 53], // 'value15'
]

const Hook = (arg) => {
  ASSERT(hook_param(0) === INVALID_ARGUMENT)
  ASSERT(hook_param('') === INVALID_ARGUMENT)
  ASSERT(hook_param([]) === INVALID_ARGUMENT)
  ASSERT(hook_param(undefined) === INVALID_ARGUMENT)
  ASSERT(hook_param(null) === INVALID_ARGUMENT)
  ASSERT(hook_param([0]) === DOESNT_EXIST)

  for (let i = 0; i < 16; ++i) {
    const s = 6 + (i < 10 ? 0 : 1)
    const buf = otxn_param(names[i])
    ASSERT(buf.length === s)
    ASSERT(
      buf[0] === 118 &&
        buf[1] === 97 &&
        buf[2] === 108 &&
        buf[3] === 117 &&
        buf[4] === 101
    )
    ASSERT(buf[buf.length - 1] === values[i][buf.length - 1])
    ASSERT(buf[buf.length - 2] === values[i][buf.length - 2])
  }
  return accept('', 0)
}

export { Hook }
