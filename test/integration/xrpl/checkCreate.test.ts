import { assert } from 'chai'

import { CheckCreate } from '@transia/xrpl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
  serverUrl,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'

// how long before each test case times out
const TIMEOUT = 20000

describe('CheckCreate', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const wallet2 = await testContext.bob
      const tx: CheckCreate = {
        TransactionType: 'CheckCreate',
        Account: testContext.alice.classicAddress,
        Destination: wallet2.classicAddress,
        SendMax: '1',
      }

      await Xrpld.submit(testContext.client, {
        tx: tx,
        wallet: testContext.alice,
      })

      // confirm that the check actually went through
      const accountOffersResponse = await testContext.client.request({
        command: 'account_objects',
        account: testContext.alice.classicAddress,
        type: 'check',
      })
      assert.lengthOf(
        accountOffersResponse.result.account_objects,
        1,
        'Should be exactly one check on the ledger'
      )
    },
    TIMEOUT
  )
})
