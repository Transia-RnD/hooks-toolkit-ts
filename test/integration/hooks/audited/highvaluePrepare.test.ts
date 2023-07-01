// xrpl
import {
  Invoke,
  LedgerEntryRequest,
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
import {
  AccountID,
  UInt64,
  Amount,
} from '@transia/ripple-binary-codec/dist/types'
import { HookDefinition as LeHookDefinition } from '@transia/xrpl/dist/npm/models/ledger'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Application,
  SetHookParams,
  ExecutionUtility,
  StateUtility,
  createHookPayload,
  flipHex,
  genHash,
  intToHex,
  setHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
} from '../../../../dist/npm/src'

// HighValue.Provider: ACCEPT: passing non hook on txn
// HighValue.Provider: ACCEPT: ignoring non self-invoke
// HighValue.Provider: ACCEPT: amount param missing
// HighValue.Provider: ACCEPT: dest param missing
// HighValue.Provider: ACCEPT: ready for txn
// HighValue.Provider: ACCEPT: could not set state - TODO

describe('Application.highvaluePrepare', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('highvalue prepare - passing non hook on txn', async () => {
    const hook = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue_prepare',
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
      Amount: xrpToDrops(1),
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'High value: Passing non hook on txn'
    )
  })

  it('highvalue prepare - ignoring non self-Invoke', async () => {
    const hook = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue_prepare',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE IN
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
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'High value: Ignoring non self-Invoke'
    )
  })

  it('highvalue prepare - dest param missing', async () => {
    const hook = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue_prepare',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE IN
    const aliceWallet = testContext.alice
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
    }
    try {
      await Application.testHookTx(testContext.client, {
        wallet: aliceWallet,
        tx: builtTx,
      })
    } catch (error: any) {
      expect(error.message).toEqual('High value: Dest param missing (HDE)')
    }
  })

  it('highvalue prepare - amount param missing', async () => {
    const hook = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue_prepare',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      const bobAcct = AccountID.from(testContext.bob.classicAddress)
      const txParam1 = new iHookParamEntry(
        new iHookParamName('HDE'),
        new iHookParamValue(bobAcct.toHex(), true)
      )

      // INVOKE IN
      const aliceWallet = testContext.alice
      const builtTx: Invoke = {
        TransactionType: 'Invoke',
        Account: aliceWallet.classicAddress,
        HookParameters: [txParam1.toXrpl()],
      }
      await Application.testHookTx(testContext.client, {
        wallet: aliceWallet,
        tx: builtTx,
      })
    } catch (error: any) {
      expect(error.message).toEqual('High value: Amount param missing (HAM)')
    }
  })

  it('highvalue prepare xrp - ready for txn', async () => {
    const bobAcct = AccountID.from(testContext.bob.classicAddress)
    const param1 = new iHookParamEntry(
      new iHookParamName('HDE'),
      new iHookParamValue(bobAcct.toHex(), true)
    )
    const param2 = new iHookParamEntry(
      new iHookParamName('HDT'),
      new iHookParamValue(intToHex(3, 4), true)
    )
    const param3 = new iHookParamEntry(
      new iHookParamName('HAM'),
      new iHookParamValue(Amount.from(xrpToDrops(10)).toHex(), true)
    )

    const hook = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue_prepare',
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
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [param1.toXrpl(), param2.toXrpl(), param3.toXrpl()],
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'High value: Ready for txn'
    )

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

    const hash = genHash(
      testContext.bob.classicAddress,
      Amount.from(xrpToDrops(10)),
      3
    )

    console.log(hash)

    const hookState = await StateUtility.getHookState(
      testContext.client,
      testContext.alice.classicAddress,
      hash,
      leHookDef.HookNamespace as string
    )
    const lgrState = Number(
      UInt64.from(flipHex(hookState.HookStateData)).valueOf()
    )
    expect(result.ledger_index).toEqual(lgrState)
  })

  it('highvalue prepare token - ready for txn', async () => {
    const bobAcct = AccountID.from(testContext.bob.classicAddress)
    const param1 = new iHookParamEntry(
      new iHookParamName('HDE'),
      new iHookParamValue(bobAcct.toHex(), true)
    )
    const param2 = new iHookParamEntry(
      new iHookParamName('HDT'),
      new iHookParamValue(intToHex(3, 4), true)
    )
    const param3 = new iHookParamEntry(
      new iHookParamName('HAM'),
      new iHookParamValue(
        Amount.from({
          value: '10',
          currency: 'USD',
          issuer: testContext.gw.classicAddress,
        }).toHex(),
        true
      )
    )

    const hook = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue_prepare',
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
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [param1.toXrpl(), param2.toXrpl(), param3.toXrpl()],
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'High value: Ready for txn'
    )

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

    const hash = genHash(
      testContext.bob.classicAddress,
      Amount.from({
        value: '10',
        currency: 'USD',
        issuer: testContext.gw.classicAddress,
      }),
      3
    )
    const hookState = await StateUtility.getHookState(
      testContext.client,
      testContext.alice.classicAddress,
      hash,
      leHookDef.HookNamespace as string
    )
    const lgrState = Number(
      UInt64.from(flipHex(hookState.HookStateData)).valueOf()
    )
    expect(result.ledger_index).toEqual(lgrState)
  })
})
