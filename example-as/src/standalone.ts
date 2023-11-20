import {
  Payment,
  SetHookFlags,
  TransactionMetadata,
  xrpToDrops,
} from '@transia/xrpl'
import {
  createHookPayload,
  setHooksV3,
  SetHookParams,
  Xrpld,
  ExecutionUtility,
} from '@transia/hooks-toolkit'

// NOT EXPORTED
import {
  XrplIntegrationTestContext,
  serverUrl,
  setupClient,
} from '@transia/hooks-toolkit/dist/npm/src/libs/xrpl-helpers'

export async function main(): Promise<void> {
  const testContext = (await setupClient(
    serverUrl
  )) as XrplIntegrationTestContext

  const hook = createHookPayload(0, 'base', 'base', SetHookFlags.hsfOverride, [
    'Payment',
  ])

  await setHooksV3({
    client: testContext.client,
    seed: testContext.alice.seed,
    hooks: [{ Hook: hook }],
  } as SetHookParams)

  // PAYMENT IN
  const aliceWallet = testContext.alice
  const bobWallet = testContext.bob

  const builtTx: Payment = {
    TransactionType: 'Payment',
    Account: bobWallet.classicAddress,
    Destination: aliceWallet.classicAddress,
    Amount: xrpToDrops(10),
  }

  const result = await Xrpld.submit(testContext.client, {
    wallet: bobWallet,
    tx: builtTx,
  })

  const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
    testContext.client,
    result.meta as TransactionMetadata
  )
  console.log(hookExecutions.executions[0].HookReturnString)
  await testContext.client.disconnect()
}

main()
