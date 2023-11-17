import { AccountSet } from '@transia/xrpl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
  serverUrl,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'

// how long before each test case times out
const TIMEOUT = 20000

describe('AccountSet', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const tx: AccountSet = {
        TransactionType: 'AccountSet',
        Account: testContext.alice.classicAddress,
      }
      await Xrpld.submit(testContext.client, {
        tx: tx,
        wallet: testContext.alice,
      })
    },
    TIMEOUT
  )
})
