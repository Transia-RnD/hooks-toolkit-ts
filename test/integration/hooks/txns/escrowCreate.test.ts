// xrpl
import { Invoke, SetHookFlags, TransactionMetadata } from '@transia/xrpl'
import {
  // Testing
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  close,
  // Main
  Xrpld,
  SetHookParams,
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  // clearAllHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  // Binary Model
  uint32ToHex,
  // Utils
  xrpAddressToHex,
  floatToLEXfl,
} from '../../../../dist/npm/src'

describe('claimReward', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const hook = createHookPayload({
      version: 0,
      createFile: 'txn_escrow_create',
      namespace: 'txn_escrow_create',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
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
    //   seed: testContext.alice.seed,
    // } as SetHookParams)
    await teardownClient(testContext)
  })

  it('txn claim reward', async () => {
    const aliceWallet = testContext.alice
    const hookWallet = testContext.hook1

    const tx1param1 = new iHookParamEntry(
      new iHookParamName('DST'),
      new iHookParamValue(xrpAddressToHex(testContext.bob.classicAddress), true)
    )
    const tx1param2 = new iHookParamEntry(
      new iHookParamName('AMT'),
      new iHookParamValue(floatToLEXfl('10'), true)
    )
    const CLOSE_TIME: number = (
      await testContext.client.request({
        command: 'ledger',
        ledger_index: 'validated',
      })
    ).result.ledger.close_time
    const tx1param3 = new iHookParamEntry(
      new iHookParamName('CA'),
      new iHookParamValue(uint32ToHex(CLOSE_TIME + 20), true)
    )
    const tx1param4 = new iHookParamEntry(
      new iHookParamName('FA'),
      new iHookParamValue(uint32ToHex(CLOSE_TIME + 10), true)
    )
    // INVOKE IN
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      Destination: hookWallet.classicAddress,
      HookParameters: [
        tx1param1.toXrpl(),
        tx1param2.toXrpl(),
        tx1param3.toXrpl(),
        tx1param4.toXrpl(),
      ],
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
      'txn_escrow_create.c: Tx emitted success.'
    )
    await close(testContext.client)
  })
})
