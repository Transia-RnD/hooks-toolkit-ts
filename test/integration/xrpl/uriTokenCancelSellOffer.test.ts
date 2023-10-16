import { assert } from 'chai'

import {
  convertStringToHex,
  URITokenMint,
  URITokenCreateSellOffer,
  URITokenCancelSellOffer,
  xrpToDrops,
} from '@transia/xrpl'
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'
import { URIToken } from '@transia/xrpl/dist/npm/models/ledger'

// how long before each test case times out
const TIMEOUT = 20000

describe('URITokenCancelSellOffer', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const tx: URITokenMint = {
        TransactionType: 'URITokenMint',
        Account: testContext.alice.classicAddress,
        URI: convertStringToHex('ipfs://CIDCANCEL'),
      }

      await Xrpld.submit(testContext.client, {
        tx: tx,
        wallet: testContext.alice,
      })

      // check that the object was actually created
      const mintResponse = await testContext.client.request({
        command: 'account_objects',
        account: testContext.alice.classicAddress,
      })
      assert.equal(mintResponse.result.account_objects.length, 2)

      const uriTokenID = mintResponse.result.account_objects[0].index
      assert.isString(uriTokenID)

      const sellTx: URITokenCreateSellOffer = {
        TransactionType: 'URITokenCreateSellOffer',
        Account: testContext.alice.classicAddress,
        URITokenID: uriTokenID,
        Amount: xrpToDrops(10),
      }

      await Xrpld.submit(testContext.client, {
        tx: sellTx,
        wallet: testContext.alice,
      })

      // verify amount is on le

      const clearTx: URITokenCancelSellOffer = {
        TransactionType: 'URITokenCancelSellOffer',
        Account: testContext.alice.classicAddress,
        URITokenID: uriTokenID,
      }

      const response = await Xrpld.submit(testContext.client, {
        tx: clearTx,
        wallet: testContext.alice,
      })

      console.log(JSON.stringify(response))

      // verify amount is not on le
      assert.equal(
        (
          (
            await testContext.client.request({
              command: 'ledger_entry',
              index: uriTokenID,
            })
          ).result.node as unknown as URIToken
        ).Amount,
        null
      )
    },
    TIMEOUT
  )
})
