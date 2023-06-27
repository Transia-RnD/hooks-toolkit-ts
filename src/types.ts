import {
  Hook,
  HookGrant,
  HookParameter,
} from '@transia/xrpl/dist/npm/models/common'
import {
  Client,
  SetHookFlagsInterface,
  Transaction,
  Wallet,
} from '@transia/xrpl'

export type iHook = {
  // HookHash?: string
  CreateCode?: string
  Flags?: number
  HookOn?: string
  HookNamespace?: string
  HookApiVersion?: number
  HookParameters?: HookParameter[]
  HookGrants?: HookGrant[]
}

export type SetHookParams = {
  client: Client
  seed: string
  hooks: Hook[]
  flags: number | SetHookFlagsInterface
  noop?: boolean | false
  override?: boolean | true
}

export interface SmartContractParams {
  wallet: Wallet
  tx: Transaction
}
