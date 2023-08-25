// xrpl
import { Invoke, SetHookFlags } from '@transia/xrpl'
import { AccountID } from '@transia/ripple-binary-codec/dist/types'
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
  createHookPayload,
  setHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  padHexString,
  StateUtility,
} from '../../../../dist/npm/src'
import {
  TestModel,
  decodeModel,
} from '../../../../dist/npm/src/libs/binary-models'

// StateAdvanced: ACCEPT: success

describe('StateAdvanced', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  afterEach(
    async () =>
      await teardownHook(testContext, [testContext.alice, testContext.bob])
  )

  it('state advanced - success', async () => {
    const hook = createHookPayload(
      0,
      'state_advanced',
      'state_advanced',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )

    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE OUT
    const aliceWallet = testContext.alice
    const aliceAccHex = AccountID.from(aliceWallet.classicAddress).toHex()
    console.log(aliceAccHex)

    const testModel = new TestModel(BigInt(1685216402734), 'hello')

    const param1 = new iHookParamEntry(
      new iHookParamName('TEST'),
      new iHookParamValue(testModel.encode(), true)
    )
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [param1.toXrpl()],
    }
    await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookState = await StateUtility.getHookState(
      testContext.client,
      testContext.alice.classicAddress,
      padHexString(aliceAccHex),
      'state_advanced'
    )
    const model = decodeModel(hookState.HookStateData, TestModel)
    expect(model.message).toBe('hello')
    expect(model.updatedTime).toBe(1685216402734n)
  })
})
