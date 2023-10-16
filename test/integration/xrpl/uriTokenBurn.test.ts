import { assert } from 'chai'

import { convertStringToHex, URITokenMint, URITokenBurn } from '@transia/xrpl'
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'

// how long before each test case times out
const TIMEOUT = 20000

describe('URITokenMint', function () {
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
        URI: convertStringToHex('ipfs://CIDBURN'),
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

      const burnTx: URITokenBurn = {
        TransactionType: 'URITokenBurn',
        Account: testContext.alice.classicAddress,
        URITokenID: uriTokenID,
      }

      const response = await Xrpld.submit(testContext.client, {
        tx: burnTx,
        wallet: testContext.alice,
      })

      console.log(JSON.stringify(response))

      // check that the object was actually created
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
