import { convertHexToString, convertStringToHex } from 'xahau'

export class iHookParamName {
  value: string
  isHex: boolean

  constructor(value: string, isHex?: boolean) {
    this.value = value
    this.isHex = isHex ? isHex : false
  }

  static fromHex(hexValue: string): iHookParamName {
    return new iHookParamName(convertHexToString(hexValue))
  }

  toHex(): string {
    return convertStringToHex(this.value)
  }
}
