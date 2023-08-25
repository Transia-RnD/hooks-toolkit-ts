// xrpl
import {
  Invoke,
  SetHookFlags,
  TransactionMetadata,
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

describe('offerCreate', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    const hook = createHookPayload(
      0,
      'txn_uritoken_create_sell_offer',
      'txn_uritoken_create_sell_offer',
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
      URI: convertStringToHex('ipfs://'),
    }
    await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx1,
    })
    const uriTokenID = hashURIToken(aliceWallet.classicAddress, 'ipfs://')
    console.log(uriTokenID)

    // INVOKE IN
    const tx2param1 = new iHookParamEntry(
      new iHookParamName('ID'),
      new iHookParamValue(uriTokenID, true)
    )
    const tx2param2 = new iHookParamEntry(
      new iHookParamName('AMT'),
      new iHookParamValue(
        floatToLEXfl('10') +
          Currency.from('USD').toHex() +
          AccountID.from(testContext.gw.classicAddress).toHex(),
        true
      )
    )
    const builtTx2: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      HookParameters: [tx2param1.toXrpl(), tx2param2.toXrpl()],
    }
    const result2 = await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx2,
    })
    const hook2Executions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result2.meta as TransactionMetadata
    )
    expect(hook2Executions.executions[0].HookReturnString).toMatch(
      'txn_uritoken_create_sell_offer.c: Tx emitted success.'
    )
    await close(testContext.client)
  })
})
