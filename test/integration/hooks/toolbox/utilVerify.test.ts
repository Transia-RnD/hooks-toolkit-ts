// xrpl
import { Invoke, SetHookFlags, TransactionMetadata } from '@transia/xrpl'
import { AccountID } from '@transia/ripple-binary-codec/dist/types'
import { sign } from '@transia/ripple-keypairs'
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
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
} from '../../../../dist/npm/src'

// UtilVerify: ACCEPT: invalid signature
// UtilVerify: ACCEPT: valid signature

describe('utilVerify', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => {
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
    } as SetHookParams)
    await teardownClient(testContext)
  })

  it('util verify - invalid signature', async () => {
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const carolWallet = testContext.carol
    const bobAccHex = AccountID.from(bobWallet.classicAddress).toHex()
    const carolAccHex = AccountID.from(carolWallet.classicAddress).toHex()
    const hookParam1 = new iHookParamEntry(
      new iHookParamName('VM'),
      new iHookParamValue(bobAccHex, true)
    )
    const hookParam2 = new iHookParamEntry(
      new iHookParamName('VP'),
      new iHookParamValue(aliceWallet.publicKey, true)
    )
    const hook = createHookPayload(
      0,
      'util_verify',
      'util_verify',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [hookParam1.toXrpl(), hookParam2.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE IN
    const signature = sign(carolAccHex, aliceWallet.privateKey)
    const txParam1 = new iHookParamEntry(
      new iHookParamName('VS'),
      new iHookParamValue(signature, true)
    )
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      HookParameters: [txParam1.toXrpl()],
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'util_verify: Invalid signature'
    )
  })

  it('util verify - valid signature', async () => {
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const bobAccHex = AccountID.from(bobWallet.classicAddress).toHex()
    const hookParam1 = new iHookParamEntry(
      new iHookParamName('VM'),
      new iHookParamValue(bobAccHex, true)
    )
    const hookParam2 = new iHookParamEntry(
      new iHookParamName('VP'),
      new iHookParamValue(aliceWallet.publicKey, true)
    )
    const hook = createHookPayload(
      0,
      'util_verify',
      'util_verify',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [hookParam1.toXrpl(), hookParam2.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE IN
    const signature = sign(bobAccHex, aliceWallet.privateKey)

    const txParam1 = new iHookParamEntry(
      new iHookParamName('VS'),
      new iHookParamValue(signature, true)
    )
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      HookParameters: [txParam1.toXrpl()],
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toEqual(
      'util_verify: Valid signature'
    )
  })
})
