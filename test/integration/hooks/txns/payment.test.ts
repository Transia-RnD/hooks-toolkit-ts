// xrpl
import { Payment, SetHookFlags, TransactionMetadata } from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  close,
} from '../../../../src/libs/xrpl-helpers'
import {
  Xrpld,
  SetHookParams,
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  floatToLEXfl,
} from '../../../../dist/npm/src'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
import { AccountID } from '@transia/ripple-binary-codec/dist/types'
// import { AccountID, Currency } from '@transia/ripple-binary-codec/dist/types'

describe('payment - xrp', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('AMT'),
      new iHookParamValue(floatToLEXfl('1'), true)
    )
    const tx1param2 = new iHookParamEntry(
      new iHookParamName('TO'),
      new iHookParamValue(
        AccountID.from(testContext.bob.classicAddress).toHex(),
        true
      )
    )
    const hook = createHookPayload(
      0,
      'txn_payment',
      'txn_payment',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [tx1param1.toXrpl(), tx1param2.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
  })
  afterAll(async () => {
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
    } as SetHookParams)
    await teardownClient(testContext)
  })

  it('txn payment hook', async () => {
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    // PAYMENT IN
    const amount: IssuedCurrencyAmount = {
      value: '1',
      currency: 'USD',
      issuer: testContext.gw.classicAddress,
    }
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      Amount: amount,
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toMatch(
      'txn_payment.c: Tx emitted success.'
    )
    await close(testContext.client)
  })
})

// describe('payment - token', () => {
//   let testContext: XrplIntegrationTestContext

//   beforeAll(async () => {
//     testContext = await setupClient(serverUrl)
//     const tx1param1 = new iHookParamEntry(
//       new iHookParamName('AMT'),
//       new iHookParamValue(
//         floatToLEXfl('1') +
//           Currency.from('USD').toHex() +
//           AccountID.from(testContext.gw.classicAddress).toHex(),
//         true
//       )
//     )
//     const tx1param2 = new iHookParamEntry(
//       new iHookParamName('TO'),
//       new iHookParamValue(
//         AccountID.from(testContext.bob.classicAddress).toHex(),
//         true
//       )
//     )

//     const hook = createHookPayload(
//       0,
//       'txn_payment',
//       'txn_payment',
//       SetHookFlags.hsfOverride,
//       ['Payment'],
//       [tx1param1.toXrpl(), tx1param2.toXrpl()]
//     )
//     await setHooksV3({
//       client: testContext.client,
//       seed: testContext.alice.seed,
//       hooks: [{ Hook: hook }],
//     } as SetHookParams)
//   })
//   afterAll(async () => {
//     await clearAllHooksV3({
//       client: testContext.client,
//       seed: testContext.alice.seed,
//     } as SetHookParams)
//     await teardownClient(testContext)
//   })

//   it('txn payment hook', async () => {
//     const aliceWallet = testContext.alice
//     const bobWallet = testContext.bob
//     // PAYMENT IN
//     const amount: IssuedCurrencyAmount = {
//       value: '1',
//       currency: 'USD',
//       issuer: testContext.gw.classicAddress,
//     }
//     const builtTx: Payment = {
//       TransactionType: 'Payment',
//       Account: bobWallet.classicAddress,
//       Destination: aliceWallet.classicAddress,
//       Amount: amount,
//     }
//     const result = await Xrpld.submit(testContext.client, {
//       wallet: bobWallet,
//       tx: builtTx,
//     })
//     const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
//       testContext.client,
//       result.meta as TransactionMetadata
//     )
//     expect(hookExecutions.executions[0].HookReturnString).toMatch(
//       'txn_payment.c: Tx emitted success.'
//     )
//     await close(testContext.client)
//   })
// })
