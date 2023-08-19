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
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
} from '../../../../dist/npm/src'
import { currencyToHex } from '../../../../dist/npm/src/libs/binary-models'
import { readWaitXpopDir } from '@transia/xpop-toolkit'

import path from 'path'
const xpopDir = path.join(process.cwd(), 'test/fixtures/xpop')

describe('xpop_iou_iou', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))
  // beforeEach(async () => {})

  it('xpop_iou_iou hook', async () => {
    const aliceWallet = testContext.alice
    const gwWallet = testContext.gw

    const hook = createHookPayload(
      0,
      'xpop_iou_iou',
      'xpop_iou_iou',
      SetHookFlags.hsfOverride,
      ['Import']
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.gw.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // IMPORT IN
    const xpopBlob: Buffer = await readWaitXpopDir(
      xpopDir,
      '22C270F482054073B6A62BB3ADF0EB4B5C1C35B4F722D0D5BBAB1796D97D3259',
      10
    )

    const param1 = new iHookParamEntry(
      new iHookParamName('CUR'),
      new iHookParamValue(currencyToHex('USD'), true)
    )

    const builtTx: Import = {
      TransactionType: 'Import',
      Account: aliceWallet.classicAddress,
      Issuer: gwWallet.classicAddress,
      Blob: xpopBlob.toString('hex').toUpperCase(),
      HookParameters: [param1.toXrpl()],
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
      'xpop_iou_iou.c: Finished'
    )
  })
})
