// xrpl
import { Import, SetHookFlags, TransactionMetadata } from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'
import {
  Xrpld,
  SetHookParams,
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
} from '../../../../dist/npm/src'
import { readWaitXpop } from '@transia/xpop-toolkit'

import path from 'path'
const xpopDir = path.join(process.cwd(), 'test/fixtures/xpop')

describe('xpop_nft_uri', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  // beforeEach(async () => {})

  it('xpop_nft_uri hook', async () => {
    const aliceWallet = testContext.alice
    const gwWallet = testContext.gw

    const hook = createHookPayload(
      0,
      'xpop_nft_uri',
      'xpop_nft_uri',
      SetHookFlags.hsfOverride,
      ['Import']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.gw.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // IMPORT IN
    const xpopBlob: Buffer = await readWaitXpop(
      xpopDir,
      'E7EC18EA6C4DD0451064DBF81CC0D94DA25F730868DCD33F201F3C24B6760CAB',
      10
    )

    const builtTx: Import = {
      TransactionType: 'Import',
      Account: aliceWallet.classicAddress,
      Issuer: gwWallet.classicAddress,
      Blob: xpopBlob.toString('hex').toUpperCase(),
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })
    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookExecutions.executions[0].HookReturnString).toMatch(
      'xpop_nft_uri.c: Finished'
    )
  })
})
