import { Transaction } from '@transia/xrpl'
import {
  XrplIntegrationTestContext,
  serverUrl,
  setupClient,
  teardownClient,
  accountReserveFee,
  ownerReserveFee,
} from '../../../src/libs/xrpl-helpers'

describe('transaction', () => {
  let testContext: XrplIntegrationTestContext
  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('accountReserveFee should be 200 XRP', async () => {
    const fee = await accountReserveFee(testContext.client)
    expect(fee).toBe(10000000)
  })

  it('ownerReserveFee should be 50 XRP', async () => {
    const fee = await ownerReserveFee(testContext.client)
    expect(fee).toBe(2000000)
  })
})
