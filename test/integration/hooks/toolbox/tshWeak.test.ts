// xrpl
import {
  OfferCreate,
  AccountSet,
  SetHookFlags,
  xrpToDrops,
  AccountSetAsfFlags,
  OfferCreateFlags,
  // TransactionMetadata,
} from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  IC,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Xrpld,
  SetHookParams,
  createHookPayload,
  setHooksV3,
  // clearHooksV3,
  // ExecutionUtility,
} from '../../../../dist/npm/src'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'

describe('tshWeak', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  // beforeEach(async () => {})

  it('invoke on io - incoming', async () => {
    const USD = IC.gw('USD', testContext.gw.classicAddress)

    USD.set(200)
    const takerGets: IssuedCurrencyAmount = {
      value: String(USD.value),
      currency: USD.currency as string,
      issuer: USD.issuer as string,
    }
    const sellTx: OfferCreate = {
      TransactionType: 'OfferCreate',
      Account: testContext.alice.classicAddress,
      TakerGets: takerGets,
      TakerPays: xrpToDrops(String(0.7 * (USD.value as number))),
      Flags: OfferCreateFlags.tfSell,
    }
    await Xrpld.submit(testContext.client, {
      wallet: testContext.alice,
      tx: sellTx,
    })

    const asTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: testContext.gw.classicAddress,
      SetFlag: AccountSetAsfFlags.asfTshCollect,
    }
    await Xrpld.submit(testContext.client, {
      wallet: testContext.gw,
      tx: asTx,
    })

    // await clearHooksV3({
    //   client: testContext.client,
    //   seed: testContext.gw.seed,
    // } as SetHookParams)

    // await clearHooksV3({
    //   client: testContext.client,
    //   seed: testContext.alice.seed,
    // } as SetHookParams)

    const hook = createHookPayload(
      0,
      'tsh_weak',
      'tsh_weak',
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
    await Xrpld.submit(testContext.client, {
      wallet: testContext.bob,
      tx: buyTx,
    })
    // const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
    //   testContext.client,
    //   result.meta as TransactionMetadata
    // )
    // console.log(hookExecutions.executions[0].HookReturnString)
    // expect(hookExecutions.executions[0].HookReturnString).toEqual(
    //   'tsh_strong: Finished.'
    // )
  })
})
