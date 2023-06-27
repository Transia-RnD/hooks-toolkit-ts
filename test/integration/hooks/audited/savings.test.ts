import {
  // Invoke,
  Payment,
  SetHookFlags,
  TransactionMetadata,
  // xrpToDrops,
} from '@transia/xrpl'
import { AccountID } from '@transia/ripple-binary-codec/dist/types'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  serverUrl,
  setupClient,
  teardownClient,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Application,
  SetHookParams,
  ExecutionUtility,
  createHookPayload,
  floatToLEXfl,
  setHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
} from '../../../../dist/npm/src'

// Error Group
// Savings: ACCEPT: Passing non-payment txn
// Savings: ACCEPT: Could not load target balance - SKIP
// Savings: ACCEPT: Could not load target balance 2 - SKIP
// Savings: ACCEPT: state save failed due to low reserve, passing txn without emitting - SKIP
// Savings: ACCEPT: state load failed, passing txn without emitting - SKIP
// Savings: ACCEPT: No account set
// Savings: ACCEPT: Dest account doesn't exist
// Savings: ACCEPT: Threshold not met in (xrp)
// Savings: ACCEPT: Threshold not met out (xrp)
// Savings: ACCEPT: Skipping 0 / invalid send - TODO
// Savings: ACCEPT: Trustline missing on dest account - TODO

// Success Group
// Savings: ACCEPT: Outgoing (xrp)
// Savings: ACCEPT: Incoming (xrp)
// Savings: ACCEPT: Outgoing (token)
// Savings: ACCEPT: Incoming (token)

// describe('Application.savings - Error Group', () => {
//   let testContext: XrplIntegrationTestContext

//   beforeAll(async () => {
//     testContext = await setupClient(serverUrl)
//   })
//   afterAll(async () => teardownClient(testContext))

//   it('hookOn: Invalid Parameters', async () => {
//     // SET HOOK
//     const hook = createHookPayload(
//       0,
//       'savings',
//       'savings',
//       SetHookFlags.hsfOverride,
//       ['Invoke']
//     )
//     await setHooksV3({
//       client: testContext.client,
//       seed: testContext.alice.seed,
//       hooks: [{ Hook: hook }],
//     } as SetHookParams)

//     // INVOKE IN
//     const aliceWallet = testContext.alice
//     const bobWallet = testContext.bob
//     const builtTx: Invoke = {
//       TransactionType: 'Invoke',
//       Account: bobWallet.classicAddress,
//       Destination: aliceWallet.classicAddress,
//     }
//     const result = await Application.testHookTx(testContext.client, {
//       wallet: bobWallet,
//       tx: builtTx,
//     })
//     const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
//       testContext.client,
//       result.meta as TransactionMetadata
//     )
//     // TODO: Fix this. Too short
//     expect(hookExecutions.executions[0].HookReturnString).toMatch('')
//   })

//   it('hookOn: Invalid TT', async () => {
//     // SET HOOK
//     const hook = createHookPayload(
//       0,
//       'savings',
//       'savings',
//       SetHookFlags.hsfOverride,
//       ['Invoke']
//     )
//     await setHooksV3({
//       client: testContext.client,
//       seed: testContext.alice.seed,
//       hooks: [{ Hook: hook }],
//     } as SetHookParams)

//     // INVOKE IN
//     const aliceWallet = testContext.alice
//     const bobWallet = testContext.bob
//     const builtTx: Invoke = {
//       TransactionType: 'Invoke',
//       Account: bobWallet.classicAddress,
//       Destination: aliceWallet.classicAddress,
//     }
//     const result = await Application.testHookTx(testContext.client, {
//       wallet: bobWallet,
//       tx: builtTx,
//     })
//     const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
//       testContext.client,
//       result.meta as TransactionMetadata
//     )
//     // TODO: Fix this. Too short
//     expect(hookExecutions.executions[0].HookReturnString).toMatch('')
//   })
//   it('parameters: No account set', async () => {
//     // SET HOOK
//     const param1 = new iHookParamEntry(
//       new iHookParamName('SDO'),
//       new iHookParamValue(
//         floatToLEXfl(xrpToDrops(100)) + floatToLEXfl('0.10'),
//         true
//       )
//     )
//     const param2 = new iHookParamEntry(
//       new iHookParamName('SA'),
//       new iHookParamValue('DEADBEEF', true)
//     )
//     const hook = createHookPayload(
//       0,
//       'savings',
//       'savings',
//       SetHookFlags.hsfOverride,
//       ['Payment'],
//       [param1.toXrpl(), param2.toXrpl()]
//     )
//     await setHooksV3({
//       client: testContext.client,
//       seed: testContext.alice.seed,
//       hooks: [{ Hook: hook }],
//     } as SetHookParams)

