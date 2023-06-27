import {
  Client,
  Wallet,
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
import {
  balance,
  fund,
  ICXRP,
} from '@transia/hooks-toolkit/dist/npm/src/libs/xrpl-helpers'
import {
  MASTER_ACCOUNT_WALLET,
  ALICE_ACCOUNT_WALLET,
  BOB_ACCOUNT_WALLET,
} from '@transia/hooks-toolkit/dist/npm/src/libs/xrpl-helpers/constants'

export async function main(): Promise<void> {
  const serverUrl = 'ws://localhost:6006'
  const client = new Client(serverUrl);
  await client.connect()
  client.networkID = await client.getNetworkID()
  
  const wallet = MASTER_ACCOUNT_WALLET
  
  const aliceWallet = ALICE_ACCOUNT_WALLET
  const bobWallet = BOB_ACCOUNT_WALLET

  await fund(
    client,
    wallet,
    new ICXRP(2000), ...[
    aliceWallet.classicAddress,
    bobWallet.classicAddress,
  ])

  const hook = createHookPayload(
    0,
    'base',
    'base',
    SetHookFlags.hsfOverride,
    ['Payment']
  )

  await setHooksV3({
    client: client,
    seed: aliceWallet.seed,
    hooks: [{ Hook: hook }],
  } as SetHookParams)

  // PAYMENT IN

  const builtTx: Payment = {
    TransactionType: 'Payment',
    Account: bobWallet.classicAddress,
    Destination: aliceWallet.classicAddress,
    Amount: xrpToDrops(10),
  }
  const result = await Xrpld.submit(client, {
    wallet: bobWallet,
    tx: builtTx,
  })

  const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
    client,
    result.meta as TransactionMetadata
  )
  console.log(hookExecutions.executions[0].HookReturnString)
  await client.disconnect()
}

main()
