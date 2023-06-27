import {
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
import {
  XrplIntegrationTestContext,
  serverUrl,
  setupClient,
  createHookPayload,
  setHooksV3,
  SetHookParams,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  Application,
  ExecutionUtility,
  StateUtility,
  floatToXfl,
  // decodeModel,
} from 'hooks-library/dist/npm/src'

import { GambitSlip } from './GambitSlip'
import { GambitBet } from './GambitBet'

export async function main(): Promise<void> {
  const testContext = (await setupClient(
    serverUrl
  )) as XrplIntegrationTestContext

  const hook = createHookPayload(
    0,
    'gambit',
    'gambit',
    SetHookFlags.hsfOverride,
    ['Payment']
  )

  await setHooksV3({
    client: testContext.client,
    seed: testContext.alice.seed,
    hooks: [{ Hook: hook }],
  } as SetHookParams)

  // INVOKE IN
  const aliceWallet = testContext.alice
  const bobWallet = testContext.bob

  const testBet = new GambitBet(
    0, // 0 (Deployed), 1 (Ended) or 2 (Settled)
    floatToXfl(1) as bigint,
    'Vet adds a Hook to his twitter handle',
    0 // 0 (none), 1 (offer) or 2 (counter-offer)
  )
  console.log(testBet.encode())

  const testModel = new GambitSlip(
    1, // 0 (none), 1 (offer) or 2 (counter-offer)
    BigInt(0),
    BigInt(0),
    BigInt(0),
    0,
    0
  )

  const param1 = new iHookParamEntry(
    new iHookParamName('GS'),
    new iHookParamValue(testModel.encode(), true)
  )

  const builtTx: Payment = {
    TransactionType: 'Payment',
    Account: bobWallet.classicAddress,
    Destination: aliceWallet.classicAddress,
    Amount: xrpToDrops(10),
    HookParameters: [param1.toXrpl()],
  }
  const result = await Application.testHookTx(testContext.client, {
    wallet: bobWallet,
    tx: builtTx,
  })

  const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
    testContext.client,
    result.meta as TransactionMetadata
  )
  console.log(hookExecutions.executions[0].HookReturnString)
  const hookStateDir = await StateUtility.getHookStateDir(
    testContext.client,
    testContext.alice.classicAddress,
    'gambit'
  )
  console.log(hookStateDir)
  await testContext.client.disconnect()
}

main()

// const testBet = new GambitBet(
//   0, // 0 (Deployed), 1 (Ended) or 2 (Settled)
//   floatToXfl(1) as bigint,
//   'Vet adds a Hook to his twitter handle',
//   0 // 0 (none), 1 (offer) or 2 (counter-offer)
// )
// console.log(testBet.encode())

// console.log(
//   decodeModel(
//     '0154C38D7EA4C6800054C71AFD498D000054C71AFD498D0000000000000000000000',
//     GambitSlip
//   )
// )
