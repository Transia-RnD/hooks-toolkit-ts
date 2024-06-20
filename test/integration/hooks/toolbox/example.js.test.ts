// xrpl
import { Invoke, SetHookFlags, TransactionMetadata } from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'
import {
  Xrpld,
  SetHookParams,
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  // clearAllHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  readJSHookBinaryHexFromNS,
} from '../../../../dist/npm/src'

describe('example', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const param1 = new iHookParamEntry(
      new iHookParamName('CAFE', true),
      new iHookParamValue('DEADBEEF', true)
    )
    const hook = createHookPayload({
      version: 1,
      createFile: 'example',
      namespace: 'example',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      hookParams: [param1.toXrpl()],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
  })
  afterAll(async () => {
    // await clearAllHooksV3({
    //   client: testContext.client,
    //   seed: testContext.hook1.seed,
    // } as SetHookParams)
    await teardownClient(testContext)
  })

  it('basic hook', async () => {
    const data = readJSHookBinaryHexFromNS('example')
    console.log(data)

    // INVOKE IN
    const aliceWallet = testContext.alice
    const hookWallet = testContext.hook1

    const param1 = new iHookParamEntry(
      new iHookParamName('CAFE', true),
      new iHookParamValue('DEADBEEF', true)
    )
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      Destination: hookWallet.classicAddress,
      HookParameters: [param1.toXrpl()],
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    console.log(hookExecutions)
  })
})
