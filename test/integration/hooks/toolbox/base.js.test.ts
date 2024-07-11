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
} from '../../../../dist/npm/src'

describe('base', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const hook = createHookPayload({
      version: 1,
      createFile: 'base',
      namespace: 'base',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      fee: '100',
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
    // INVOKE IN
    // const aliceWallet = testContext.alice
    const hookWallet = testContext.hook1
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: hookWallet.classicAddress,
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: hookWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toMatch(
      'base: Finished.'
    )
  })
})
