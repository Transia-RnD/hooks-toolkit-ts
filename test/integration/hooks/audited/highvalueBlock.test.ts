// xrpl
import {
  Invoke,
  LedgerEntryRequest,
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
import {
  AccountID,
  Currency,
  Amount,
} from '@transia/ripple-binary-codec/dist/types'
import {
  HookDefinition as LeHookDefinition,
  // Hook as LeHook,
} from '@transia/xrpl/dist/npm/models/ledger'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  ledgerAccept,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Application,
  SetHookParams,
  ExecutionUtility,
  StateUtility,
  createHookPayload,
  floatToLEXfl,
  genHash,
  intToHex,
  setHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
} from '../../../../dist/npm/src'

// HighValue.Block: ACCEPT: passing non-Payment txn
// HighValue.Block: ACCEPT: ignoring incoming Payment
// HighValue.Block: ACCEPT: passing outgoing Payment txn for which no threshold is set
// HighValue.Block: ROLLBACK: payment exceeds threshold
// HighValue.Block: ROLLBACK: too soon
// HighValue.Block: ACCEPT: passing prepared high value txn
// HighValue.Block: ACCEPT: passing outgoing Payment less than threshold

async function advanceby(ctx: XrplIntegrationTestContext, amount: number) {
  const promises: Array<Promise<unknown>> = []
  for (let i = 0; i < amount; i++) {
    promises.push(ledgerAccept(ctx.client))
  }
  await Promise.all(promises)
}

