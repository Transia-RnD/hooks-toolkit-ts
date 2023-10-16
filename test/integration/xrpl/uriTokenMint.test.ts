import { assert } from 'chai'

import { convertStringToHex, URITokenMint } from '@transia/xrpl'
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
        URI: convertStringToHex('ipfs://CIDMINT'),
      }

      const response = await Xrpld.submit(testContext.client, {
        tx: tx,
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
        2
      )
    },
    TIMEOUT
  )
})