//     // PAYMENT IN
//     const aliceWallet = testContext.alice
//     const bobWallet = testContext.bob
//     const builtTx: Payment = {
//       TransactionType: 'Payment',
//       Account: bobWallet.classicAddress,
//       Destination: aliceWallet.classicAddress,
//       Amount: xrpToDrops(100),
//     }
//     const result = await Application.testHookTx(testContext.client, {
//       wallet: bobWallet,
//       tx: builtTx,
//     })
//     const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
//       testContext.client,
//       result.meta as TransactionMetadata
//     )
//     expect(hookExecutions.executions[1].HookReturnString).toMatch(
//       'Savings: No account set'
//     )
//   })
//   it('parameters: Dest account doesnt exist', async () => {
//     const param1 = new iHookParamEntry(
//       new iHookParamName('SDO'),
//       new iHookParamValue(floatToLEXfl('100') + floatToLEXfl('0.10'), true)
//     )
//     const acct = AccountID.from(testContext.notactive.classicAddress)
//     const param2 = new iHookParamEntry(
//       new iHookParamName('SA'),
//       new iHookParamValue(acct.toHex(), true)
//     )
//     // SET HOOK
//     const hook = createHookPayload(
//       0,
//       'savings',
//       'savings',
//       SetHookFlags.hsfOverride,
//       ['Payment'],
//       [param1.toXrpl(), param2.toXrpl()]
//     )
//     await setHooksV3({
//       client: testContext.client,
//       seed: testContext.alice.seed,
//       hooks: [{ Hook: hook }],
//     } as SetHookParams)

//     // PAYMENT IN
//     const aliceWallet = testContext.alice
//     const bobWallet = testContext.bob
//     const builtTx: Payment = {
//       TransactionType: 'Payment',
//       Account: bobWallet.classicAddress,
//       Destination: aliceWallet.classicAddress,
//       Amount: xrpToDrops(100),
//     }
//     const result = await Application.testHookTx(testContext.client, {
//       wallet: bobWallet,
//       tx: builtTx,
//     })
//     const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
//       testContext.client,
//       result.meta as TransactionMetadata
//     )
//     expect(hookExecutions.executions[1].HookReturnString).toMatch(
//       "Savings: Dest account doesn't exist"
//     )
//   })
//   it('parameters: Threshold not met in', async () => {
//     // SET HOOK
//     const param1 = new iHookParamEntry(
//       new iHookParamName('SDI'),
//       new iHookParamValue(
//         floatToLEXfl(xrpToDrops(100)) + floatToLEXfl('0.10'),
//         true
//       )
//     )
//     const acct = AccountID.from(testContext.carol.classicAddress)
//     const param2 = new iHookParamEntry(
//       new iHookParamName('SA'),
//       new iHookParamValue(acct.toHex(), true)
//     )
//     const hook = createHookPayload(
//       0,
//       'savings',
//       'savings',
//       SetHookFlags.hsfOverride,
//       ['Payment'],
//       [param1.toXrpl(), param2.toXrpl()]
//     )
//     await setHooksV3({
//       client: testContext.client,
//       seed: testContext.alice.seed,
//       hooks: [{ Hook: hook }],
//     } as SetHookParams)

//     // PAYMENT IN
//     const aliceWallet = testContext.alice
//     const bobWallet = testContext.bob
//     const builtTx: Payment = {
//       TransactionType: 'Payment',
//       Account: bobWallet.classicAddress,
//       Destination: aliceWallet.classicAddress,
//       Amount: xrpToDrops('10'),
//     }
//     const result = await Application.testHookTx(testContext.client, {
//       wallet: bobWallet,
//       tx: builtTx,
//     })

