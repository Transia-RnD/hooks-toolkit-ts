import { AccountSetAsfFlags, Client, Invoke, Wallet } from '@transia/xrpl'
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
import { appLogger } from '../logger'
import { Xrpld } from '../../Xrpld'
import { setHooksV3 } from '../../setHooks'
import { SetHookParams } from '../../types'

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
  const accounts = [
    'gw',
    'alice',
    'bob',
    'carol',
    'dave',
    'elsa',
    'frank',
    'grace',
    'heidi',
    'ivan',
    'judy',
  ]
  const wallets = accounts.map((account) => new Account(account))
  const USD = ic as IC

  // FUND GW
  const gw = wallets[0]
  if ((await balance(client, gw.wallet.classicAddress)) == 0) {
    appLogger.debug(
      `SETUP GW: ${await balance(client, gw.wallet.classicAddress)}`
    )
    await fund(client, wallet, new ICXRP(10000), gw.wallet.classicAddress)
    await accountSet(client, gw.wallet, AccountSetAsfFlags.asfDefaultRipple)
    await sell(client, USD.set(20000), gw.wallet, 0.8)
  }

  const needsFunding = []
  const needsLines = []
  const needsIC = []

  for (let i = 1; i < wallets.length; i++) {
    const wallet = wallets[i]

    if ((await balance(client, wallet.wallet.classicAddress)) < 10000000000) {
      appLogger.debug(
        `${wallet.wallet.classicAddress} NEEDS FUNDING: ${await balance(
          client,
          wallet.wallet.classicAddress
        )}`
      )
      needsFunding.push(wallet.wallet.classicAddress)
    }

    if ((await limit(client, wallet.wallet.classicAddress, USD)) < 100000) {
      appLogger.debug(
        `${wallet.wallet.classicAddress} NEEDS TRUST: ${await balance(
          client,
          wallet.wallet.classicAddress
        )}`
      )
      needsLines.push(wallet.wallet)
    }

    if ((await balance(client, wallet.wallet.classicAddress, USD)) < 10000) {
      appLogger.debug(
        `${wallet.wallet.classicAddress} NEEDS IC: ${await balance(
          client,
          wallet.wallet.classicAddress
        )}`
      )
      needsIC.push(wallet.wallet.classicAddress)
    }
  }

  appLogger.debug(`FUNDING: ${needsFunding.length}`)
  appLogger.debug(`TRUSTING: ${needsLines.length}`)
  appLogger.debug(`PAYING: ${needsIC.length}`)

  await fund(client, wallet, new ICXRP(20000), ...needsFunding)
  await trust(client, USD.set(100000), ...needsLines)
  await pay(client, USD.set(50000), gw.wallet, ...needsIC)
}

/**
 * This function will fund a new wallet on the Hooks Local Ledger.
 *
 * @returns {Wallet}
 */
export async function initGovernTable(
  client: Client,
  invoker: Wallet,
  invokee: Wallet
): Promise<void> {
  const tx: Invoke = {
    TransactionType: 'Invoke',
    Account: invoker.classicAddress,
    Destination: invokee.classicAddress,
  }
  await Xrpld.submit(client, { tx: tx, wallet: invoker })
}

/**
 * This function will fund a new wallet on the Hooks Local Ledger.
 *
 * @returns {void}
 */
export async function setGovernTable(
  client: Client,
  invoker: Wallet,
  table: Wallet
): Promise<void> {
  const hook = {
    HookHash:
      '78CA3F5BD3D4F7B32A6BEBB3844380A9345C9BA496EFEB30314BDDF405D7B4B3',
    HookParameters: [
      {
        HookParameter: {
          HookParameterName: '495300',
          HookParameterValue: '8DB64742BEBDE0FA4408D18D1ACB771A9F395D14',
        },
      },
      {
        HookParameter: {
          HookParameterName: '495301',
          HookParameterValue: 'C73F13BE66550A30BB069D5BBEFDEB6DEE22B2C2',
        },
      },
      {
        HookParameter: {
          HookParameterName: '494D43',
          HookParameterValue: '02',
        },
      },
    ],
  }
  await setHooksV3({
    client: client,
    seed: table.seed,
    hooks: [{ Hook: hook }],
  } as SetHookParams)
  const tx: Invoke = {
    TransactionType: 'Invoke',
    Account: invoker.classicAddress,
    Destination: table.classicAddress,
  }
  await Xrpld.submit(client, { tx: tx, wallet: invoker })
}
