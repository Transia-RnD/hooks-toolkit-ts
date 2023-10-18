import {
  Client,
  Wallet,
  Payment,
  TrustSet,
  AccountSet,
  AccountSetAsfFlags,
  xrpToDrops,
  LedgerEntryRequest,
  AccountInfoRequest,
  convertStringToHex,
  Transaction,
  OfferCreate,
  OfferCreateFlags,
} from '@transia/xrpl'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
import { RippleState } from '@transia/xrpl/dist/npm/models/ledger'
import { BaseRequest } from '@transia/xrpl/dist/npm/models/methods/baseMethod'
import { appTransaction } from './transaction'
import { appLogger } from '../logger'
import {
  ALICE_WALLET,
  BOB_WALLET,
  CAROL_WALLET,
  DAVE_WALLET,
  ELSA_WALLET,
  FRANK_WALLET,
  GRACE_WALLET,
  GW_WALLET,
  HEIDI_WALLET,
  HOOK1_WALLET,
  HOOK2_WALLET,
  HOOK3_WALLET,
  HOOK4_WALLET,
  HOOK5_WALLET,
  IVAN_WALLET,
  JUDY_WALLET,
  NOT_ACTIVE_WALLET,
} from './constants'

const LEDGER_ACCEPT_REQUEST = { command: 'ledger_accept' } as BaseRequest

export class Account {
  name: string
  account: string | undefined
  wallet: Wallet

  constructor(name?: string, seed?: string) {
    this.wallet = Wallet.generate()
    this.account = this.wallet.classicAddress
    if (seed) {
      this.wallet = Wallet.fromSeed(seed)
      this.account = this.wallet.classicAddress
    }

    this.name = name as string
    if (name === 'gw') {
      this.wallet = GW_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'notactivated') {
      this.wallet = NOT_ACTIVE_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'alice') {
      this.wallet = ALICE_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'bob') {
      this.wallet = BOB_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'carol') {
      this.wallet = CAROL_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'dave') {
      this.wallet = DAVE_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'elsa') {
      this.wallet = ELSA_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'frank') {
      this.wallet = FRANK_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'grace') {
      this.wallet = GRACE_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'heidi') {
      this.wallet = HEIDI_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'ivan') {
      this.wallet = IVAN_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'judy') {
      this.wallet = JUDY_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'hook1') {
      this.wallet = HOOK1_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'hook2') {
      this.wallet = HOOK2_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'hook3') {
      this.wallet = HOOK3_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'hook4') {
      this.wallet = HOOK4_WALLET
      this.account = this.wallet.classicAddress
    }
    if (name === 'hook5') {
      this.wallet = HOOK5_WALLET
      this.account = this.wallet.classicAddress
    }
  }
}

export class ICXRP {
  issuer: string | undefined
  currency = 'XRP'
  value: number
  amount: string

  constructor(value: number) {
    this.value = value
    this.amount = xrpToDrops(value)
  }
}

export class IC {
  issuer: string | undefined
  currency: string | undefined
  value: number | undefined
  amount: Record<string, string | number> | undefined

  static gw(name: string, gw: string): IC {
    // TODO: symbolToHex(name);
    return new IC(gw, name, 0)
  }

  constructor(issuer: string, currency: string, value: number) {
    this.issuer = issuer
    this.currency = currency
    this.value = value
    this.amount = {
      issuer: this.issuer,
      currency: this.currency,
      value: String(this.value),
    }
  }

  set(value: number): IC {
    this.value = value
    this.amount = {
      issuer: this.issuer as string,
      currency: this.currency as string,
      value: String(this.value),
    }
    return this
  }
}

export async function accountSeq(
  ctx: Client,
  account: string
): Promise<number> {
  const request: AccountInfoRequest = {
    command: 'account_info',
    account: account as string,
  }
  try {
    const response = await ctx.request(request)
    return response.result.account_data.Sequence
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // appLogger.debug(error.message)
    return 0
  }
}

