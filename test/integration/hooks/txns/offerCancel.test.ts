// xrpl
import {
  OfferCreate,
  Invoke,
  SetHookFlags,
  TransactionMetadata,
} from '@transia/xrpl'
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
} from '../../../../dist/npm/src'

describe('offerCancel', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const hook = createHookPayload(
      0,
      'txn_offer_cancel',
      'txn_offer_cancel',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
  })
  afterAll(async () => {
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
    } as SetHookParams)
    await teardownClient(testContext)
  })

  it('txn offer cancel hook', async () => {
    // set up an offer
    const setupTx: OfferCreate = {
      TransactionType: 'OfferCreate',
      Account: testContext.hook1.classicAddress,
      TakerGets: '13100000',
      TakerPays: {
        currency: 'USD',
        issuer: testContext.gw.classicAddress,
        value: '100',
      },
    }

    await Xrpld.submit(testContext.client, {
      tx: setupTx,
      wallet: testContext.hook1,
    })
    await close(testContext.client)

    const accountOffersResponse = await testContext.client.request({
      command: 'account_offers',
      account: testContext.hook1.classicAddress,
    })
    expect(accountOffersResponse.result.offers?.length).toEqual(1)

    const seq = accountOffersResponse.result.offers?.[0].seq || 0

    // INVOKE IN
    const hookWallet = testContext.hook1
    const aliceWallet = testContext.alice
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('OS'),
      new iHookParamValue(seq.toString(16).toUpperCase(), true)
    )
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      Destination: hookWallet.classicAddress,
      HookParameters: [tx1param1.toXrpl()],
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
      'txn_offer_cancel.c: Tx emitted success.'
    )
    await close(testContext.client)
    // confirm that the offer actually went through
    const accountOffersResponse2 = await testContext.client.request({
      command: 'account_offers',
      account: testContext.hook1.classicAddress,
    })
    expect(accountOffersResponse2.result.offers?.length).toEqual(0)
  })
})
