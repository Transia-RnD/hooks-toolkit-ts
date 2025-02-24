// xrpl
import { Invoke, Payment, SetHookFlags, xrpToDrops } from '@transia/xrpl'
// src
import {
  // Testing
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  // Main
  Xrpld,
  SetHookParams,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
} from '../../../../dist/npm/src'

// HookOnTT: ACCEPT: success
// HookOnTT: ROLLBACK: invalid

describe('hookOnTT', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => {
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
    } as SetHookParams)
    await teardownClient(testContext)
  })

  it('invoke on tt - success', async () => {
    const hook = createHookPayload({
      version: 0,
      createFile: 'hook_on_tt',
      namespace: 'hook_on_tt',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE IN
    const hookWallet = testContext.hook1
    const bobWallet = testContext.bob
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: hookWallet.classicAddress,
    }
    await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
  })

  it('invoke on tt - invalid', async () => {
    const hook = createHookPayload({
      version: 0,
      createFile: 'hook_on_tt',
      namespace: 'hook_on_tt',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke', 'Payment'],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
    try {
      // PAYMENT IN
      const hookWallet = testContext.hook1
      const bobWallet = testContext.bob
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: bobWallet.classicAddress,
        Destination: hookWallet.classicAddress,
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
          'f: hook_on_tt: HookOn field is incorrectly set.'
        )
      }
    }
  })
})
