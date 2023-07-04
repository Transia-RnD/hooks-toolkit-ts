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
} from '../../../../dist/npm/src'

describe('common_memo', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  // beforeEach(async () => {})

  it('common memo hook', async () => {
    const hook = createHookPayload(
      0,
      'common_memo',
      'common_memo',
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
    const Memos = [
      {
        Memo: {
          MemoData: '746573746D656D6F',
          MemoFormat: '756E7369676E65642F7369676E6174757265',
        },
      },
    ]
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      Memos: Memos,
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toMatch(
      'common_memo: Finished.'
    )
  })
})
