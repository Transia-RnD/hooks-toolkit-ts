import { iHookFunctionName } from './iHookFunctionName'
import { HookFunction } from './tmp'

export interface iHookFunction {
  FunctionName: string
  FunctionParameters: string
  Flags: number
  Fee: number
}

export class iHookFunctionEntry {
  name: iHookFunctionName

  constructor(name: iHookFunctionName) {
    this.name = name
  }

  fromHex(name: string) {
    this.name = new iHookFunctionName(name)
  }

  toXrpl(): HookFunction {
    return {
      HookFunction: {
        FunctionName: !this.name.isHex ? this.name.toHex() : this.name.value,
      },
    } as HookFunction
  }
}
