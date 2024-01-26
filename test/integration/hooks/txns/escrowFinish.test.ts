// xrpl
import {
  Invoke,
  SetHookFlags,
  TransactionMetadata,
  EscrowCreate,
  xrpToDrops,
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
import { AccountID } from '@transia/ripple-binary-codec/dist/types'

describe('escrowFinish', () => {
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

  it('txn escrow finish id', async () => {
    // set up hook
    const hook = createHookPayload({
      version: 0,
      createFile: 'txn_escrow_finish_id',
      namespace: 'txn_escrow_finish_id',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // set up an escrow
    const CLOSE_TIME: number = (
      await testContext.client.request({
        command: 'ledger',
        ledger_index: 'validated',
      })
    ).result.ledger.close_time

    const setupTx: EscrowCreate = {
      TransactionType: 'EscrowCreate',
      Account: testContext.hook1.classicAddress,
      Destination: testContext.alice.classicAddress,
      Amount: xrpToDrops(1),
      FinishAfter: CLOSE_TIME + 1,
      CancelAfter: CLOSE_TIME + 100,
    }

    await Xrpld.submit(testContext.client, {
      tx: setupTx,
      wallet: testContext.hook1,
    })
    await close(testContext.client)

    const accountObjectsResponse = await testContext.client.request({
      command: 'account_objects',
      account: testContext.hook1.classicAddress,
      type: 'escrow',
    })
    // expect(accountObjectsResponse.result.account_objects?.length).toEqual(1)

    // const seq = accountObjectsResponse.result.offers?.[0].seq || 0
    const escrowId = accountObjectsResponse.result.account_objects?.[0]
      .index as string

    // INVOKE IN
    const hookWallet = testContext.hook1
    const aliceWallet = testContext.alice
    const hookAcctHex = AccountID.from(hookWallet.classicAddress).toHex()
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('OA'),
      new iHookParamValue(hookAcctHex, true)
    )
    const tx1param2 = new iHookParamEntry(
      new iHookParamName('ID'),
      new iHookParamValue(escrowId, true)
    )
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      Destination: hookWallet.classicAddress,
      HookParameters: [tx1param1.toXrpl(), tx1param2.toXrpl()],
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
      'txn_escrow_finish_id.c: Tx emitted success.'
    )
    await close(testContext.client)
    // confirm that the offer actually went through
    const accountObjectsResponse2 = await testContext.client.request({
      command: 'account_objects',
      account: testContext.hook1.classicAddress,
      type: 'escrow',
    })

    expect(accountObjectsResponse2.result.account_objects?.length).toEqual(0)
  })

  it('txn escrow finish seq', async () => {
    // set up hook
    const hook = createHookPayload({
      version: 0,
      createFile: 'txn_escrow_finish_seq',
      namespace: 'txn_escrow_finish_seq',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // set up an escrow
    const CLOSE_TIME: number = (
      await testContext.client.request({
        command: 'ledger',
        ledger_index: 'validated',
      })
    ).result.ledger.close_time

    const setupTx: EscrowCreate = {
      TransactionType: 'EscrowCreate',
      Account: testContext.hook1.classicAddress,
      Destination: testContext.alice.classicAddress,
      Amount: xrpToDrops(1),
      FinishAfter: CLOSE_TIME + 1,
      CancelAfter: CLOSE_TIME + 100,
    }

    await Xrpld.submit(testContext.client, {
      tx: setupTx,
      wallet: testContext.hook1,
    })
    await close(testContext.client)

    const accountObjectsResponse = await testContext.client.request({
      command: 'account_objects',
      account: testContext.hook1.classicAddress,
      type: 'escrow',
    })
    expect(accountObjectsResponse.result.account_objects?.length).toEqual(1)

    const sequence = (
      await testContext.client.request({
        command: 'tx',
        transaction:
          accountObjectsResponse.result.account_objects[0].PreviousTxnID,
      })
    ).result.Sequence as number

    // INVOKE IN
    const hookWallet = testContext.hook1
    const aliceWallet = testContext.alice
    const hookAcctHex = AccountID.from(hookWallet.classicAddress).toHex()
    const tx1param1 = new iHookParamEntry(
      new iHookParamName('OA'),
      new iHookParamValue(hookAcctHex, true)
    )
    const tx1param2 = new iHookParamEntry(
      new iHookParamName('SEQ'),
      new iHookParamValue(sequence.toString(16).toUpperCase(), true)
    )
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      Destination: hookWallet.classicAddress,
      HookParameters: [tx1param1.toXrpl(), tx1param2.toXrpl()],
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
      'txn_escrow_finish_seq.c: Tx emitted success.'
    )
    await close(testContext.client)
    // confirm that the offer actually went through
    const accountObjectsResponse2 = await testContext.client.request({
      command: 'account_objects',
      account: testContext.hook1.classicAddress,
      type: 'escrow',
    })
    expect(accountObjectsResponse2.result.account_objects?.length).toEqual(0)
  })
})