describe('Application.highvalue_block', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('highvalue base - passing non hook on txn', async () => {
    const hook = createHookPayload(
      0,
      'highvalue_block',
      'highvalue_block',
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
      'High value: Passing non-Payment txn'
    )
  })

  it('highvalue base - ignoring incoming Payment', async () => {
    const hook = createHookPayload(
      0,
      'highvalue_block',
      'highvalue_block',
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
      'High value: Ignoring incoming Payment'
    )
  })

  it('highvalue base - passing outgoing Payment txn for which no threshold is set', async () => {
    const hook = createHookPayload(
      0,
      'highvalue_block',
      'highvalue_block',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // PAYMENT OUT
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: bobWallet.classicAddress,
      Amount: xrpToDrops(1),
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
      'High value: Passing outgoing Payment txn for which no threshold is set'
    )
  })

  it('highvalue base - payment exceeds threshold', async () => {
    const hook1 = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    const hook2param1 = new iHookParamEntry(
      new iHookParamName('HVD'),
      new iHookParamValue(Amount.from(xrpToDrops(10)).toHex(), true)
    )
    const hook2 = createHookPayload(
      0,
      'highvalue_block',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [hook2param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook1 }, { Hook: hook2 }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    try {
      // PAYMENT OUT - Hook 2: Tx 1
      const built2Tx1: Payment = {
        TransactionType: 'Payment',
        Account: aliceWallet.classicAddress,
        Destination: bobWallet.classicAddress,
        Amount: xrpToDrops(11),
      }
      await Application.testHookTx(testContext.client, {
        wallet: aliceWallet,
        tx: built2Tx1,
      })
    } catch (error: any) {
      expect(error.message).toEqual('High value: Payment exceeds threshold')
    }
  })

  it('highvalue base - too soon', async () => {
    const hook1 = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    const hook2param1 = new iHookParamEntry(
      new iHookParamName('HVD'),
      new iHookParamValue(floatToLEXfl('8'), true)
    )
    const hook2 = createHookPayload(
      0,
      'highvalue_block',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [hook2param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook1 }, { Hook: hook2 }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    // INVOKE OUT - Hook 1: Tx 1
    const bobAcct = AccountID.from(testContext.bob.classicAddress)
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('HDE'),
      new iHookParamValue(bobAcct.toHex(), true)
    )
    // const tx1param2 = new iHookParamEntry(
    //   new iHookParamName('HDT'),
    //   new iHookParamValue(intToHex(2, 4), true)
    // )
    const tx1param3 = new iHookParamEntry(
      new iHookParamName('HAM'),
      new iHookParamValue(Amount.from(xrpToDrops(9)).toHex(), true)
    )
    const built1Tx1: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [
        tx1param1.toXrpl(),
        // tx1param2.toXrpl(),
        tx1param3.toXrpl(),
      ],
    }
    await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: built1Tx1,
    })

    // PAYMENT OUT - Hook 2: Tx 1
    const built2Tx1: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: bobWallet.classicAddress,
      Amount: xrpToDrops(9),
    }
    try {
      await Application.testHookTx(testContext.client, {
        wallet: aliceWallet,
        tx: built2Tx1,
      })
    } catch (error: any) {
      expect(error.message).toEqual(
        'High value: Too soon, wait until 10 ledgers have passed'
      )
    }
  })

  it('highvalue base xrp - passing prepared high value txn', async () => {
    const hook1 = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    const hook2param1 = new iHookParamEntry(
      new iHookParamName('HVD'),
      new iHookParamValue(floatToLEXfl('10'), true)
    )
    const hook2 = createHookPayload(
      0,
      'highvalue_block',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [hook2param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook1 }, { Hook: hook2 }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    // INVOKE OUT - Hook 1: Tx 1
    const bobAcct = AccountID.from(testContext.bob.classicAddress)
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('HDE'),
      new iHookParamValue(bobAcct.toHex(), true)
    )
    // const tx1param2 = new iHookParamEntry(
    //   new iHookParamName('HDT'),
    //   new iHookParamValue(intToHex(2, 4), true)
    // )
    const tx1param3 = new iHookParamEntry(
      new iHookParamName('HAM'),
      new iHookParamValue(Amount.from(xrpToDrops(11)).toHex(), true)
    )
    const built1Tx1: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [
        tx1param1.toXrpl(),
        // tx1param2.toXrpl(),
        tx1param3.toXrpl(),
      ],
    }
    await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: built1Tx1,
    })

    await advanceby(testContext, 11)

    // PAYMENT OUT - Hook 2: Tx 1
    const built2Tx1: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: bobWallet.classicAddress,
      Amount: xrpToDrops(11),
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: built2Tx1,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )

    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'High value: Passing prepared high value txn'
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
      Amount.from(xrpToDrops(11)),
      undefined
    )
    try {
      await StateUtility.getHookState(
        testContext.client,
        testContext.alice.classicAddress,
        hash,
        leHookDef.HookNamespace as string
      )
    } catch (error: any) {
      expect(error.message).toEqual('entryNotFound')
    }
  })

  it('highvalue base token - passing prepared high value txn', async () => {
    const hook1 = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    const hook2param1 = new iHookParamEntry(
      new iHookParamName('HVT'),
      new iHookParamValue(
        floatToLEXfl('10') +
          Currency.from('USD').toHex() +
          AccountID.from(testContext.gw.classicAddress).toHex(),
        true
      )
    )
    const hook2 = createHookPayload(
      0,
      'highvalue_block',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [hook2param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook1 }, { Hook: hook2 }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    // INVOKE OUT - Hook 1: Tx 1
    const bobAcct = AccountID.from(testContext.bob.classicAddress)
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('HDE'),
      new iHookParamValue(bobAcct.toHex(), true)
    )
    // const tx1param2 = new iHookParamEntry(
    //   new iHookParamName('HDT'),
    //   new iHookParamValue(intToHex(2, 4), true)
    // )

    const tx1param3 = new iHookParamEntry(
      new iHookParamName('HAM'),
      new iHookParamValue(
        Amount.from({
          value: '11',
          currency: 'USD',
          issuer: testContext.gw.classicAddress,
        }).toHex(),
        true
      )
    )
    const built1Tx1: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [
        tx1param1.toXrpl(),
        // tx1param2.toXrpl(),
        tx1param3.toXrpl(),
      ],
    }
    await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: built1Tx1,
    })

    await advanceby(testContext, 11)

    const amount: IssuedCurrencyAmount = {
      value: '11',
      currency: 'USD',
      issuer: testContext.gw.classicAddress,
    }

    // PAYMENT OUT - Hook 2: Tx 1
    const built2Tx1: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: bobWallet.classicAddress,
      Amount: amount,
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: built2Tx1,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'High value: Passing prepared high value txn'
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
        value: '11',
        currency: 'USD',
        issuer: testContext.gw.classicAddress,
      }),
      undefined
    )
    try {
      await StateUtility.getHookState(
        testContext.client,
        testContext.alice.classicAddress,
        hash,
        leHookDef.HookNamespace as string
      )
    } catch (error: any) {
      expect(error.message).toEqual('entryNotFound')
    }
  })

  it('highvalue base - passing outgoing Payment less than threshold', async () => {
    const hook1 = createHookPayload(
      0,
      'highvalue_prepare',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    const hook2param1 = new iHookParamEntry(
      new iHookParamName('HVD'),
      new iHookParamValue(floatToLEXfl('10'), true)
    )
    const hook2 = createHookPayload(
      0,
      'highvalue_block',
      'highvalue',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [hook2param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook1 }, { Hook: hook2 }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    // INVOKE OUT - Hook 1: Tx 1
    const bobAcct = AccountID.from(testContext.bob.classicAddress)
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('HDE'),
      new iHookParamValue(bobAcct.toHex(), true)
    )
    const tx1param2 = new iHookParamEntry(
      new iHookParamName('HDT'),
      new iHookParamValue(intToHex(0, 4), true)
    )
    const tx1param3 = new iHookParamEntry(
      new iHookParamName('HAM'),
      new iHookParamValue(Amount.from(xrpToDrops(10)).toHex(), true)
    )
    const built1Tx1: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [
        tx1param1.toXrpl(),
        tx1param2.toXrpl(),
        tx1param3.toXrpl(),
      ],
    }
    await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: built1Tx1,
    })

    // PAYMENT OUT - Hook 2: Tx 1
    const built2Tx1: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: bobWallet.classicAddress,
      Amount: xrpToDrops(9),
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: built2Tx1,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'High value: Passing outgoing Payment less than threshold'
    )
  })
})
