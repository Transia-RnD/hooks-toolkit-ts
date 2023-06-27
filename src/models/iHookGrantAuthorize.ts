export class iHookGrantAuthorize {
  value: string

  constructor(value: string) {
    this.value = value
  }

  static from(value: string): iHookGrantAuthorize {
    return new iHookGrantAuthorize(value)
  }
}
