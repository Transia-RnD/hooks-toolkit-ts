import { assert } from 'chai'

import { CheckCreate, CheckCash } from '@transia/xrpl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
  serverUrl,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'

// how long before each test case times out
const TIMEOUT = 20000

describe('CheckCash', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const wallet2 = await testContext.bob
      const amount = '1'

      const setupTx: CheckCreate = {
        TransactionType: 'CheckCreate',
        Account: testContext.alice.classicAddress,
        Destination: wallet2.classicAddress,
        SendMax: amount,
      }

      await Xrpld.submit(testContext.client, {
        tx: setupTx,
        wallet: testContext.alice,
      })

      // get check ID
      const response1 = await testContext.client.request({
        command: 'account_objects',
        account: testContext.alice.classicAddress,
        type: 'check',
      })
      assert.lengthOf(
        response1.result.account_objects,
        1,
        'Should be exactly one check on the ledger'
      )
      const checkId = response1.result.account_objects[0].index

      // actual test - cash the check
      const tx: CheckCash = {
        TransactionType: 'CheckCash',
        Account: wallet2.classicAddress,
        CheckID: checkId,
        Amount: amount,
      }

      await Xrpld.submit(testContext.client, { tx: tx, wallet: wallet2 })

      // confirm that the check no longer exists
      const accountOffersResponse = await testContext.client.request({
        command: 'account_objects',
        account: testContext.alice.classicAddress,
        type: 'check',
      })
      assert.lengthOf(
        accountOffersResponse.result.account_objects,
        0,
        'Should be no checks on the ledger'
      )
    },
    TIMEOUT
  )
})
