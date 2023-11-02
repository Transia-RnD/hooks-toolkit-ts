// xrpl
import { Invoke, SetHookFlags, TransactionMetadata } from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  close,
} from '../../../../src/libs/xrpl-helpers'
import {
  Xrpld,
  SetHookParams,
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  floatToLEXfl,
} from '../../../../dist/npm/src'
import { AccountID, Currency } from '@transia/ripple-binary-codec/dist/types'

describe('trustSet', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('A'),
      new iHookParamValue(floatToLEXfl('10'), true)
    )
    const tx1param2 = new iHookParamEntry(
      new iHookParamName('I'),
      new iHookParamValue(
        AccountID.from(testContext.gw.classicAddress).toHex(),
        true
      )
    )
    const tx1param3 = new iHookParamEntry(
      new iHookParamName('C'),
      new iHookParamValue(Currency.from('ABC').toHex(), true)
    )
    const hook = createHookPayload(
      0,
      'txn_trust_set',
      'txn_trust_set',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [tx1param1.toXrpl(), tx1param2.toXrpl(), tx1param3.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
  })
  afterAll(async () => {
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
    } as SetHookParams)
    await teardownClient(testContext)
  })

  it('txn trust hook', async () => {
    const aliceWallet = testContext.alice
    // INVOKE IN
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toMatch(
      'txn_trust_set.c: Tx emitted success.'
    )
    await close(testContext.client)
  })
})
