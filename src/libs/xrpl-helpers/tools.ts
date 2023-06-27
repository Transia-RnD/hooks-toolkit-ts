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
} from '@transia/xrpl'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
import { RippleState } from '@transia/xrpl/dist/npm/models/ledger'
import { BaseRequest } from '@transia/xrpl/dist/npm/models/methods/baseMethod'
import { appTransaction } from './transaction'

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
      this.wallet = Wallet.fromSeed('safmpBLsy2paxybRMpvXqFqSrV5HG')
      this.account = this.wallet.classicAddress
    }
    if (name === 'notactivated') {
      this.wallet = Wallet.fromSeed('snqPCkCnfAbK4p981HZZGMj8SnhZ7')
      this.account = this.wallet.classicAddress
    }
    if (name === 'alice') {
      this.wallet = Wallet.fromSeed('ssbTMHrmEJP7QEQjWJH3a72LQipBM')
      this.account = this.wallet.classicAddress
    }
    if (name === 'bob') {
      this.wallet = Wallet.fromSeed('spkcsko6Ag3RbCSVXV2FJ8Pd4Zac1')
      this.account = this.wallet.classicAddress
    }
    if (name === 'carol') {
      this.wallet = Wallet.fromSeed('snzb83cV8zpLPTE4nQamoLP9pbhB7')
      this.account = this.wallet.classicAddress
    }
    if (name === 'dave') {
      this.wallet = Wallet.fromSeed('sh2Q7wDfjdvyVaVHEE8JT3C9osGFD')
      this.account = this.wallet.classicAddress
    }
    if (name === 'elsa') {
      this.wallet = Wallet.fromSeed('sEdTeiqmPdUob32gyD6vPUskq1Z7TP3')
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
  } catch (error: any) {
    console.log(error.message)
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
      console.log(error.message)
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
      console.log(error.message)
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
      
      await appTransaction(ctx, builtTx, wallet, {
        hardFail: true,
        count: 1,
        delayMs: 1000,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
      console.log(error.data?.decoded)
      console.log(error.data?.tx)
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
      await appTransaction(ctx, builtTx, signer, {
        hardFail: true,
        count: 1,
        delayMs: 1000,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
      console.log(error.data?.decoded)
      console.log(error.data?.tx)
      throw error
    }
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
      }
      await appTransaction(ctx, builtTx, acct, {
        hardFail: true,
        count: 1,
        delayMs: 1000,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.data?.decoded)
      console.log(error.data?.tx)
      throw error
    }
  }
}

export async function accountSet(ctx: Client, account: Wallet): Promise<void> {
  const builtTx: AccountSet = {
    TransactionType: 'AccountSet',
    Account: account.classicAddress as string,
    TransferRate: 0,
    Domain: convertStringToHex('https://usd.transia.io'),
    SetFlag: AccountSetAsfFlags.asfDefaultRipple,
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
