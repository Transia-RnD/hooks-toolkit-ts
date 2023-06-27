import { convertHexToString, convertStringToHex } from '@transia/xrpl'

export class iHookStateKey {
  key: string

  constructor(key: string) {
    this.key = key
  }

  static from(value: string): iHookStateKey {
    return new iHookStateKey(convertHexToString(value))
  }

  hex(): string {
    return convertStringToHex(this.key)
  }
}
