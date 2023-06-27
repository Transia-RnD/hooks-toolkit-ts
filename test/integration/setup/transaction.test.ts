import { Transaction } from '@transia/xrpl'
import {
  XrplIntegrationTestContext,
  serverUrl,
  setupClient,
  teardownClient,
  accountReserveFee,
  ownerReserveFee,
  prepareTransactionV3,
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

  it('prepareTransactionV3', async () => {
    const tx: Transaction = {
      TransactionType: 'Payment',
      Account: testContext.alice.classicAddress,
      Destination: testContext.bob.classicAddress,
      Amount: '10000000',
    }
    await prepareTransactionV3(testContext.client, tx)
    expect(tx.NetworkID).toBe(undefined)
    expect(tx.Fee).toBe('20')
  })
})
