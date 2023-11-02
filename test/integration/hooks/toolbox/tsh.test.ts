// xrpl
import {
  Invoke,
  AccountSet,
  SetHookFlags,
  AccountSetAsfFlags,
  TransactionMetadata,
  OfferCreate,
  xrpToDrops,
} from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  close,
  IC,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Xrpld,
  SetHookParams,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
  ExecutionUtility,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  floatToLEXfl,
} from '../../../../dist/npm/src'
import { AccountID, Currency } from '@transia/ripple-binary-codec/dist/types'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'

describe('tsh', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => {
    await teardownClient(testContext)
  })

  it('tsh emitted txn', async () => {
    // TSH Issuer
    const asTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: testContext.gw.classicAddress,
      SetFlag: AccountSetAsfFlags.asfTshCollect,
    }
    await Xrpld.submit(testContext.client, {
      wallet: testContext.gw,
      tx: asTx,
    })

    const hook = createHookPayload(
      0,
      'tsh',
      'tsh',
      SetHookFlags.hsfCollect + SetHookFlags.hsfOverride,
      ['TrustSet']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.gw.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // TSH Alice
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('A'),
      new iHookParamValue(floatToLEXfl('10'), true)
    )
    const tx1param2 = new iHookParamEntry(
      new iHookParamName('I'),
      new iHookParamValue(
        AccountID.from(testContext.gw.classicAddress).toHex(),
        true
      )
    )
    const tx1param3 = new iHookParamEntry(
      new iHookParamName('C'),
      new iHookParamValue(Currency.from('ABC').toHex(), true)
    )
    const hook2 = createHookPayload(
      0,
      'txn_trust_set',
      'txn_trust_set',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [tx1param1.toXrpl(), tx1param2.toXrpl(), tx1param3.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook2 }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    // INVOKE IN
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toMatch(
      'txn_trust_set.c: Tx emitted success.'
    )
    console.log(hookExecutions.executions[0].HookReturnString)
    close(testContext.client)

    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.gw.seed,
    } as SetHookParams)

    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
    } as SetHookParams)

    // expect(hookExecutions.executions[0].HookReturnString).toEqual(
    //   'tsh.c: Finished.'
    // )
  })

  it('tsh non emitted txn', async () => {
    const USD = IC.gw('USD', testContext.gw.classicAddress)

    const asTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: testContext.gw.classicAddress,
      SetFlag: AccountSetAsfFlags.asfTshCollect,
    }
    await Xrpld.submit(testContext.client, {
      wallet: testContext.gw,
      tx: asTx,
    })

    const hook = createHookPayload(
      0,
      'tsh',
      'tsh',
      SetHookFlags.hsfCollect + SetHookFlags.hsfOverride,
      ['Invoke', 'OfferCreate']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.gw.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    USD.set(1)
    const takerPays: IssuedCurrencyAmount = {
      value: String(USD.value),
      currency: USD.currency as string,
      issuer: USD.issuer as string,
    }
    const buyTx: OfferCreate = {
      TransactionType: 'OfferCreate',
      Account: testContext.bob.classicAddress,
      TakerGets: xrpToDrops(String(0.7 * (USD.value as number))),
      TakerPays: takerPays,
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: testContext.bob,
      tx: buyTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    console.log(hookExecutions.executions[0].HookReturnString)
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'tsh.c: Finished.'
    )

    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.gw.seed,
    } as SetHookParams)

    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
    } as SetHookParams)
  })
})
