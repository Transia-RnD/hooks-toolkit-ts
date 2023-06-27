export class iHookGrantHash {
  value: string

  constructor(value: string) {
    this.value = value
  }

  static from(value: string): iHookGrantHash {
    return new iHookGrantHash(value)
  }
}
