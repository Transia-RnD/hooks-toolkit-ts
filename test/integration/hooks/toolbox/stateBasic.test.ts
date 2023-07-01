// xrpl
import { Invoke, SetHookFlags } from '@transia/xrpl'
import { AccountID, UInt64 } from '@transia/ripple-binary-codec/dist/types'
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
  padHexString,
  StateUtility,
  flipHex,
} from '../../../../dist/npm/src'

// StateBasic: ACCEPT: success

describe('stateBasic', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('state basic - success', async () => {
    const hook = createHookPayload(
      0,
      'state_basic',
      'state_basic',
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
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
    }
    await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookState = await StateUtility.getHookState(
      testContext.client,
      testContext.alice.classicAddress,
      padHexString(aliceAccHex),
      'state_basic'
    )
    const stateCount = Number(
      UInt64.from(flipHex(hookState.HookStateData)).valueOf()
    )
    expect(stateCount).toBeGreaterThan(0)
  })
})
