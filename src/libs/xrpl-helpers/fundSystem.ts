import { AccountSetAsfFlags, Client, Wallet } from '@transia/xrpl'
import {
  Account,
  ICXRP,
  IC,
  fund,
  trust,
  pay,
  balance,
  limit,
  accountSet,
  sell,
} from '../xrpl-helpers'

/**
 * This function will fund a new wallet on the Hooks Local Ledger.
 *
 * @returns {Wallet}
 */
export async function fundSystem(
  client: Client,
  wallet: Wallet,
  ic: IC
): Promise<void> {
  // const accReserveFee = await accountReserveFee(client)
  // const ownReserveFee = await ownerReserveFee(client)

  // INIT ACCOUNTS
  const gw = new Account('gw')
  const alice = new Account('alice')
  const bob = new Account('bob')
  const carol = new Account('carol')
  const dave = new Account('dave')
  const elsa = new Account('elsa')

  // INIT IC
  const USD = ic as IC

  // FUND GW
  if ((await balance(client, gw.wallet.classicAddress)) == 0) {
    // Setup GW
    // console.log(`SETUP GW: ${await balance(client, gw.wallet.classicAddress)}`)
    await fund(client, wallet, new ICXRP(10000), ...[gw.wallet.classicAddress])
    await accountSet(client, gw.wallet, AccountSetAsfFlags.asfDefaultRipple)
    await sell(client, USD.set(20000), gw.wallet, 0.8)
  }

  // Check Funded
  const needsFunding: string[] = []
  if ((await balance(client, gw.wallet.classicAddress)) < 10000000000) {
    // console.log(
    //   `${gw.wallet.classicAddress} NEEDS FUNDING: ${await balance(
    //     client,
    //     gw.wallet.classicAddress
    //   )}`
    // )
    needsFunding.push(gw.wallet.classicAddress)
  }

  if ((await balance(client, alice.wallet.classicAddress)) < 10000000000) {
    // console.log(
    //   `${alice.wallet.classicAddress} NEEDS FUNDING: ${await balance(
    //     client,
    //     alice.wallet.classicAddress
    //   )}`
    // )
    needsFunding.push(alice.wallet.classicAddress)
  }
  if ((await balance(client, bob.wallet.classicAddress)) < 10000000000) {
    // console.log(
    //   `${bob.wallet.classicAddress} NEEDS FUNDING: ${await balance(
    //     client,
    //     bob.wallet.classicAddress
    //   )}`
    // )
    needsFunding.push(bob.wallet.classicAddress)
  }
  if ((await balance(client, carol.wallet.classicAddress)) < 10000000000) {
    // console.log(
    //   `${carol.wallet.classicAddress} NEEDS FUNDING: ${await balance(
    //     client,
    //     carol.wallet.classicAddress
    //   )}`
    // )
    needsFunding.push(carol.wallet.classicAddress)
  }
  if ((await balance(client, dave.wallet.classicAddress)) < 10000000000) {
    // console.log(
    //   `${dave.wallet.classicAddress} NEEDS FUNDING: ${await balance(
    //     client,
    //     dave.wallet.classicAddress
    //   )}`
    // )
    needsFunding.push(dave.wallet.classicAddress)
  }
  if ((await balance(client, elsa.wallet.classicAddress)) < 10000000000) {
    // console.log(
    //   `${elsa.wallet.classicAddress} NEEDS FUNDING: ${await balance(
    //     client,
    //     elsa.wallet.classicAddress
    //   )}`
    // )
    needsFunding.push(elsa.wallet.classicAddress)
  }

  // Check Trustline
  const needsLines: Wallet[] = []
  if ((await limit(client, alice.wallet.classicAddress, USD)) < 100000) {
    // console.log(
    //   `${alice.wallet.classicAddress} NEEDS TRUST: ${await balance(
    //     client,
    //     alice.wallet.classicAddress
    //   )}`
    // )
    needsLines.push(alice.wallet)
  }
  if ((await limit(client, bob.wallet.classicAddress, USD)) < 100000) {
    // console.log(
    //   `${bob.wallet.classicAddress} NEEDS TRUST: ${await balance(
    //     client,
    //     bob.wallet.classicAddress
    //   )}`
    // )
    needsLines.push(bob.wallet)
  }
  if ((await limit(client, carol.wallet.classicAddress, USD)) < 100000) {
    // console.log(
    //   `${carol.wallet.classicAddress} NEEDS TRUST: ${await balance(
    //     client,
    //     carol.wallet.classicAddress
    //   )}`
    // )
    needsLines.push(carol.wallet)
  }
  if ((await limit(client, dave.wallet.classicAddress, USD)) < 100000) {
    // console.log(
    //   `${dave.wallet.classicAddress} NEEDS TRUST: ${await balance(
    //     client,
    //     dave.wallet.classicAddress
    //   )}`
    // )
    needsLines.push(dave.wallet)
  }
  if ((await limit(client, elsa.wallet.classicAddress, USD)) < 100000) {
    // console.log(
    //   `${elsa.wallet.classicAddress} NEEDS TRUST: ${await balance(
    //     client,
    //     elsa.wallet.classicAddress
    //   )}`
    // )
    needsLines.push(elsa.wallet)
  }

  // Check IC Balance
  const needsIC: string[] = []
  if ((await balance(client, alice.wallet.classicAddress, USD)) < 10000) {
    // console.log(
    //   `${alice.wallet.classicAddress} NEEDS IC: ${await balance(
    //     client,
    //     alice.wallet.classicAddress
    //   )}`
    // )
    needsIC.push(alice.wallet.classicAddress)
  }
  if ((await balance(client, bob.wallet.classicAddress, USD)) < 10000) {
    // console.log(
    //   `${bob.wallet.classicAddress} NEEDS IC: ${await balance(
    //     client,
    //     bob.wallet.classicAddress
    //   )}`
    // )
    needsIC.push(bob.wallet.classicAddress)
  }
  if ((await balance(client, carol.wallet.classicAddress, USD)) < 10000) {
    // console.log(
    //   `${carol.wallet.classicAddress} NEEDS IC: ${await balance(
    //     client,
    //     carol.wallet.classicAddress
    //   )}`
    // )
    needsIC.push(carol.wallet.classicAddress)
  }
  if ((await balance(client, dave.wallet.classicAddress, USD)) < 10000) {
    // console.log(
    //   `${dave.wallet.classicAddress} NEEDS IC: ${await balance(
    //     client,
    //     dave.wallet.classicAddress
    //   )}`
    // )
    needsIC.push(dave.wallet.classicAddress)
  }
  if ((await balance(client, elsa.wallet.classicAddress, USD)) < 10000) {
    // console.log(
    //   `${elsa.wallet.classicAddress} NEEDS IC: ${await balance(
    //     client,
    //     elsa.wallet.classicAddress
    //   )}`
    // )
    needsIC.push(elsa.wallet.classicAddress)
  }

  // console.log(`FUNDING: ${needsFunding.length}`)
  // console.log(`TRUSTING: ${needsLines.length}`)
  // console.log(`PAYING: ${needsIC.length}`)

  await fund(client, wallet, new ICXRP(20000), ...needsFunding)
  await trust(client, USD.set(100000), ...needsLines)
  await pay(client, USD.set(50000), gw.wallet, ...needsIC)
}
