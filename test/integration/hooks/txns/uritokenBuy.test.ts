// xrpl
import {
  Invoke,
  LedgerEntryRequest,
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
  clearAllHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  floatToLEXfl,
} from '../../../../dist/npm/src'
import { hashURIToken } from '@transia/xrpl/dist/npm/utils/hashes'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
import { URIToken as LeURIToken } from '@transia/xrpl/dist/npm/models/ledger'

describe('offerCreate', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
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
  })
  afterAll(async () => {
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
    } as SetHookParams)
    await teardownClient(testContext)
  })

  it('txn uritoken buy', async () => {
    const aliceWallet = testContext.alice
    const bobWallet = testContext.bob
    const carolWallet = testContext.carol

    // Bob: Mint and Sell
    const builtTx1: URITokenMint = {
      TransactionType: 'URITokenMint',
      Account: bobWallet.classicAddress,
      URI: convertStringToHex('ipfs://2'),
    }
    await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx1,
    })
    await close(testContext.client)
    const uriTokenID = hashURIToken(bobWallet.classicAddress, 'ipfs://2')
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
      Account: carolWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      HookParameters: [tx3param1.toXrpl(), tx3param2.toXrpl()],
    }
    const result3 = await Xrpld.submit(testContext.client, {
      wallet: carolWallet,
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
    // const leReq: LedgerEntryRequest = {
    //   command: 'ledger_entry',
    //   uri_token: {
    //     issuer: testContext.alice.classicAddress,
    //     uri: 'ipfs://2',
    //   },
    // }
    // const leRes = await testContext.client.request(leReq)
    // // @ts-expect-error -- unknown
    // const leURIToken = leRes.result.node as LeURIToken
    // console.log(leURIToken)
  })
})
