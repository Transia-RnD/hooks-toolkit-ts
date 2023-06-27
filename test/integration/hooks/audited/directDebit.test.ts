import {
  Invoke,
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
import { AccountID, Currency } from '@transia/ripple-binary-codec/dist/types'
// xrpl-helpers
import {
  serverUrl,
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Application,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  floatToLEXfl,
  SetHookParams,
  createHookPayload,
  setHooksV3,
  ExecutionUtility,
} from '../../../../dist/npm/src'

// Error Group
// DirectDebit: ACCEPT: passing non-invoke txn
// DirectDebit: ACCEPT: ignore self invoke
// DirectDebit: ACCEPT: no params
// DirectDebit: ROLLBACK: invalid request amount
// DirectDebit: ROLLBACK: not authorized
// DirectDebit: ROLLBACK: different tx param vs hook param

// Success Group
// DirectDebit: ROLLBACK: exceeded monthly limit - TODO
// DirectDebit: ACCEPT: emit successful
// DirectDebit: ACCEPT: update parameter - TODO
// DirectDebit: ACCEPT: emit unsuccessful - TODO

describe('Application.directDebit - Error Group', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('invoke - passing non-invoke txn', async () => {
    const hook = createHookPayload(
      0,
      'direct_debit',
      'direct_debit',
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
    expect(hookExecutions.executions[0].HookReturnString).toBe(
      'Direct debit: Passing non-Invoke txn'
    )
  })
  it('invoke - ignore self invoke', async () => {
    const hook = createHookPayload(
      0,
      'direct_debit',
      'direct_debit',
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
      Account: aliceWallet.address,
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
      'Direct debit: Ignoring self-Invoke'
    )
  })
  it('invoke - no params', async () => {
    const hook = createHookPayload(
      0,
      'direct_debit',
      'direct_debit',
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
      Account: bobWallet.address,
      Destination: aliceWallet.address,
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
      'Direct debit: Passing Invoke that lacks REQAMT otxn parameter'
    )
  })
  it('invoke - invalid request amount', async () => {
    const hook = createHookPayload(
      0,
      'direct_debit',
      'direct_debit',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      const txParam1 = new iHookParamEntry(
        new iHookParamName('REQAMT'),
        new iHookParamValue(
          floatToLEXfl('0') +
            Currency.from('USD').toHex() +
            AccountID.from(testContext.gw.classicAddress).toHex(),
          true
        )
      )

      // INVOKE IN
      const aliceWallet = testContext.alice
      const bobWallet = testContext.bob
      const builtTx: Invoke = {
        TransactionType: 'Invoke',
        Account: bobWallet.address,
        Destination: aliceWallet.address,
        HookParameters: [txParam1.toXrpl()],
      }
      await Application.testHookTx(testContext.client, {
        wallet: bobWallet,
        tx: builtTx,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual('Direct debit: Invalid REQAMT')
      }
    }
  })
  it('invoke - not authorized', async () => {
    const hook = createHookPayload(
      0,
      'direct_debit',
      'direct_debit',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      const txParam1 = new iHookParamEntry(
        new iHookParamName('REQAMT'),
        new iHookParamValue(
          floatToLEXfl('10') +
            Currency.from('USD').toHex() +
            AccountID.from(testContext.gw.classicAddress).toHex(),
          true
        )
      )
      // INVOKE IN
      const aliceWallet = testContext.alice
      const bobWallet = testContext.bob
      const builtTx: Invoke = {
        TransactionType: 'Invoke',
        Account: bobWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        HookParameters: [txParam1.toXrpl()],
      }
      await Application.testHookTx(testContext.client, {
        wallet: bobWallet,
        tx: builtTx,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          'Direct debit: Requester is not authorized'
        )
      }
    }
  })
  it('invoke - different tx param vs hook param', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName(
        AccountID.from(testContext.bob.classicAddress).toHex(),
        true
      ),
      new iHookParamValue(
        floatToLEXfl('100') +
          Currency.from('EUR').toHex() +
          AccountID.from(testContext.gw.classicAddress).toHex(),
        true
      )
    )
    const hook = createHookPayload(
      0,
      'direct_debit',
      'direct_debit',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      const txParam1 = new iHookParamEntry(
        new iHookParamName('REQAMT'),
        new iHookParamValue(
          floatToLEXfl('10') +
            Currency.from('USD').toHex() +
            AccountID.from(testContext.gw.classicAddress).toHex(),
          true
        )
      )
      // INVOKE IN
      const aliceWallet = testContext.alice
      const bobWallet = testContext.bob
      const builtTx: Invoke = {
        TransactionType: 'Invoke',
        Account: bobWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        HookParameters: [txParam1.toXrpl()],
      }
      await Application.testHookTx(testContext.client, {
        wallet: bobWallet,
        tx: builtTx,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Direct debit: Requester is not authorized
        expect(error.message).toEqual(
          'Direct debit: Requested currency/issuer differs from authorized currency/issuer'
        )
      }
    }
  })
})

describe('Application.directDebit - Success Group', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('invoke - emit successful', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName(
        AccountID.from(testContext.bob.classicAddress).toHex(),
        true
      ),
      new iHookParamValue(
        floatToLEXfl('100') +
          Currency.from('USD').toHex() +
          AccountID.from(testContext.gw.classicAddress).toHex(),
        true
      )
    )
    const hook = createHookPayload(
      0,
      'direct_debit',
      'direct_debit',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    const txParam1 = new iHookParamEntry(
      new iHookParamName('REQAMT'),
      new iHookParamValue(
        floatToLEXfl('100') +
          Currency.from('USD').toHex() +
          AccountID.from(testContext.gw.classicAddress).toHex(),
        true
      )
    )
    // INVOKE IN
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      HookParameters: [txParam1.toXrpl()],
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
      'Direct debit: Successfully emitted'
    )
  })

  // it('invoke - update parameter', async () => {
  //   const cur = Currency.from('USD')
  //   const acct = AccountID.from(testContext.gw.classicAddress)
  //   const param1: iHookParam = {
  //     name: new iHookParamName('REQAMT'),
  //     value: new iHookParamValue(
  //       floatToLEXfl('20') + cur.toHex() + acct.toHex()
  //     ),
  //   }
  //   const hook = createHookPayload(
  //     0,
  //     'highvalue_prepare',
  //     'highvalue_prepare',
  //     SetHookFlags.hsfOverride,
  //     ['Invoke'],
  //     [param1.toXrpl()]
  //   )
  //   await setHooksV3({
  //     client: testContext.client,
  //     seed: testContext.alice.seed,
  //     hooks: [{ Hook: hook }],
  //   } as SetHookParams)

  //   const txParam1: iHookParam = {
  //     name: new iHookParamName('REQAMT'),
  //     value: new iHookParamValue(
  //       floatToLEXfl('10') + cur.toHex() + acct.toHex()
  //     ),
  //   }
  //   // INVOKE IN
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const builtTx: Invoke = {
  //     TransactionType: 'Invoke',
  //     Account: bobWallet.classicAddress,
  //     Destination: aliceWallet.classicAddress,
  //     HookParameters: [txParam1.toXrpl()],
  //   }
  //   const result = await Application.testHookTx(testContext.client, {
  //     wallet: aliceWallet,
  //     tx: builtTx,
  //   })
  //   const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
  //     testContext.client,
  //     result.meta as TransactionMetadata
  //   )
  //   expect(hookExecutions.executions[0].HookReturnString).toEqual(
  //     'Direct debit: Successfully emitted'
  //   )
  // })
})
