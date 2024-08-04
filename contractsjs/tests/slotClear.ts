import { DOESNT_EXIST } from 'jshooks-api'

const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const Hook = (arg) => {
  ASSERT(otxn_slot(1) === 1, 1)

  ASSERT(slot_size(1) > 0, 2)

  ASSERT(slot_clear(1) === 1, 3)

  ASSERT(slot_size(1) === DOESNT_EXIST, 4)

  ASSERT(slot_clear(1) === DOESNT_EXIST, 5)
  ASSERT(slot_clear(10) === DOESNT_EXIST, 6)

  accept('', 0)
}

export { Hook }
