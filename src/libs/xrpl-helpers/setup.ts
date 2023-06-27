import { Client, Wallet } from '@transia/xrpl'

import serverUrl from './serverUrl'
import {
  NOT_ACTIVE_WALLET,
  MASTER_ACCOUNT_WALLET,
  GW_ACCOUNT_WALLET,
  ALICE_ACCOUNT_WALLET,
  BOB_ACCOUNT_WALLET,
  CAROL_ACCOUNT_WALLET,
} from './constants'
import { fundSystem } from '../xrpl-helpers'
import { IC } from './tools'

export interface XrplIntegrationTestContext {
  client: Client
  notactive: Wallet
  master: Wallet
  gw: Wallet
  ic: IC
  alice: Wallet
  bob: Wallet
  carol: Wallet
}

export async function teardownClient(
  context: XrplIntegrationTestContext
): Promise<void> {
  if (!context || !context.client) {
    return
  }
  context.client.removeAllListeners()
  return context.client.disconnect()
}

async function connectWithRetry(client: Client, tries = 0): Promise<void> {
  return client.connect().catch(async (error) => {
    if (tries < 10) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(connectWithRetry(client, tries + 1))
        }, 1000)
      })
    }

    throw error
  })
}

export async function setupClient(
  server = serverUrl
): Promise<XrplIntegrationTestContext> {
  const currency = 'USD'
  const context: XrplIntegrationTestContext = {
    client: new Client(server, { timeout: 200000 }),
    notactive: NOT_ACTIVE_WALLET,
    master: MASTER_ACCOUNT_WALLET,
    gw: GW_ACCOUNT_WALLET,
    ic: IC.gw(currency, GW_ACCOUNT_WALLET.classicAddress),
    alice: ALICE_ACCOUNT_WALLET,
    bob: BOB_ACCOUNT_WALLET,
    carol: CAROL_ACCOUNT_WALLET,
  }
  return connectWithRetry(context.client)
    .then(async () => {
      context.client.networkID = await context.client.getNetworkID()
      await fundSystem(context.client, context.master, context.ic)
      return context
    })
    .catch(async (error: unknown) => {
      await teardownClient(context)
      throw error
    })
}
