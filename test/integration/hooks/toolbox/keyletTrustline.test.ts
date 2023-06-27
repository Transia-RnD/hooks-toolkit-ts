// xrpl
import { Invoke, SetHookFlags } from '@transia/xrpl'
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
} from '../../../../dist/npm/src'

describe('keyletTrustline', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  // beforeEach(async () => {})

  it('invoke on io - incoming', async () => {
    const hook = createHookPayload(
      0,
      'keylet_trustline',
      'keylet_trustline',
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
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
    // const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
    //   testContext.client,
    //   result.meta as TransactionMetadata
    // )
    // console.log(hookExecutions.executions[0].HookReturnString)
    const hookStateDir = await StateUtility.getHookStateDir(
      testContext.client,
      testContext.alice.classicAddress,
      'keylet_owner_dir'
    )
    console.log(hookStateDir)
  })
})
