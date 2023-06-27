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

export async function main(): Promise<void> {
  const serverUrl = 'wss://hooks-testnet-v3.xrpl-labs.com'
  const client = new Client(serverUrl);
  await client.connect()
  client.networkID = await client.getNetworkID()
  
  const aliceWallet = Wallet.fromSeed('ss3DnbW3uTbebBLpp42ayuarNfuY4')
  const bobWallet = Wallet.fromSeed('shQERpGMonKeyxZoRExeEonandMgL')

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
