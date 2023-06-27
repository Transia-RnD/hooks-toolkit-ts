// xrpl
import { Invoke, SetHookFlags, TransactionMetadata } from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Application,
  SetHookParams,
  StateUtility,
  createHookPayload,
  setHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  ExecutionUtility,
} from '../../../../dist/npm/src'
import {
  TestModel,
  decodeModel,
} from '../../../../dist/npm/src/libs/binary-models'

describe('keyletHookStateDir', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  // beforeEach(async () => {})

  it('invoke on io - incoming', async () => {
    const hook = createHookPayload(
      0,
      'keylet_hook_state_dir',
      'keylet_hook_state_dir',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )

    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE IN
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    const testModel = new TestModel(BigInt(1685216402734), 'hello1')

    const param1 = new iHookParamEntry(
      new iHookParamName('TEST'),
      new iHookParamValue(testModel.encode(), true)
    )
    console.log(testModel.encode())

    console.log(
      decodeModel(
        '000001885EB99D590668656C6C6F310000000000000000000000000000',
        TestModel
      )
    )

    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      HookParameters: [param1.toXrpl()],
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    console.log(hookExecutions.executions[0].HookReturnString)
    const hookStateDir = await StateUtility.getHookStateDir(
      testContext.client,
      testContext.alice.classicAddress,
      'keylet_hook_state_dir'
    )
    console.log(hookStateDir)
  })
})
