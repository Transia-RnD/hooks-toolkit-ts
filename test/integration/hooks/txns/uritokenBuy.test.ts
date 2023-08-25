// xrpl
import {
  Invoke,
  SetHookFlags,
  TransactionMetadata,
  URITokenCreateSellOffer,
  URITokenMint,
  convertStringToHex,
} from '@transia/xrpl'
import { AccountID, Currency } from '@transia/ripple-binary-codec/dist/types'
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
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  floatToLEXfl,
} from '../../../../dist/npm/src'
import { hashURIToken } from '@transia/xrpl/dist/npm/utils/hashes'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'

describe('offerCreate', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  // beforeEach(async () => {})

  it('txn uritoken create sell offer hook', async () => {
    const hook = createHookPayload(
      0,
      'txn_uritoken_buy',
      'txn_uritoken_buy',
      SetHookFlags.hsfOverride,
      ['Invoke']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob

    // URITOKEN_MINT && URITOKEN_CREATE_SELL_OFFER IN
    const builtTx1: URITokenMint = {
      TransactionType: 'URITokenMint',
      Account: bobWallet.classicAddress,
      URI: convertStringToHex('ipfs://'),
    }
    await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx1,
    })
    await close(testContext.client)
    const uriTokenID = hashURIToken(bobWallet.classicAddress, 'ipfs://')
    const tx2Amount: IssuedCurrencyAmount = {
      value: '10',
      currency: 'USD',
      issuer: testContext.gw.classicAddress,
    }
    const builtTx2: URITokenCreateSellOffer = {
      TransactionType: 'URITokenCreateSellOffer',
      Account: bobWallet.classicAddress,
      Amount: tx2Amount,
      URITokenID: uriTokenID,
    }
    await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx2,
    })

    // INVOKE IN
    const tx3param1 = new iHookParamEntry(
      new iHookParamName('ID'),
      new iHookParamValue(uriTokenID, true)
    )
    const tx3param2 = new iHookParamEntry(
      new iHookParamName('AMT'),
      new iHookParamValue(
        floatToLEXfl('10') +
          Currency.from('USD').toHex() +
          AccountID.from(testContext.gw.classicAddress).toHex(),
        true
      )
    )
    const builtTx3: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      HookParameters: [tx3param1.toXrpl(), tx3param2.toXrpl()],
    }
    const result3 = await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx3,
    })
    const hook3Executions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result3.meta as TransactionMetadata
    )
    expect(hook3Executions.executions[0].HookReturnString).toMatch(
      'txn_uritoken_buy.c: Tx emitted success.'
    )
    await close(testContext.client)
  })
})
