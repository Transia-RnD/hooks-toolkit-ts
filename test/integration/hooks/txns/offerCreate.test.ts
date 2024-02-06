// xrpl
import { Invoke, SetHookFlags, TransactionMetadata } from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  close,
  trust,
  pay,
} from '../../../../src/libs/xrpl-helpers'
import {
  Xrpld,
  SetHookParams,
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
} from '../../../../dist/npm/src'

describe('offerCreate', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)

    await trust(
      testContext.client,
      testContext.ic.set(100000),
      ...[testContext.hook1]
    )
    await pay(
      testContext.client,
      testContext.ic.set(100),
      testContext.gw,
      ...[testContext.hook1.classicAddress]
    )
    const hook = createHookPayload({
      version: 0,
      createFile: 'txn_offer_create',
      namespace: 'txn_offer_create',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
    })
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

  it('txn offer create hook', async () => {
    // INVOKE IN
    const aliceWallet = testContext.alice
    const hookWallet = testContext.hook1
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      Destination: hookWallet.classicAddress,
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
      'txn_offer_create.c: Tx emitted success.'
    )
    await close(testContext.client)
    // confirm that the offer actually went through
    const accountOffersResponse = await testContext.client.request({
      command: 'account_offers',
      account: testContext.alice.classicAddress,
    })
    expect(accountOffersResponse.result.offers?.length).toEqual(2)
  })
})
