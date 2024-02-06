// xrpl
import {
  Invoke,
  SetHookFlags,
  TransactionMetadata,
  convertStringToHex,
} from '@transia/xrpl'
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
} from '../../../../dist/npm/src'
import {
  uint64ToHex,
  xrpAddressToHex,
} from '../../../../dist/npm/src/libs/binary-models'

describe('remitMint', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const hook = createHookPayload({
      version: 0,
      createFile: 'txn_remit_mint',
      namespace: 'txn_remit_mint',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
    })
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

  it('txn remit mint', async () => {
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    // INVOKE IN
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('URIL'),
      new iHookParamValue(uint64ToHex(BigInt(8)), true)
    )
    const tx1param2 = new iHookParamEntry(
      new iHookParamName('URI'),
      new iHookParamValue(convertStringToHex('ipfs://2'), true)
    )
    const tx1param3 = new iHookParamEntry(
      new iHookParamName('DST'),
      new iHookParamValue(xrpAddressToHex(bobWallet.classicAddress), true)
    )
    const builtTx1: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [
        tx1param1.toXrpl(),
        tx1param2.toXrpl(),
        tx1param3.toXrpl(),
      ],
    }
    console.log(JSON.stringify(builtTx1))

    const result1 = await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx1,
    })
    console.log(result1)

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result1.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toMatch(
      'txn_remit_mint.c: Tx emitted success.'
    )
    await close(testContext.client)
  })
})
