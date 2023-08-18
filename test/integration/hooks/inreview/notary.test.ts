import {
  Payment,
  SetHookFlags,
  SignerListSet,
  TransactionMetadata,
  encode,
  xrpToDrops,
} from '@transia/xrpl'
// xrpl-helpers
import {
  serverUrl,
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Xrpld,
  SetHookParams,
  createHookPayload,
  setHooksV3,
  ExecutionUtility,
} from '../../../../dist/npm/src'

// Error Group
// DA: TODO

// Success Group
// Notary: ACCEPT:

describe('Application.notary - Success Group', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('payment - emit successful', async () => {
    const hook = createHookPayload(
      0,
      'notary',
      'notary',
      SetHookFlags.hsfOverride,
      ['Payment']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const carolWallet = testContext.carol

    // PROPOSE TX
    const proposeTx: Payment = {
      TransactionType: 'Payment',
      Account: aliceWallet.classicAddress,
      Destination: carolWallet.classicAddress,
      DestinationTag: 1,
      Amount: xrpToDrops(100),
      LastLedgerSequence: 4000000000,
    }

    const encodedTx = encode(proposeTx)

    const Memos = [
      {
        Memo: {
          MemoData: encodedTx,
          MemoFormat: '756E7369676E65642F7061796C6F61642B31',
          MemoType: '6E6F746172792F70726F706F736564',
        },
      },
    ]

    // SINGERS LIST SET IN
    const signerList = [
      { SignerEntry: { Account: bobWallet.classicAddress, SignerWeight: 1 } },
      { SignerEntry: { Account: carolWallet.classicAddress, SignerWeight: 1 } },
    ]
    const signersTx: SignerListSet = {
      TransactionType: 'SignerListSet',
      Account: aliceWallet.classicAddress,
      SignerEntries: signerList,
      SignerQuorum: 2,
    }
    await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: signersTx,
    })

    // PAYMENT IN
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      Amount: xrpToDrops(1),
      Memos: Memos,
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
      'Notary: Accepted waiting for other signers...: 24325679B005B246C2D73EB19D3D38FFA11F6EC0DA5E8601D48306A8B183B7F8'
    )
  })
})
