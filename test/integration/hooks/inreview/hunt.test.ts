// xrpl
import {
  Invoke,
  LedgerEntryRequest,
  SetHookFlags,
  TransactionMetadata,
} from '@transia/xrpl'
import { deriveKeypair, sign } from '@transia/ripple-keypairs'
import { AccountID } from '@transia/ripple-binary-codec/dist/types'
import { Hook as LeHook } from '@transia/xrpl/dist/npm/models/ledger'
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
  //   padHexString,
  StateUtility,
  ExecutionUtility,
  iHookGrantHash,
  iHookGrantEntry,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  hexNamespace,
  floatToLEXfl,
} from '../../../../dist/npm/src'

// LevelThree: ACCEPT: success

describe('hunt', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('hunt three - success', async () => {
    // L1 Hook
    const l1Wallet = testContext.alice
    const l1AccHex = AccountID.from(l1Wallet.classicAddress).toHex()
    const L1Seed = 'ssSKgUqLo4UWT6btXCW2qig9iVsu2'
    const L1Keypair = deriveKeypair(L1Seed)
    const sig = sign(l1AccHex, L1Keypair.privateKey)

    const hook1setparam1 = new iHookParamEntry(
      new iHookParamName('L1PK'),
      new iHookParamValue(L1Keypair.publicKey, true)
    )
    const hook1 = createHookPayload(
      0,
      'hunt_one',
      'hunt_one',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [hook1setparam1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: l1Wallet.seed,
      hooks: [{ Hook: hook1 }],
    } as SetHookParams)

    // L2 Hook
    const l2Wallet = testContext.bob
    // const l2AccHex = AccountID.from(l2Wallet.classicAddress).toHex()
    const L2Seed = 'snvpzES8yZyAG24dHTbHK54q5TE1G'
    const L2Keypair = deriveKeypair(L2Seed)
    const sig2 = sign(floatToLEXfl('123456'), L2Keypair.privateKey)

    // GET L1 HookHash
    const hookReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: l1Wallet.classicAddress,
      },
    }
    const hookRes = await testContext.client.request(hookReq)
    const leHook = hookRes.result.node as LeHook
    const hookHash = leHook.Hooks[0].Hook.HookHash
    const hookGrant = new iHookGrantEntry(
      new iHookGrantHash(hookHash as string)
    )
    const hook2hparam1 = new iHookParamEntry(
      new iHookParamName('L2A'),
      new iHookParamValue(sig2, true)
    )
    const hook2 = createHookPayload(
      0,
      'hunt_two',
      'hunt_two',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [hook2hparam1.toXrpl()],
      [hookGrant.toXrpl()]
    )

    await setHooksV3({
      client: testContext.client,
      seed: l2Wallet.seed,
      hooks: [{ Hook: hook2 }],
    } as SetHookParams)

    // L3 Hook
    const l3Wallet = testContext.carol

    // GET L2 HookHash
    const hook3Req: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: l2Wallet.classicAddress,
      },
    }
    const hook2Res = await testContext.client.request(hook3Req)
    const leHook2 = hook2Res.result.node as LeHook
    const hookHash2 = leHook2.Hooks[0].Hook.HookHash
    const hookGrant2 = new iHookGrantEntry(
      new iHookGrantHash(hookHash2 as string)
    )
    const hook3 = createHookPayload(
      0,
      'hunt_three',
      'hunt_three',
      SetHookFlags.hsfOverride,
      ['Invoke'],
      [],
      [hookGrant.toXrpl(), hookGrant2.toXrpl()]
    )

    await setHooksV3({
      client: testContext.client,
      seed: l3Wallet.seed,
      hooks: [{ Hook: hook3 }],
    } as SetHookParams)

    // INVOKE L1 IN
    const hook1param1 = new iHookParamEntry(
      new iHookParamName('L1S'),
      new iHookParamValue(sig, true)
    )
    const elsaWallet = testContext.elsa
    const builtTx1: Invoke = {
      TransactionType: 'Invoke',
      Account: elsaWallet.classicAddress,
      Destination: l1Wallet.classicAddress,
      HookParameters: [hook1param1.toXrpl()],
    }
    const result1 = await Xrpld.submit(testContext.client, {
      wallet: elsaWallet,
      tx: builtTx1,
    })

    const hookExecutions1 = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result1.meta as TransactionMetadata
    )
    console.log(hookExecutions1)

    // expect(hookExecutions1.executions[0].HookReturnString).toMatch(
    //   'hunt_one.c: State not exists'
    // )

    const hookState1 = await StateUtility.getHookStateDir(
      testContext.client,
      testContext.alice.classicAddress,
      'hunt_one'
    )
    console.log(hookState1)

    // INVOKE L2 IN
    const hook2param1 = new iHookParamEntry(
      new iHookParamName('L1N'),
      new iHookParamValue(hexNamespace('hunt_one'), true)
    )
    const builtTx2: Invoke = {
      TransactionType: 'Invoke',
      Account: elsaWallet.classicAddress,
      Destination: l2Wallet.classicAddress,
      HookParameters: [hook2param1.toXrpl()],
    }
    const result2 = await Xrpld.submit(testContext.client, {
      wallet: elsaWallet,
      tx: builtTx2,
    })

    const hookExecutions2 = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result2.meta as TransactionMetadata
    )
    console.log(hookExecutions2)

    // expect(hookExecutions2.executions[0].HookReturnString).toMatch(
    //   'hunt_one.c: State not exists'
    // )

    const hookState2 = await StateUtility.getHookStateDir(
      testContext.client,
      l2Wallet.classicAddress,
      'hunt_two'
    )
    console.log(hookState2)

    // INVOKE L3 IN
    const hook3param1 = new iHookParamEntry(
      new iHookParamName('L1N'),
      new iHookParamValue(hexNamespace('hunt_one'), true)
    )
    const hook3param2 = new iHookParamEntry(
      new iHookParamName('L2N'),
      new iHookParamValue(hexNamespace('hunt_two'), true)
    )
    const hook3param3 = new iHookParamEntry(
      new iHookParamName('L3M'),
      new iHookParamValue(floatToLEXfl('123456'), true)
    )
    const builtTx3: Invoke = {
      TransactionType: 'Invoke',
      Account: elsaWallet.classicAddress,
      Destination: l3Wallet.classicAddress,
      HookParameters: [
        hook3param1.toXrpl(),
        hook3param2.toXrpl(),
        hook3param3.toXrpl(),
      ],
    }
    const result3 = await Xrpld.submit(testContext.client, {
      wallet: elsaWallet,
      tx: builtTx3,
    })

    const hookExecutions3 = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result3.meta as TransactionMetadata
    )
    console.log(hookExecutions3)

    expect(hookExecutions3.executions[0].HookReturnString).toMatch(
      'hunt_three.c: Easter Egg Minted.'
    )
  })
})
