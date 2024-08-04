import { ALREADY_SET, PREREQUISITE_NOT_MET } from 'jshooks-api'

const Hook = (r) => {
  if (r > 0) {
    if (hook_again() != PREREQUISITE_NOT_MET) return rollback('', 253)

    return accept('', 1)
  }

  if (hook_again() != 1) return rollback('', 254)

  if (hook_again() != ALREADY_SET) return rollback('', 255)
  return accept('', 0)
}
