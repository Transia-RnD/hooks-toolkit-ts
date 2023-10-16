import { assert } from 'chai'

import {
  URITokenBuy,
  convertStringToHex,
  URITokenMint,
  URITokenCreateSellOffer,
  xrpToDrops,
} from '@transia/xrpl'
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'

// how long before each test case times out
const TIMEOUT = 20000

describe('URITokenBuy', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const wallet1 = await testContext.bob

      const tx: URITokenMint = {
        TransactionType: 'URITokenMint',
        Account: testContext.alice.classicAddress,
        URI: convertStringToHex('ipfs://CIDBUY'),
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

      const buyTx: URITokenBuy = {
        TransactionType: 'URITokenBuy',
        Account: wallet1.classicAddress,
        URITokenID: uriTokenID,
        Amount: xrpToDrops(10),
      }

      const response = await Xrpld.submit(testContext.client, {
        tx: buyTx,
        wallet: wallet1,
      })

      console.log(JSON.stringify(response))

      // check that wallet1 owns uritoken
      assert.equal(
        (
          await testContext.client.request({
            command: 'account_objects',
            account: wallet1.classicAddress,
          })
        ).result.account_objects.length,
        2
      )
      // check that wallet does not own uritoken
      assert.equal(
        (
          await testContext.client.request({
            command: 'account_objects',
            account: testContext.alice.classicAddress,
          })
        ).result.account_objects.length,
        1
      )
    },
    TIMEOUT
  )
})
