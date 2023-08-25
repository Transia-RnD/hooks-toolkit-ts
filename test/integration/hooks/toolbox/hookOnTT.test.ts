// xrpl
import { Invoke, Payment, SetHookFlags, xrpToDrops } from '@transia/xrpl'
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
} from '../../../../dist/npm/src'

// HookOnTT: ACCEPT: success
// HookOnTT: ROLLBACK: invalid

describe('hookOnTT', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  afterEach(
    async () =>
      await teardownHook(testContext, [testContext.alice, testContext.bob])
  )

  it('invoke on tt - success', async () => {
    const hook = createHookPayload(
      0,
      'hook_on_tt',
      'hook_on_tt',
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
    await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })
  })

  it('invoke on tt - invalid', async () => {
    const hook = createHookPayload(
      0,
      'hook_on_tt',
      'hook_on_tt',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
    try {
      // PAYMENT IN
      const aliceWallet = testContext.alice
      const bobWallet = testContext.bob
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: bobWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        Amount: xrpToDrops(1),
      }
      await Xrpld.submit(testContext.client, {
        wallet: bobWallet,
        tx: builtTx,
      })
      throw Error('invalid')
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          'hook_on_tt: HookOn field is incorrectly set.'
        )
      }
    }
  })
})