export async function xrpBalance(
  ctx: Client,
  account: string
): Promise<number> {
  const request: AccountInfoRequest = {
    command: 'account_info',
    account: account as string,
  }
  const response = await ctx.request(request)
  if (
    'error' in response.result &&
    response.result['error'] === 'actNotFound'
  ) {
    return 0
  }
  return parseFloat(response.result.account_data.Balance)
}

export async function icBalance(
  ctx: Client,
  account: string,
  ic: IC
): Promise<number> {
  const request: LedgerEntryRequest = {
    command: 'ledger_entry',
    ripple_state: {
      currency: ic.currency as string,
      accounts: [account as string, ic.issuer as string],
    },
  }
  const response = await ctx.request(request)
  if ('error' in response.result) {
    return 0
  }
  const node = response.result.node as RippleState
  return Math.abs(parseFloat(node.Balance.value))
}

export async function balance(
  ctx: Client,
  account: string,
  ic?: IC
): Promise<number> {
  try {
    if (!ic) {
      return await xrpBalance(ctx, account)
    }
    return await icBalance(ctx, account, ic)
  } catch (error: unknown) {
    if (error instanceof Error) {
      // appLogger.debug(error.message)
      return 0
    }
    return 0
  }
}

export async function limit(
  ctx: Client,
  account: string,
  ic: IC
): Promise<number> {
  try {
    const request: LedgerEntryRequest = {
      command: 'ledger_entry',
      ripple_state: {
        currency: ic.currency as string,
        accounts: [account as string, ic.issuer as string],
      },
    }
    // const isHighLimit =
    //   decodeAccountID(ic.issuer as string) <
    //   decodeAccountID(account.classicAddress as string)
    const response = await ctx.request(request)
    if ('error' in response.result) {
      return 0
    }
    const node = response.result.node as RippleState
    if (node.HighLimit.issuer === (ic.issuer as string)) {
      return parseFloat(node.LowLimit.value)
    } else {
      return parseFloat(node.HighLimit.value)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // appLogger.debug(error.message)
      return 0
    }
    return 0
  }
}

export async function fund(
  ctx: Client,
  wallet: Wallet,
  uicx: IC | ICXRP,
  ...accts: string[]
): Promise<void> {
  for (const acct of accts) {
    try {
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: wallet.classicAddress,
        Destination: acct as string,
        Amount: uicx.amount as unknown as IssuedCurrencyAmount,
      }

      const response = await appTransaction(ctx, builtTx, wallet, {
        hardFail: true,
        count: 1,
        delayMs: 1000,
      })
      appLogger.debug(JSON.stringify(response))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      appLogger.debug(error)
      appLogger.debug(error.data?.decoded)
      appLogger.debug(error.data?.tx)
    }
  }
}

export async function pay(
  ctx: Client,
  uicx: IC | ICXRP,
  signer: Wallet,
  ...accts: string[]
): Promise<void> {
  for (const acct of accts) {
    try {
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: signer.classicAddress,
        Destination: acct as string,
        Amount: uicx.amount as unknown as IssuedCurrencyAmount,
      }
      const response = await appTransaction(ctx, builtTx, signer, {
        hardFail: true,
        count: 1,
        delayMs: 1000,
      })
      appLogger.debug(JSON.stringify(response))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      appLogger.debug(error)
      appLogger.debug(error.data?.decoded)
      appLogger.debug(error.data?.tx)
      throw error
    }
  }
}

