import { convertHexToString, convertStringToHex } from '@transia/xrpl'

export class iHookStateData {
  data: string

  constructor(data: string) {
    this.data = data
  }

  static from(value: string): iHookStateData {
    return new iHookStateData(convertHexToString(value))
  }

  hex(): string {
    return convertStringToHex(this.data)
  }
}
