import {
  Client,
  Wallet,
  NFTokenMint,
  NFTokenBurn,
  Import,
  NFTokenMintFlags,
  convertStringToHex,
  SetHookFlags,
} from '@transia/xrpl'
import {
  SetHookParams,
  createHookPayload,
  setHooksV3,
} from '@transia/hooks-toolkit'
import { validateConnection, Xrpld, getXpopBlob } from '@transia/xpop-toolkit'

export async function main(): Promise<void> {
  // Define the URLs for the burn and mint clients
  const burnUrl = 'wss://testnet.transia.co'
  const mintUrl = 'wss://xahau-test.net'

  // Create the burn and mint clients and connect to them
  const burnClient = new Client(burnUrl)
  await burnClient.connect()
  const mintClient = new Client(mintUrl)
  await mintClient.connect()
  mintClient.networkID = await mintClient.getNetworkID()

  // Define the wallets for Alice and the gateway
  const aliceWallet = Wallet.fromSeed('ss3DnbW3uTbebBLpp42ayuarNfuY4')
  const gwWallet = Wallet.fromSeed('shr7Yhv1R1c6JTsYinpixQmfipBWq')

  // Validate the synchronization of the burn and mint clients
  await validateConnection(burnClient, 6)
  await validateConnection(mintClient, 6)

  // Define the transaction for minting the NFT
  const mintNftTx: NFTokenMint = {
    TransactionType: 'NFTokenMint',
    Account: aliceWallet.classicAddress,
    // @ts-expect-error - leave this alone
    OperationLimit: 21337,
    NFTokenTaxon: 1,
    URI: convertStringToHex('ipfs://cid'),
    Flags: NFTokenMintFlags.tfBurnable,
  }

  // Submit the mint transaction and get the result
  const mintNftResult = await Xrpld.submitRippled(
    burnClient,
    mintNftTx,
    aliceWallet
  )
  console.log(mintNftResult.hash)

  // Define the transaction for burning the NFT
  const burnNftTx: NFTokenBurn = {
    TransactionType: 'NFTokenBurn',
    Account: aliceWallet.classicAddress,
    Owner: aliceWallet.classicAddress,
    // @ts-expect-error - leave this alone
    OperationLimit: 21337,
    // @ts-expect-error - leave this alone
    NFTokenID: mintNftResult.meta.nftoken_id,
  }

  // Submit the burn transaction and get the result
  const burnNftResult = await Xrpld.submitRippled(
    burnClient,
    burnNftTx,
    aliceWallet
  )

  // Get the XPOP blob
  const xpopHex = await getXpopBlob(
    burnNftResult.hash,
    'https://testnet.transia.co/xpop',
    'url',
    10
  )

  // Create the hook payload and set the hook
  const hook = createHookPayload(
    0,
    'xpop_nft_uri',
    'xpop_nft_uri',
    SetHookFlags.hsfOverride,
    ['Import']
  )
  await setHooksV3({
    client: burnClient,
    seed: gwWallet.seed,
    hooks: [{ Hook: hook }],
  } as SetHookParams)

  // Define the transaction for importing the NFT
  const mintTx: Import = {
    TransactionType: 'Import',
    Account: aliceWallet.classicAddress,
    Blob: xpopHex,
    Issuer: gwWallet.classicAddress,
  }

  // Submit the import transaction and get the result
  const mintResult = await Xrpld.submitXahaud(mintClient, mintTx, aliceWallet)
  console.log(mintResult)

  // Disconnect from the clients
  await mintClient.disconnect()
  await burnClient.disconnect()
}

main()
