import { ClaimReward } from '@transia/xrpl'
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  close,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'

// how long before each test case times out
const TIMEOUT = 20000

describe('ClaimReward', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      // Opt in to claim rewards
      const setupTx: ClaimReward = {
        TransactionType: 'ClaimReward',
        Account: testContext.alice.classicAddress,
        Issuer: testContext.master.classicAddress,
      }
      const response = await Xrpld.submit(testContext.client, {
        tx: setupTx,
        wallet: testContext.alice,
      })

      console.log(JSON.stringify(response))

      // advance ledger
      for (let index = 0; index < 250; index++) {
        await close(testContext.client)
      }

      // Opt in to claim rewards
      const claimTx: ClaimReward = {
        TransactionType: 'ClaimReward',
        Account: testContext.alice.classicAddress,
        Issuer: testContext.master.classicAddress,
      }
      const response1 = await Xrpld.submit(testContext.client, {
        tx: claimTx,
        wallet: testContext.alice,
      })

      console.log(JSON.stringify(response1))

      // trigger hook
      await close(testContext.client)
    },
    TIMEOUT
  )
})