//     const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
//       testContext.client,
//       result.meta as TransactionMetadata
//     )
//     expect(hookExecutions.executions[1].HookReturnString).toMatch(
//       'Savings: Threshold not met'
//     )
//   })
//   it('parameters: Threshold not met out', async () => {
//     // SET HOOK
//     const param1 = new iHookParamEntry(
//       new iHookParamName('SDO'),
//       new iHookParamValue(
//         floatToLEXfl(xrpToDrops(100)) + floatToLEXfl('0.10'),
//         true
//       )
//     )
//     const acct = AccountID.from(testContext.carol.classicAddress)
//     const param2 = new iHookParamEntry(
//       new iHookParamName('SA'),
//       new iHookParamValue(acct.toHex(), true)
//     )
//     const hook = createHookPayload(
//       0,
//       'savings',
//       'savings',
//       SetHookFlags.hsfOverride,
//       ['Payment'],
//       [param1.toXrpl(), param2.toXrpl()]
//     )
//     await setHooksV3({
//       client: testContext.client,
//       seed: testContext.alice.seed,
//       hooks: [{ Hook: hook }],
//     } as SetHookParams)

//     // PAYMENT IN
//     const aliceWallet = testContext.alice
//     const bobWallet = testContext.bob
//     const builtTx: Payment = {
//       TransactionType: 'Payment',
//       Account: aliceWallet.classicAddress,
//       Destination: bobWallet.classicAddress,
//       Amount: xrpToDrops('10'),
//     }
//     const result = await Application.testHookTx(testContext.client, {
//       wallet: aliceWallet,
//       tx: builtTx,
//     })

//     const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
//       testContext.client,
//       result.meta as TransactionMetadata
//     )
//     expect(hookExecutions.executions[1].HookReturnString).toMatch(
//       'Savings: Threshold not met'
//     )
//   })
// })

