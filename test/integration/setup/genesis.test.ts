// import { ClaimReward } from '@transia/xrpl'
// src
import {
  serverUrl,
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  // Xrpld,
  // close,
} from '../../../dist/npm/src'

describe('SetHook - End to End', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl, true)
  })
  afterAll(async () => teardownClient(testContext))

  it('genesis setup', async () => {
    console.log('TEST')

    // const tx: ClaimReward = {
    //   TransactionType: 'ClaimReward',
    //   Account: testContext.alice.classicAddress,
    //   Issuer: testContext.master.classicAddress,
    // }
    // await Xrpld.submit(testContext.client, {
    //   tx: tx,
    //   wallet: testContext.alice,
    // })
    // // Wait 10 seconds for the transaction to be included in a validated ledger
    // await new Promise((resolve) => setTimeout(resolve, 20000))
    // await Xrpld.submit(testContext.client, {
    //   tx: tx,
    //   wallet: testContext.alice,
    // })
    // await close(testContext.client)
  })
})
