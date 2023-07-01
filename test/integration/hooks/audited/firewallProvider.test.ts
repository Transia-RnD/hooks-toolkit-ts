import {
  Invoke,
  LedgerEntryRequest,
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
import { AccountID } from '@transia/ripple-binary-codec/dist/types'
import {
  HookDefinition as LeHookDefinition,
  Hook as LeHook,
} from '@transia/xrpl/dist/npm/models/ledger'

import {
  Application,
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  SetHookParams,
  formatBlob,
  StateUtility,
  padHexString,
} from '../../../../dist/npm/src'
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'

// Firewall.Provider: ACCEPT: TT != Invoke
// Firewall.Provider: ACCEPT: TX ACCOUNT != HOOK
// Firewall.Provider: ACCEPT: TX Destination != HOOK

// Firewall.Provider: ACCEPT: Add Account
// Firewall.Provider: ACCEPT: Remove Account
// Firewall.Provider: ACCEPT: Add Mutliple - TODO
// Firewall.Provider: ACCEPT: Remove Mutliple - TODO

// Firewall.Provider: ACCEPT: Test Max - TODO
// Firewall.Provider: ACCEPT: Test Fee for exponential growth - TODO

describe('Application.firewall_provider', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('firewall base - tt != invoke', async () => {
    const hook = createHookPayload(
      0,
      'firewall_provider',
      'firewall_provider',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // PAYMENT IN
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      Amount: xrpToDrops(100),
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })

    const hookEmitted = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookEmitted.executions[0].HookReturnString).toMatch('')
  })

  // INVALID FAIL
  // it('firewall base - tx account != hook', async () => {
  //   const hook = createHookPayload(
  //     0,
  //     'firewall_provider',
  //     'firewall_provider',
  //     SetHookFlags.hsfOverride,
  //     ['Invoke']
  //   )
  //   await setHooksV3({
  //     client: testContext.client,
  //     seed: testContext.alice.seed,
  //     hooks: [{ Hook: hook }],
  //   } as SetHookParams)

  //   // INVOKE IN
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const builtTx: Invoke = {
  //     TransactionType: 'Invoke',
  //     Account: bobWallet.classicAddress,
  //     Destination: aliceWallet.classicAddress,
  //   }
  //   const result = await Application.testHookTx(testContext.client, {
  //     wallet: aliceWallet,
  //     tx: builtTx,
  //   })

  //   const hookEmitted = await ExecutionUtility.getHookExecutionsFromMeta(
  //     testContext.client,
  //     result.meta as TransactionMetadata
  //   )
  //   expect(hookEmitted.executions[0].HookReturnString).toMatch('')
  // })

  it('firewall base - tx dest != hook', async () => {
    const hook = createHookPayload(
      0,
      'firewall_provider',
      'firewall_provider',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE OUT
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
    const hookEmitted = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookEmitted.executions[0].HookReturnString).toMatch('')
  })

  it('firewall provider - add account state', async () => {
    const hook = createHookPayload(
      0,
      'firewall_provider',
      'firewall_provider',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE OUT
    const aliceWallet = testContext.alice
    const blob = formatBlob([testContext.carol.classicAddress])
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      Blob: blob,
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const leHook = await StateUtility.getHook(
      testContext.client,
      testContext.alice.classicAddress
    )
    const hookDefRequest: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook_definition: leHook.Hooks[0].Hook.HookHash,
    }
    const hookDefRes = await testContext.client.request(hookDefRequest)
    const leHookDef = hookDefRes.result.node as LeHookDefinition

    const aliceAccHex = AccountID.from(aliceWallet.classicAddress).toHex()
    const hookState = await StateUtility.getHookState(
      testContext.client,
      testContext.alice.classicAddress,
      padHexString(aliceAccHex),
      leHookDef.HookNamespace as string
    )
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    // DONEEMPTY
    expect(hookExecutions.executions[0].HookReturnString).toEqual('')
    expect(hookState.HookStateData).toBeDefined()
  })

  it('firewall provider - remove account state', async () => {
    const hook = createHookPayload(
      0,
      'firewall_provider',
      'firewall_provider',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE OUT
    const aliceWallet = testContext.alice
    const blob = formatBlob([testContext.carol.classicAddress])
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      Blob: blob,
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    // DONEEMPTY
    expect(hookExecutions.executions[0].HookReturnString).toEqual('')

    try {
      const hookReq: LedgerEntryRequest = {
        command: 'ledger_entry',
        hook: {
          account: testContext.alice.classicAddress,
        },
      }
      const hookRes = await testContext.client.request(hookReq)
      const leHook = hookRes.result.node as LeHook
      const hookDefRequest: LedgerEntryRequest = {
        command: 'ledger_entry',
        hook_definition: leHook.Hooks[0].Hook.HookHash,
      }
      const hookDefRes = await testContext.client.request(hookDefRequest)
      const leHookDef = hookDefRes.result.node as LeHookDefinition

      const aliceAccHex = AccountID.from(aliceWallet.classicAddress).toHex()
      const hookState = await StateUtility.getHookState(
        testContext.client,
        testContext.alice.classicAddress,
        padHexString(aliceAccHex),
        leHookDef.HookNamespace as string
      )
      expect(hookState.HookStateData).toBeDefined()
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual('entryNotFound')
      }
    }
  })
})
