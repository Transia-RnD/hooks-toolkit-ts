// xrpl
import {
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
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
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
} from '../../../../dist/npm/src'

// FilterOnXrp: ACCEPT: success
// FilterOnXrp: ROLLBACK: failure

describe('filterOnXrp', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    console.log(testContext.client.isConnected())
  })
  afterAll(async () => teardownClient(testContext))

  it('filter on xrp - success', async () => {
    const hook = createHookPayload(
      0,
      'filter_on_xrp',
      'filter_on_xrp',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // PAYMENT IN
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      Amount: xrpToDrops(1),
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toMatch(
      'filter_on_xrp: Finished'
    )
  })

  it('filter on xrp - failure', async () => {
    const hook = createHookPayload(
      0,
      'filter_on_xrp',
      'filter_on_xrp',
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
      const amount: IssuedCurrencyAmount = {
        value: '10',
        currency: 'USD',
        issuer: testContext.gw.classicAddress,
      }
      const aliceWallet = testContext.alice
      const bobWallet = testContext.bob
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: bobWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        Amount: amount,
      }
      await Application.testHookTx(testContext.client, {
        wallet: bobWallet,
        tx: builtTx,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          'filter_on_xrp: Ignoring non XRP Transaction'
        )
      }
    }
  })
})
