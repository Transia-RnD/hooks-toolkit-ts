import { iHookParamName } from './iHookParamName'
import { iHookParamValue } from './iHookParamValue'
import { HookParameter } from '@transia/xrpl/dist/npm/models/common'

export interface iHookParameter {
  HookParameterName: string
  HookParameterValue: string
}

export class iHookParamEntry {
  name: iHookParamName
  value: iHookParamValue

  constructor(name: iHookParamName, value: iHookParamValue) {
    this.name = name
    this.value = value
  }

  fromHex(name: string, value: string) {
    this.name = new iHookParamName(name)
    this.value = new iHookParamValue(value)
  }

  toXrpl(): HookParameter {
    console.log(this.name)
    console.log(this.value)

    return {
      HookParameter: {
        HookParameterName: !this.name.isHex
          ? this.name.toHex()
          : this.name.value,
        HookParameterValue: !this.value.isHex
          ? this.value.toHex()
          : this.value.value,
      },
    } as HookParameter
  }
}
