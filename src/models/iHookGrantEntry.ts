import { iHookGrantHash } from './iHookGrantHash'
import { iHookGrantAuthorize } from './iHookGrantAuthorize'
import { HookGrant } from '@transia/xrpl/dist/npm/models/common'

export interface iHookGrant {
  HookGrantHookHash: string
  HookGrantAuthorize: string
}

export class iHookGrantEntry {
  hash: iHookGrantHash
  account: iHookGrantAuthorize | null

  constructor(hash: iHookGrantHash, account?: iHookGrantAuthorize) {
    this.hash = hash
    this.account = account || null
  }

  fromHex(hash: string, account: string) {
    this.hash = new iHookGrantHash(hash)
    this.account = new iHookGrantAuthorize(account)
  }

  toXrpl(): HookGrant {
    const hookGrant = {
      HookGrant: {
        HookHash: this.hash.value,
      },
    } as HookGrant
    if (this.account?.value) {
      hookGrant.HookGrant.Authorize = this.account.value
    }
    return hookGrant
  }
}
