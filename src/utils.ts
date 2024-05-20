import fs from 'fs'
import path from 'path'
import { SHA256 } from 'crypto-js'

import {
  Client,
  Wallet,
  AccountInfoRequest,
  SetHookFlagsInterface,
  SetHookFlags,
  decodeAccountID,
} from '@transia/xrpl'
import { GlobalFlags } from '@transia/xrpl/dist/npm/models/transactions/common'
import {
  AccountID,
  Currency,
  Amount,
  UInt32,
} from '@transia/ripple-binary-codec/dist/types'
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_MAP,
} from '@transia/ripple-binary-codec'
import { createHash } from 'crypto'

export async function getXRPBalance(
  client: Client,
  wallet: Wallet
): Promise<string> {
  const request: AccountInfoRequest = {
    command: 'account_info',
    account: wallet.classicAddress,
  }
  return (await client.request(request)).result.account_data.Balance
}

const minMantissa = 1000000000000000n
const maxMantissa = 9999999999999999n
const minExponent = -96
const maxExponent = 80

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeXfl(exponent: any, mantissa: any) {
  // convert types as needed
  if (typeof exponent != 'bigint') exponent = BigInt(exponent)

  if (typeof mantissa != 'bigint') mantissa = BigInt(mantissa)

  // canonical zero
  if (mantissa == 0n) return 0n

  // normalize
  const is_negative = mantissa < 0
  if (is_negative) mantissa *= -1n

  while (mantissa > maxMantissa) {
    mantissa /= 10n
    exponent++
  }
  while (mantissa < minMantissa) {
    mantissa *= 10n
    exponent--
  }

  // canonical zero on mantissa underflow
  if (mantissa == 0) return 0n

  // under and overflows
  if (exponent > maxExponent || exponent < minExponent) return -1 // note this is an "invalid" XFL used to propagate errors

  exponent += 97n

  let xfl = !is_negative ? 1n : 0n
  xfl <<= 8n
  xfl |= BigInt(exponent)
  xfl <<= 54n
  xfl |= BigInt(mantissa)

  return xfl
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getExponent(xfl: any) {
  if (xfl < 0n) throw 'Invalid XFL'
  if (xfl == 0n) return 0n
  return ((xfl >> 54n) & 0xffn) - 97n
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMantissa(xfl: any) {
  if (xfl < 0n) throw 'Invalid XFL'
  if (xfl == 0n) return 0n
  return xfl - ((xfl >> 54n) << 54n)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNegative(xfl: any) {
  if (xfl < 0n) throw 'Invalid XFL'
  if (xfl == 0n) return false
  return ((xfl >> 62n) & 1n) == 0n
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toString(xfl: any) {
  if (xfl < 0n) throw 'Invalid XFL'
  if (xfl == 0n) return '<zero>'
  return (
    (isNegative(xfl) ? '-' : '+') +
    getMantissa(xfl).toString() +
    'E' +
    getExponent(xfl).toString()
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function floatToXfl(fl: any) {
  let e = 0
  let d = '' + parseFloat('' + fl)
  d = d.toLowerCase()
  let s = d.split('e')
  if (s.length == 2) {
    e = parseInt(s[1])
    d = s[0]
  }
  s = d.split('.')
  if (s.length == 2) {
    d = d.replace('.', '')
    e -= s[1].length
  } else if (s.length > 2) d = BigInt(0).toString()

  return makeXfl(e, d)
}

export function floatToBEXfl(fl: string): string {
  const xfl = floatToXfl(fl)
  return xfl.toString(16).toUpperCase()
}
export function floatToLEXfl(fl: string): string {
  const xfl = floatToXfl(fl)
  return flipBeLe(xfl as bigint)
}

export function flipBeLe(endian: bigint): string {
  const hexString = endian.toString(16).toUpperCase()
  let flippedHex = ''
  for (let i = hexString.length - 2; i >= 0; i -= 2) {
    flippedHex += hexString.slice(i, i + 2)
  }
  return flippedHex
}

export function flipHex(hexString: string): string {
  let flippedHex = ''
  for (let i = hexString.length - 2; i >= 0; i -= 2) {
    flippedHex += hexString.slice(i, i + 2)
  }
  return flippedHex
}

export function flipEndian(n: number): number {
  // convert the number to an array of 4 elements for 32bit int
  const arr = new Uint8Array(4)

  // insert each byte data to array
  arr[3] = (n >> 24) & 0xff
  arr[2] = (n >> 16) & 0xff
  arr[1] = (n >> 8) & 0xff
  arr[0] = n & 0xff

  //swap the data in the array
  ;[arr[3], arr[0]] = [arr[0], arr[3]]
  ;[arr[2], arr[1]] = [arr[1], arr[2]]

  // perform bit-shifting and OR to get flipped Endian
  const flippedEndian = (arr[3] << 24) | (arr[2] << 16) | (arr[1] << 8) | arr[0]

  return flippedEndian
}

export function intToHex(integer: number, byteLength: number): string {
  const foo = Number(integer)
    .toString(16)
    .padStart(byteLength * 2, '0')
  return foo
}

export function convertSetHookFlagsToNumber(
  flags: SetHookFlagsInterface
): number {
  return reduceFlags(flags, SetHookFlags)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- added ValidationError check for flagEnum
function reduceFlags(flags: GlobalFlags, flagEnum: any): number {
  return Object.keys(flags).reduce((resultFlags, flag) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe member access
    if (flagEnum[flag] == null) {
      throw new Error(
        `flag ${flag} doesn't exist in flagEnum: ${JSON.stringify(flagEnum)}`
      )
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe member access
    // @ts-expect-error - this is defined
    return flags[flag] ? resultFlags | flagEnum[flag] : resultFlags
  }, 0)
}

export function readHookBinaryHexFromNS(filename: string): string {
  const buildPath = process.cwd() + '/' + 'build'
  return wasmToHex(path.resolve(__dirname, `${buildPath}/${filename}.wasm`))
}

export function readJSHookBinaryHexFromNS(filename: string): string {
  const buildPath = process.cwd() + '/' + 'build'
  return wasmToHex(path.resolve(__dirname, `${buildPath}/${filename}.bc`))
}

export function wasmToHex(path: string): string {
  const wasm = fs.readFileSync(path)
  return wasm.toString(`hex`).toUpperCase()
}

export function hexNamespace(hookNamespaceSeed: string): string {
  return SHA256(hookNamespaceSeed).toString().toUpperCase()
}

export function formatAccountBlob(
  addAccts: string[] = [],
  removeAccts: string[] = []
) {
  // encode blob
  let blob = ''
  for (let i = 0; i < addAccts.length; ++i) {
    const entry = addAccts[i]
    blob += '00'
    blob += AccountID.from(entry).toHex()
  }
  for (let i = 0; i < removeAccts.length; ++i) {
    const entry = removeAccts[i]
    blob += '01'
    blob += AccountID.from(entry).toHex()
  }
  return blob
}

export interface ACBlob {
  issuer: string
  currency: string
}

export function formatAccountCurrencyBlob(
  addAccts: ACBlob[] = [],
  removeAccts: ACBlob[] = []
) {
  // encode blob
  let blob = ''
  for (let i = 0; i < addAccts.length; ++i) {
    const entry = addAccts[i]
    blob += '00'
    blob += AccountID.from(entry.issuer).toHex()
    blob += Currency.from(entry.currency).toHex()
  }
  for (let i = 0; i < removeAccts.length; ++i) {
    const entry = removeAccts[i]
    blob += '01'
    blob += AccountID.from(entry.issuer).toHex()
    blob += Currency.from(entry.currency).toHex()
  }
  return blob
}

export function genHash(account: string, amount: Amount, tag?: number) {
  const paddedLength = 73
  const destBytes = decodeAccountID(account)
  const amountBytes = amount.toBytes()

  let dataBytes = Buffer.concat([
    destBytes,
    Buffer.from([tag ? 0x01 : 0x00]),
    UInt32.from(tag || 0)
      .toBytes()
      .slice(0, 4),
    amountBytes,
  ])

  if (dataBytes.length < paddedLength) {
    const padding = Buffer.alloc(paddedLength - dataBytes.length)
    dataBytes = Buffer.concat([dataBytes, padding])
  }

  const hash = createHash('sha512').update(dataBytes).digest()
  return hash.slice(0, 32).toString('hex').toUpperCase()
}

export function generateHash(dataBytes: Buffer) {
  const hash = createHash('sha512').update(dataBytes).digest()
  return hash.slice(0, 32).toString('hex').toUpperCase()
}

export function padHexString(input: string, targetLength = 64): string {
  const paddedString = '0'.repeat(targetLength - input.length) + input
  return paddedString
}

/**
 * @constant tts
 * @description
 * Transaction types
 */

/**
 * @typedef TTS
 * @description
 * Transaction types
 */
export type TTS = typeof TRANSACTION_TYPE_MAP

export function calculateHookOff(arr: Array<keyof TTS>): string {
  let hash =
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  arr.forEach((nth) => {
    if (typeof nth !== 'string') {
      throw new Error(`HookOn transaction type must be string`)
    }
    if (!TRANSACTION_TYPES.includes(String(nth))) {
      throw new Error(
        `invalid transaction type '${String(nth)}' in HookOn array`
      )
    }

    const tts: Record<string, number> = TRANSACTION_TYPE_MAP
    let value = BigInt(hash)
    // eslint-disable-next-line no-bitwise -- Required
    value ^= BigInt(1) << BigInt(tts[nth])
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Required
    hash = `0x${value.toString(16)}`
  })
  hash = hash.replace('0x', '')
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Required
  hash = hash.padStart(64, '0')
  return hash.toUpperCase()
}
