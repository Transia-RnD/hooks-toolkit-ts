import { convertHexToString, convertStringToHex } from 'xahau'

export class iHookParamValue {
  value: string
  isHex: boolean

  constructor(value: string, isHex?: boolean) {
    this.value = value
    this.isHex = isHex ? isHex : false
  }

  static from(value: string): iHookParamValue {
    return new iHookParamValue(value)
  }

  static fromHex(hexValue: string): iHookParamValue {
    return new iHookParamValue(convertHexToString(hexValue))
  }

  toHex(): string {
    return convertStringToHex(this.value)
  }
}
