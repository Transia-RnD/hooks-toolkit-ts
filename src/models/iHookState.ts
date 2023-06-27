import { HookState as LeHookState } from '@transia/xrpl/dist/npm/models/ledger'
import { iHookStateEntry } from './iHookStateEntry'

export class iHookState {
  entry: iHookStateEntry

  constructor(entry: LeHookState) {
    this.entry = new iHookStateEntry(entry)
  }
}
