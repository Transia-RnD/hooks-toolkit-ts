// xrpl
import {
  Invoke,
  SetHookFlags,
  TransactionMetadata,
  URITokenCreateSellOffer,
  URITokenMint,
  convertStringToHex,
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
import { hashURIToken } from '@transia/xrpl/dist/npm/utils/hashes'

describe('uriTokenCancelSellOffer', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const hook = createHookPayload(
      0,
      'txn_uritoken_cancel_sell_offer',
      'txn_uritoken_cancel_sell_offer',
      SetHookFlags.hsfOverride,
      ['Invoke']
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

  it('txn uritoken create sell offer hook', async () => {
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    // URITOKEN_MINT OUT
    const builtTx1: URITokenMint = {
      TransactionType: 'URITokenMint',
      Account: aliceWallet.classicAddress,
      URI: convertStringToHex('ipfs://1'),
    }
    await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx1,
    })
    const uriTokenID = hashURIToken(aliceWallet.classicAddress, 'ipfs://1')

    // URITOKEN CANCEL SELL OFFER OUT
    const builtTx2: URITokenCreateSellOffer = {
      TransactionType: 'URITokenCreateSellOffer',
      Account: aliceWallet.classicAddress,
      Amount: xrpToDrops(1),
      Destination: bobWallet.classicAddress,
      URITokenID: uriTokenID,
    }
    await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx2,
    })

    // INVOKE IN
    const tx2param1 = new iHookParamEntry(
      new iHookParamName('ID'),
      new iHookParamValue(uriTokenID, true)
    )
    const builtTx3: Invoke = {
      TransactionType: 'Invoke',
      Account: aliceWallet.classicAddress,
      HookParameters: [tx2param1.toXrpl()],
    }
    const result3 = await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx3,
    })
    const hook3Executions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result3.meta as TransactionMetadata
    )
    expect(hook3Executions.executions[0].HookReturnString).toMatch(
      'txn_uritoken_cancel_sell_offer.c: Tx emitted success.'
    )
    await close(testContext.client)
  })
})
