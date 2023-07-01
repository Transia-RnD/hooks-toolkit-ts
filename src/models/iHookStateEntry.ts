import { HookState as LeHookState } from '@transia/xrpl/dist/npm/models/ledger'
import { iHookStateKey } from './iHookStateKey'
import { iHookStateData } from './iHookStateData'

export class iHookStateEntry {
  key: iHookStateKey
  data: iHookStateData
  constructor({
    HookStateKey: hookStateKey,
    HookStateData: hookStateData,
  }: LeHookState) {
    this.key = iHookStateKey.from(hookStateKey)
    this.data = iHookStateData.from(hookStateData)
  }
}
