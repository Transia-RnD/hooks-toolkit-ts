import { Invoke } from '@transia/xrpl'
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../src/libs/xrpl-helpers'
import { Xrpld } from '../../../dist/npm/src'

// how long before each test case times out
const TIMEOUT = 20000

describe('Invoke', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const wallet2 = testContext.bob
      const setupTx: Invoke = {
        TransactionType: 'Invoke',
        Account: testContext.alice.classicAddress,
        Destination: wallet2.classicAddress,
        HookParameters: [
          {
            HookParameter: {
              HookParameterName: '54455354',
              HookParameterValue: 'DEADBEEF',
            },
          },
        ],
      }

      const response = await Xrpld.submit(testContext.client, {
        tx: setupTx,
        wallet: testContext.alice,
      })
      console.log(JSON.stringify(response))
    },
    TIMEOUT
  )
})