describe('Application.savings - Success Group', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  // it('savings - success SDO', async () => {
  //   // SET HOOK
  //   const param1 = new iHookParamEntry(
  //     new iHookParamName('SDO'),
  //     new iHookParamValue(floatToLEXfl('100') + floatToLEXfl('0.10'), true)
  //   )
  //   const acct = AccountID.from(testContext.carol.classicAddress)
  //   const param2 = new iHookParamEntry(
  //     new iHookParamName('SA'),
  //     new iHookParamValue(acct.toHex(), true)
  //   )
  //   const hook = createHookPayload(
  //     0,
  //     'savings',
  //     'savings',
  //     SetHookFlags.hsfOverride,
  //     ['Payment'],
  //     [param1.toXrpl(), param2.toXrpl()]
  //   )
  //   await setHooksV3({
  //     client: testContext.client,
  //     seed: testContext.alice.seed,
  //     hooks: [{ Hook: hook }],
  //   } as SetHookParams)

  //   // PAYMENT OUT
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const builtTx: Payment = {
  //     TransactionType: 'Payment',
  //     Account: aliceWallet.classicAddress,
  //     Destination: bobWallet.classicAddress,
  //     Amount: xrpToDrops(100),
  //   }
  //   const result = await Application.testHookTx(testContext.client, {
  //     wallet: aliceWallet,
  //     tx: builtTx,
  //   })

  //   const hookEmitted = await ExecutionUtility.getHookEmittedTxsFromMeta(
  //     testContext.client,
  //     result.meta as TransactionMetadata
  //   )
  //   const emittedTx = hookEmitted.txs[0] as Payment
  //   expect(emittedTx.Amount).toEqual('10000110')
  // })

  // it('savings - success SDI', async () => {
  //   // SET HOOK
  //   const param1 = new iHookParamEntry(
  //     new iHookParamName('SDI'),
  //     new iHookParamValue(floatToLEXfl('100') + floatToLEXfl('0.10'), true)
  //   )
  //   const acct = AccountID.from(testContext.carol.classicAddress)
  //   const param2 = new iHookParamEntry(
  //     new iHookParamName('SA'),
  //     new iHookParamValue(acct.toHex(), true)
  //   )
  //   const hook = createHookPayload(
  //     0,
  //     'savings',
  //     'savings',
  //     SetHookFlags.hsfOverride,
  //     ['Payment'],
  //     [param1.toXrpl(), param2.toXrpl()]
  //   )
  //   await setHooksV3({
  //     client: testContext.client,
  //     seed: testContext.alice.seed,
  //     hooks: [{ Hook: hook }],
  //   } as SetHookParams)

  //   // PAYMENT IN
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const builtTx: Payment = {
  //     TransactionType: 'Payment',
  //     Account: bobWallet.classicAddress,
  //     Destination: aliceWallet.classicAddress,
  //     Amount: xrpToDrops(100),
  //   }
  //   const result = await Application.testHookTx(testContext.client, {
  //     wallet: bobWallet,
  //     tx: builtTx,
  //   })

  //   const hookEmitted = await ExecutionUtility.getHookEmittedTxsFromMeta(
  //     testContext.client,
  //     result.meta as TransactionMetadata
  //   )
  //   const emittedTx = hookEmitted.txs[0] as Payment
  //   expect(emittedTx.Amount).toEqual('10000000')
  // })

  // it('savings - success SDI', async () => {
  //   // SET HOOK
  //   const param1 = new iHookParamEntry(
  //     new iHookParamName('SDI'),
  //     new iHookParamValue(floatToLEXfl('100') + floatToLEXfl('0.10'), true)
  //   )
  //   const acct = AccountID.from(testContext.carol.classicAddress)
  //   const param2 = new iHookParamEntry(
  //     new iHookParamName('SA'),
  //     new iHookParamValue(acct.toHex(), true)
  //   )
  //   const hook = createHookPayload(
  //     0,
  //     'savings',
  //     'savings',
  //     SetHookFlags.hsfOverride,
  //     ['Payment'],
  //     [param1.toXrpl(), param2.toXrpl()]
  //   )
  //   await setHooksV3({
  //     client: testContext.client,
  //     seed: testContext.alice.seed,
  //     hooks: [{ Hook: hook }],
  //   } as SetHookParams)

  //   const amount: IssuedCurrencyAmount = {
  //     value: '100',
  //     currency: 'USD',
  //     issuer: testContext.gw.classicAddress,
  //   }

  //   // PAYMENT OUT
  //   const aliceWallet = testContext.alice
  //   const bobWallet = testContext.bob
  //   const builtTx: Payment = {
  //     TransactionType: 'Payment',
  //     Account: aliceWallet.classicAddress,
  //     Destination: bobWallet.classicAddress,
  //     Amount: amount,
  //   }
  //   const result = await Application.testHookTx(testContext.client, {
  //     wallet: aliceWallet,
  //     tx: builtTx,
  //   })

  //   const hookEmitted = await ExecutionUtility.getHookEmittedTxsFromMeta(
  //     testContext.client,
  //     result.meta as TransactionMetadata
  //   )
  //   const emittedTx = hookEmitted.txs[0] as Payment
  //   expect(emittedTx.Amount).toEqual('10000000')
  // })

  it('savings - success STI', async () => {
    // SET HOOK
    const param1 = new iHookParamEntry(
      new iHookParamName('STI'),
      new iHookParamValue(floatToLEXfl('100') + floatToLEXfl('0.10'), true)
    )
    const acct = AccountID.from(testContext.carol.classicAddress)
    const param2 = new iHookParamEntry(
      new iHookParamName('SA'),
      new iHookParamValue(acct.toHex(), true)
    )
    const hook = createHookPayload(
      0,
      'savings',
      'savings',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [param1.toXrpl(), param2.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    const amount: IssuedCurrencyAmount = {
      value: '100',
      currency: 'USD',
      issuer: testContext.gw.classicAddress,
    }

    // PAYMENT IN
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      Amount: amount,
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })

    const hookEmitted = await ExecutionUtility.getHookEmittedTxsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    const emittedTx = hookEmitted.txs[0] as Payment
    expect(emittedTx.Amount).toEqual('10000078')
  })
})
