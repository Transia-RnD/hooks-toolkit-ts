import { Client, Wallet } from '@transia/xrpl'

import serverUrl from './serverUrl'
import {
  NOT_ACTIVE_WALLET,
  MASTER_WALLET,
  GW_WALLET,
  ALICE_WALLET,
  BOB_WALLET,
  CAROL_WALLET,
  DAVE_WALLET,
  ELSA_WALLET,
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
  dave: Wallet
  elsa: Wallet
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
    master: MASTER_WALLET,
    gw: GW_WALLET,
    ic: IC.gw(currency, GW_WALLET.classicAddress),
    alice: ALICE_WALLET,
    bob: BOB_WALLET,
    carol: CAROL_WALLET,
    dave: DAVE_WALLET,
    elsa: ELSA_WALLET,
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
