import { DepositPreauth, Wallet } from '@transia/xrpl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
  serverUrl,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'

// how long before each test case times out
const TIMEOUT = 20000

describe('DepositPreauth', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const wallet2 = testContext.bob
      const tx: DepositPreauth = {
        TransactionType: 'DepositPreauth',
        Account: testContext.alice.classicAddress,
        Authorize: wallet2.classicAddress,
      }
      await Xrpld.submit(testContext.client, {
        tx: tx,
        wallet: testContext.alice,
      })
    },
    TIMEOUT
  )
})
