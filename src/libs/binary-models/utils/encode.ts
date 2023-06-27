import { BaseModel } from '../BaseModel'
import { UInt8, UInt32, UInt64, UInt224, VarString, XRPAddress } from './types'

export function encodeModel<T extends BaseModel>(model: T): string {
  const metadata = model.getMetadata()

  let result = ''
  for (const { field, type, maxStringLength, maxArrayLength } of metadata) {
    // @ts-expect-error -- this is functional
    const fieldValue = model[field]
    if (fieldValue === undefined) {
      throw Error(`Field ${field} is undefined in model`)
    }

    let encodedField = ''
    if (type === 'model') {
      encodedField = encodeModel(fieldValue as BaseModel)
    } else if (type == 'varModelArray') {
      if (maxArrayLength === undefined) {
        throw Error('maxArrayLength is required for type varModelArray')
      }
      if (fieldValue.length > 0 && fieldValue.length > maxArrayLength) {
        throw Error(
          `${field} varModelArray length ${fieldValue.length} exceeds maxArrayLength ${maxArrayLength} for model ${fieldValue[0].constructor.name}`
        )
      }
      const modelArray = fieldValue as T[]
      const lengthHex = lengthToHex(modelArray.length, 2 ** 8) // 1-byte max length
      encodedField = lengthHex
      for (const model of modelArray) {
        encodedField += encodeModel(model)
      }
    } else {
      encodedField = encodeField(fieldValue, type, maxStringLength)
    }

    result += encodedField
  }

  return result
}

function encodeField(
  fieldValue: unknown,
  type: string,
  maxStringLength?: number
): string {
  switch (type) {
    case 'bool':
      return uint8ToHex(fieldValue as UInt8)
    case 'uint8':
      return uint8ToHex(fieldValue as UInt8)
    case 'uint32':
      return uint32ToHex(fieldValue as UInt32)
    case 'uint64':
      return uint64ToHex(fieldValue as UInt64)
    case 'uint224':
      return uint224ToHex(fieldValue as UInt224)
    case 'varString':
      if (maxStringLength === undefined) {
        throw Error('maxStringLength is required for type varString')
      }
      return varStringToHex(fieldValue as string, maxStringLength)
    case 'xrpAddress':
      return xrpAddressToHex(fieldValue as XRPAddress)
    case 'model':
      throw Error('model type should be handled in encodeModel')
    case 'varModelArray':
      throw Error('varModelArray type should be handled in encodeModel')
    default:
      throw Error(`Unknown type: ${type}`)
  }
}

export function uint8ToHex(value: UInt8): string {
  if (value < 0 || value > 255) {
    throw Error(`Integer ${value} is out of range for uint8 (0-255)`)
  }
  return value.toString(16).padStart(2, '0').toUpperCase()
}

export function uint32ToHex(value: UInt32): string {
  if (value < 0 || value > 2 ** 32 - 1) {
    throw Error(`Integer ${value} is out of range for uint32 (0-4294967295)`)
  }
  return value.toString(16).padStart(8, '0').toUpperCase()
}

export function uint64ToHex(value: UInt64): string {
  if (value < 0 || value > BigInt(18446744073709551615n)) {
    throw Error(
      `Integer ${value} is out of range for uint64 (0-18446744073709551615)`
    )
  }
  return value.toString(16).padStart(16, '0').toUpperCase()
}

export function uint224ToHex(value: UInt224): string {
  if (
    value < 0 ||
    value >
      BigInt(
        26959946667150639794667015087019630673637144422540572481103610249215n
      )
  ) {
    throw Error(
      `Integer ${value} is out of range for uint224 (0-26959946667150639794667015087019630673637144422540572481103610249215)`
    )
  }
  return value.toString(16).padStart(56, '0').toUpperCase()
}

export function lengthToHex(value: number, maxStringLength: number): string {
  if (maxStringLength <= 2 ** 8) {
    // 1-byte length
    return value.toString(16).padStart(2, '0')
  } else if (maxStringLength <= 2 ** 16) {
    // 2-byte length
    return value.toString(16).padStart(4, '0')
  }
  throw Error('maxStringLength exceeds 2 bytes')
}

export function varStringToHex(
  value: VarString,
  maxStringLength: number
): string {
  if (value.length > maxStringLength) {
    throw Error(
      `String length ${value.length} exceeds max length of ${maxStringLength}`
    )
  }
  const prefixLength = lengthToHex(value.length, maxStringLength)
  const content = Buffer.from(value, 'utf8').toString('hex')
  const paddedContent = content.padEnd(maxStringLength * 2, '0')
  return (prefixLength + paddedContent).toUpperCase()
}

export function xrpAddressToHex(value: XRPAddress): string {
  if (value.length > 35) {
    throw Error(`XRP address length ${value.length} exceeds 35 characters`)
  }
  if (value.length < 25) {
    throw Error(`XRP address length ${value.length} is less than 25 characters`)
  }
  const length = uint8ToHex(value.length)
  const content = Buffer.from(value, 'utf8').toString('hex')
  return (length + content.padEnd(70, '0')).toUpperCase() // 35 * 2 = 70
}
