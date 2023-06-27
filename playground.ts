
import { Client, LedgerEntryRequest, encode, TxRequest } from '@transia/xrpl'
// import sha512Half from '@transia/xrpl/dist/npm/utils/hashes/sha512Half'
// import HashPrefix from '@transia/xrpl/dist/npm/utils/hashes/HashPrefix'
import { LedgerIndex } from '@transia/xrpl/dist/npm/models/common'
import { EmittedTxn } from '@transia/xrpl/dist/npm/models/ledger'
import { hashSignedTx } from '@transia/xrpl/dist/npm/utils/hashes'

// const hash = hashTx()

async function main() {
    // const client = new Client('ws://localhost:6006')
    const client = new Client('wss://hooks-testnet-v3.xrpl-labs.com')
    await client.connect()

    const emitted_hash = 'EA40EE41C2423BDED0B5541C8B49A8F263C99B1291F7D0D33BE5B87E9883E6DF'
    const li = 3830748 as LedgerIndex
    const request: LedgerEntryRequest = {
        command: 'ledger_entry',
        index: emitted_hash,
        ledger_index: li
    }
    const response = await client.request(request)
    const emitTx = (response.result.node as EmittedTxn).EmittedTxn
    const encoded = encode(emitTx)
    const hash = hashSignedTx(encoded)
    
    const txRequest: TxRequest = {
        command: 'tx',
        transaction: hash
    }
    const txResponse = await client.request(txRequest)
    console.log(txResponse);
    await client.disconnect()
}

main()