export async function sell(
  ctx: Client,
  uicx: IC | ICXRP,
  signer: Wallet,
  rate: number
): Promise<void> {
  try {
    // 1, 2 = 1 *, 1 /
    const takerGets: IssuedCurrencyAmount = {
      value: String(uicx.value),
      currency: uicx.currency,
      issuer: uicx.issuer,
    }
    const builtTx: OfferCreate = {
      TransactionType: 'OfferCreate',
      Account: signer.classicAddress,
      TakerGets: takerGets,
      TakerPays: xrpToDrops(String(rate * uicx.value)),
      Flags: OfferCreateFlags.tfSell,
      NetworkID: ctx.networkID,
    }
    const response = await appTransaction(ctx, builtTx, signer, {
      hardFail: true,
      count: 1,
      delayMs: 1000,
    })
    appLogger.debug(JSON.stringify(response))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    appLogger.debug(error)
    appLogger.debug(error.data?.decoded)
    appLogger.debug(error.data?.tx)
    throw error
  }
}

export async function buy(
  ctx: Client,
  uicx: IC | ICXRP,
  signer: Wallet,
  rate: number
): Promise<void> {
  try {
    // 1, 2 = 1 *, 1 /
    const takerPays: IssuedCurrencyAmount = {
      value: String(uicx.value),
      currency: uicx.currency,
      issuer: uicx.issuer,
    }
    const builtTx: OfferCreate = {
      TransactionType: 'OfferCreate',
      Account: signer.classicAddress,
      TakerGets: xrpToDrops(String(rate * uicx.value)),
      TakerPays: takerPays,
      NetworkID: ctx.networkID,
    }
    const response = await appTransaction(ctx, builtTx, signer, {
      hardFail: true,
      count: 1,
      delayMs: 1000,
    })
    appLogger.debug(JSON.stringify(response))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    appLogger.debug(error)
    appLogger.debug(error.data?.decoded)
    appLogger.debug(error.data?.tx)
    throw error
  }
}

export async function trust(
  ctx: Client,
  uicx: IC | ICXRP,
  ...accts: Wallet[]
): Promise<void> {
  for (const acct of accts) {
    try {
      const builtTx: TrustSet = {
        TransactionType: 'TrustSet',
        Account: acct.classicAddress as string,
        LimitAmount: uicx.amount as unknown as IssuedCurrencyAmount,
        NetworkID: ctx.networkID,
      }
      const response = await appTransaction(ctx, builtTx, acct, {
        hardFail: true,
        count: 1,
        delayMs: 1000,
      })
      appLogger.debug(JSON.stringify(response))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      appLogger.debug(error.data?.decoded)
      appLogger.debug(error.data?.tx)
      throw error
    }
  }
}

export async function accountSet(
  ctx: Client,
  account: Wallet,
  flag: AccountSetAsfFlags
): Promise<void> {
  const builtTx: AccountSet = {
    TransactionType: 'AccountSet',
    Account: account.classicAddress as string,
    TransferRate: 0,
    Domain: convertStringToHex('https://usd.transia.io'),
    SetFlag: flag,
    NetworkID: ctx.networkID,
  }
  const response = await appTransaction(ctx, builtTx, account, {
    hardFail: true,
    count: 1,
    delayMs: 1000,
  })
  appLogger.debug(JSON.stringify(response))
}

export async function accountClear(
  ctx: Client,
  account: Wallet,
  flag: AccountSetAsfFlags
): Promise<void> {
  const builtTx: AccountSet = {
    TransactionType: 'AccountSet',
    Account: account.classicAddress as string,
    TransferRate: 0,
    Domain: convertStringToHex('https://usd.transia.io'),
    ClearFlag: flag,
    NetworkID: ctx.networkID,
  }
  await appTransaction(ctx, builtTx, account, {
    hardFail: true,
    count: 1,
    delayMs: 1000,
  })
}

export async function rpcTx(
  ctx: Client,
  account: Wallet,
  json: Record<string, unknown>
): Promise<void> {
  await appTransaction(ctx, json as unknown as Transaction, account, {
    hardFail: true,
    count: 1,
    delayMs: 1000,
  })
}

export async function rpc(
  ctx: Client,
  json: Record<string, unknown>
): Promise<void> {
  ctx.request(json as BaseRequest)
}

export async function close(ctx: Client): Promise<void> {
  await ctx.request(LEDGER_ACCEPT_REQUEST)
}
