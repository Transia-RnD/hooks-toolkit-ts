// xrpl
import {
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
import { AccountID, Amount } from '@transia/ripple-binary-codec/dist/types'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  teardownHook,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Xrpld,
  SetHookParams,
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
} from '../../../../dist/npm/src'

// UtilVerify: ROLLBACK: xrp hashes dont match
// UtilVerify: ACCEPT: xrp hashes match
// UtilVerify: ROLLBACK: hashes token dont match
// UtilVerify: ACCEPT: hashes token match

describe('utilSha512', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  afterEach(
    async () =>
      await teardownHook(testContext, [testContext.alice, testContext.bob])
  )

  it('util sha512 - xrp hashes dont match', async () => {
    const hook = createHookPayload(
      0,
      'util_sha512',
      'util_sha512',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      // PAYMENT OUT
      const bobAcct = AccountID.from(testContext.bob.classicAddress)
      const param1 = new iHookParamEntry(
        new iHookParamName('HDE'),
        new iHookParamValue(bobAcct.toHex(), true)
      )
      const param2 = new iHookParamEntry(
        new iHookParamName('HAM'),
        new iHookParamValue(Amount.from(xrpToDrops(10)).toHex(), true)
      )
      const aliceWallet = testContext.alice
      const bobWallet = testContext.bob
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: aliceWallet.classicAddress,
        Destination: bobWallet.classicAddress,
        Amount: xrpToDrops(11),
        HookParameters: [param1.toXrpl(), param2.toXrpl()],
      }
      await Xrpld.submit(testContext.client, {
        wallet: aliceWallet,
        tx: builtTx,
      })
    } catch (error: any) {
      expect(error.message).toEqual('util_sha512: Hashes do not match')
    }
  })

  it('util sha512 - xrp hashes match', async () => {
    const hook = createHookPayload(
      0,
      'util_sha512',
      'util_sha512',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // PAYMENT OUT
    const bobAcct = AccountID.from(testContext.bob.classicAddress)
    const param1 = new iHookParamEntry(
      new iHookParamName('HDE'),
      new iHookParamValue(bobAcct.toHex(), true)
    )
    const param2 = new iHookParamEntry(
      new iHookParamName('HAM'),
      new iHookParamValue(Amount.from(xrpToDrops(10)).toHex(), true)
    )
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: bobWallet.classicAddress,
      Amount: xrpToDrops(10),
      HookParameters: [param1.toXrpl(), param2.toXrpl()],
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'util_sha512: Hashes match'
    )
  })

  it('util sha512 - token hashes dont match', async () => {
    const hook = createHookPayload(
      0,
      'util_sha512',
      'util_sha512',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      // PAYMENT OUT
      const bobAcct = AccountID.from(testContext.bob.classicAddress)
      const param1 = new iHookParamEntry(
        new iHookParamName('HDE'),
        new iHookParamValue(bobAcct.toHex(), true)
      )
      const param2 = new iHookParamEntry(
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
      const amount: IssuedCurrencyAmount = {
        value: '11',
        currency: 'USD',
        issuer: testContext.gw.classicAddress,
      }
      const aliceWallet = testContext.alice
      const bobWallet = testContext.bob
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: aliceWallet.classicAddress,
        Destination: bobWallet.classicAddress,
        Amount: amount,
        HookParameters: [param1.toXrpl(), param2.toXrpl()],
      }
      await Xrpld.submit(testContext.client, {
        wallet: aliceWallet,
        tx: builtTx,
      })
    } catch (error: any) {
      expect(error.message).toEqual('util_sha512: Hashes do not match')
    }
  })

  it('util sha512 - token hashes match', async () => {
    const hook = createHookPayload(
      0,
      'util_sha512',
      'util_sha512',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // PAYMENT OUT
    const bobAcct = AccountID.from(testContext.bob.classicAddress)
    const param1 = new iHookParamEntry(
      new iHookParamName('HDE'),
      new iHookParamValue(bobAcct.toHex(), true)
    )

    const param2 = new iHookParamEntry(
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
    const amount: IssuedCurrencyAmount = {
      value: '10',
      currency: 'USD',
      issuer: testContext.gw.classicAddress,
    }
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: bobWallet.classicAddress,
      Amount: amount,
      HookParameters: [param1.toXrpl(), param2.toXrpl()],
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'util_sha512: Hashes match'
    )
  })
})
