// xrpl
import {
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
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
  floatToLEXfl,
} from '../../../../dist/npm/src'

// HookOnTT: ACCEPT: success

describe('paramBasic', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  afterEach(
    async () =>
      await teardownHook(testContext, [testContext.alice, testContext.bob])
  )

  it('tx param basic - success', async () => {
    const hook = createHookPayload(
      0,
      'param_basic',
      'param_basic',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // PAYMENT IN
    const param1 = new iHookParamEntry(
      new iHookParamName('TEST'),
      new iHookParamValue(floatToLEXfl('10'), true)
    )
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      Amount: xrpToDrops(10),
      HookParameters: [param1.toXrpl()],
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual('')
  })
})
