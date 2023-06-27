import { Wallet, calculateHookOn, hexHookParameters } from '@transia/xrpl'
import { SetHookParams, iHook } from './types'
import { HookGrant, HookParameter } from '@transia/xrpl/dist/npm/models/common'
import { readHookBinaryHexFromNS, hexNamespace } from './utils'
import { SetHook } from '@transia/xrpl/dist/npm/models/transactions/setHook'
import {
  prepareTransactionV3,
  testTransaction,
} from './libs/xrpl-helpers/transaction'

export function createHookPayload(
  version?: number | null,
  createFile?: string | null,
  namespace?: string | null,
  flags?: number | 0,
  hookOnArray?: string[] | null,
  hookParams?: HookParameter[] | null,
  hookGrants?: HookGrant[] | null
): iHook {
  const hook = {} as iHook
  if (typeof version === 'number') {
    hook.HookApiVersion = version
  }
  if (createFile && typeof createFile === 'string') {
    hook.CreateCode = readHookBinaryHexFromNS(createFile)
  }
  if (namespace) {
    hook.HookNamespace = hexNamespace(namespace)
  }
  if (flags) {
    hook.Flags = flags
  }
  if (hookOnArray) {
    hook.HookOn = calculateHookOn(hookOnArray)
  }
  if (hookParams) {
    hook.HookParameters = hexHookParameters(hookParams)
  }
  if (hookGrants) {
    hook.HookGrants = hookGrants
  }
  // DA: validate
  return hook
}

export async function setHooksV3({ client, seed, hooks }: SetHookParams) {
  const HOOK_ACCOUNT = Wallet.fromSeed(seed)
  const tx: SetHook = {
    TransactionType: `SetHook`,
    Account: HOOK_ACCOUNT.address,
    Hooks: hooks,
  }

  await prepareTransactionV3(client, tx)

  console.log(`1. Transaction to submit (before autofill):`)
  console.log(JSON.stringify(tx, null, 2))
  console.log(`\n2. Submitting transaction...`)

  await testTransaction(client, tx, HOOK_ACCOUNT, {
    hardFail: true,
    count: 2,
    delayMs: 1000,
  })

  console.log(`\n3. SetHook Success...`)
}
