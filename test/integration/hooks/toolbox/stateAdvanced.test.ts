// xrpl
import { Invoke, SetHookFlags } from '@transia/xrpl'
import { AccountID } from '@transia/ripple-binary-codec/dist/types'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Xrpld,
  SetHookParams,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
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
    const hook = createHookPayload({
      version: 0,
      createFile: 'state_advanced',
      namespace: 'state_advanced',
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

  it('state advanced - success', async () => {
    // INVOKE OUT
    const hookWallet = testContext.hook1
    const hookAccHex = AccountID.from(hookWallet.classicAddress).toHex()

    const testModel = new TestModel(BigInt(1685216402734), 'hello')

    const param1 = new iHookParamEntry(
      new iHookParamName('TEST'),
      new iHookParamValue(testModel.encode(), true)
    )
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: hookWallet.classicAddress,
      HookParameters: [param1.toXrpl()],
    }
    await Xrpld.submit(testContext.client, {
      wallet: hookWallet,
      tx: builtTx,
    })

    const hookState = await StateUtility.getHookState(
      testContext.client,
      testContext.alice.classicAddress,
      padHexString(hookAccHex),
      'state_advanced'
    )
    const model = decodeModel(hookState.HookStateData, TestModel)
    expect(model.message).toBe('hello')
    expect(model.updatedTime).toBe(1685216402734n)
  })
})
