import { Client, Wallet } from '@transia/xrpl'
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
    await fund(client, wallet, new ICXRP(10000), ...[gw.wallet.classicAddress])
    await accountSet(client, gw.wallet)
    await sell(client, USD.set(20000), gw.wallet, 0.8)
  }

  // Check Funded
  const needsFunding: string[] = []
  if ((await balance(client, gw.wallet.classicAddress)) < 10000) {
    needsFunding.push(gw.wallet.classicAddress)
  }
  if ((await balance(client, alice.wallet.classicAddress)) < 10000) {
    needsFunding.push(alice.wallet.classicAddress)
  }
  if ((await balance(client, bob.wallet.classicAddress)) < 10000) {
    needsFunding.push(bob.wallet.classicAddress)
  }
  if ((await balance(client, carol.wallet.classicAddress)) < 10000) {
    needsFunding.push(carol.wallet.classicAddress)
  }
  if ((await balance(client, dave.wallet.classicAddress)) < 10000) {
    needsFunding.push(dave.wallet.classicAddress)
  }
  if ((await balance(client, elsa.wallet.classicAddress)) < 10000) {
    needsFunding.push(elsa.wallet.classicAddress)
  }

  // Check Trustline
  const needsLines: Wallet[] = []
  if ((await limit(client, alice.wallet.classicAddress, USD)) < 100000) {
    needsLines.push(alice.wallet)
  }
  if ((await limit(client, bob.wallet.classicAddress, USD)) < 100000) {
    needsLines.push(bob.wallet)
  }
  if ((await limit(client, carol.wallet.classicAddress, USD)) < 100000) {
    needsLines.push(carol.wallet)
  }
  if ((await limit(client, dave.wallet.classicAddress, USD)) < 100000) {
    needsLines.push(dave.wallet)
  }
  if ((await limit(client, elsa.wallet.classicAddress, USD)) < 100000) {
    needsLines.push(elsa.wallet)
  }

  // Check IC Balance
  const needsIC: string[] = []
  if ((await balance(client, alice.wallet.classicAddress, USD)) < 10000) {
    needsIC.push(alice.wallet.classicAddress)
  }
  if ((await balance(client, bob.wallet.classicAddress, USD)) < 10000) {
    needsIC.push(bob.wallet.classicAddress)
  }
  if ((await balance(client, carol.wallet.classicAddress, USD)) < 10000) {
    needsIC.push(carol.wallet.classicAddress)
  }
  if ((await balance(client, dave.wallet.classicAddress, USD)) < 10000) {
    needsIC.push(dave.wallet.classicAddress)
  }
  if ((await balance(client, elsa.wallet.classicAddress, USD)) < 10000) {
    needsIC.push(elsa.wallet.classicAddress)
  }

  console.log(`FUNDING: ${needsFunding.length}`)
  console.log(`TRUSTING: ${needsLines.length}`)
  console.log(`PAYING: ${needsIC.length}`)

  await fund(client, wallet, new ICXRP(10000), ...needsFunding)
  await trust(client, USD.set(100000), ...needsLines)
  await pay(client, USD.set(2000), gw.wallet, ...needsIC)
}
