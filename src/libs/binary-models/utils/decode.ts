import { convertHexToString, encodeAccountID } from '@transia/xrpl'
import { BaseModel, Metadata, ModelClass } from '../BaseModel'
import { lengthToHex } from './encode'
import {
  UInt8,
  UInt32,
  UInt64,
  UInt224,
  VarString,
  XFL,
  Currency,
  XRPAddress,
} from './types'
import { flipHex, toString } from '../../../utils'

export function decodeModel<T extends BaseModel>(
  hex: string,
  modelClass: ModelClass<T>
): T {
  const metadata = modelClass.prototype.getMetadata()
  const model = new modelClass()

  let hexIndex = 0
  let decodedField = null
  for (const {
    field,
    type,
    maxStringLength,
    modelClass: fieldModelClass,
  } of metadata) {
    let fieldHex = ''
    switch (type) {
      case 'uint8':
        fieldHex = hex.slice(hexIndex, hexIndex + 2)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 2
        break
      case 'uint32':
        fieldHex = hex.slice(hexIndex, hexIndex + 8)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 8
        break
      case 'uint64':
        fieldHex = hex.slice(hexIndex, hexIndex + 16)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 16
        break
      case 'uint224':
        fieldHex = hex.slice(hexIndex, hexIndex + 56)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 56
        break
      case 'hash256':
        fieldHex = hex.slice(hexIndex, hexIndex + 64)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 64
        break
      case 'publicKey':
        fieldHex = hex.slice(hexIndex, hexIndex + 66)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 66
        break
      case 'varString':
        if (maxStringLength === undefined) {
          throw Error('maxStringLength is required for type varString')
        }
        const prefixLengthHex = maxStringLength <= 2 ** 8 ? 2 : 4
        const length = prefixLengthHex + maxStringLength * 2
        fieldHex = hex.slice(hexIndex, hexIndex + length)
        decodedField = decodeField(fieldHex, type, maxStringLength)
        hexIndex += length
        break
      case 'xfl':
        fieldHex = hex.slice(hexIndex, hexIndex + 16)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 16
        break
      case 'currency':
        fieldHex = hex.slice(hexIndex, hexIndex + 40)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 40
        break
      case 'xrpAddress':
        fieldHex = hex.slice(hexIndex, hexIndex + 40)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 40
        break
      case 'model':
        if (fieldModelClass === undefined) {
          throw Error('modelClass is required for type model')
        }
        const modelHexLength = BaseModel.getHexLength(fieldModelClass)
        fieldHex = hex.slice(hexIndex, hexIndex + modelHexLength)
        decodedField = decodeModel(fieldHex, fieldModelClass)
        hexIndex += modelHexLength
        break
      case 'varModelArray':
        if (fieldModelClass === undefined) {
          throw Error('modelClass is required for type varModelArray')
        }
        const lengthHex = hex.slice(hexIndex, hexIndex + 2)
        const varModelArrayLength = hexToUInt8(lengthHex)
        hexIndex += 2
        const modelArray: (typeof fieldModelClass)[] = []
        for (let i = 0; i < varModelArrayLength; i++) {
          const modelHexLength = BaseModel.getHexLength(fieldModelClass)
          fieldHex = hex.slice(hexIndex, hexIndex + modelHexLength)
          const decodedVaModelArrayElement = decodeModel(
            fieldHex,
            fieldModelClass
          )
          modelArray.push(decodedVaModelArrayElement)
          hexIndex += modelHexLength
        }
        decodedField = modelArray
        break
      default:
        throw Error(`Unknown type: ${type}`)
    }

    // Add decoded field to model
    // @ts-expect-error - this is functionally correct
    model[field] = decodedField
  }

  return model
}

export function decodeMetadata(
  hex: string,
  metadata: Metadata
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model: Record<string, any> = {}
  let hexIndex = 0
  let decodedField = null
  for (const {
    field,
    type,
    maxStringLength,
    metadata: modelMetadata,
  } of metadata) {
    let fieldHex = ''
    switch (type) {
      case 'uint8':
        fieldHex = hex.slice(hexIndex, hexIndex + 2)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 2
        break
      case 'uint32':
        fieldHex = hex.slice(hexIndex, hexIndex + 8)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 8
        break
      case 'uint64':
        fieldHex = hex.slice(hexIndex, hexIndex + 16)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 16
        break
      case 'uint224':
        fieldHex = hex.slice(hexIndex, hexIndex + 56)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 56
        break
      case 'hash256':
        fieldHex = hex.slice(hexIndex, hexIndex + 64)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 64
        break
      case 'publicKey':
        fieldHex = hex.slice(hexIndex, hexIndex + 66)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 66
        break
      case 'varString':
        if (maxStringLength === undefined) {
          throw Error('maxStringLength is required for type varString')
        }
        const prefixLengthHex = maxStringLength <= 2 ** 8 ? 2 : 4
        const length = prefixLengthHex + maxStringLength * 2
        fieldHex = hex.slice(hexIndex, hexIndex + length)
        decodedField = decodeField(fieldHex, type, maxStringLength)
        hexIndex += length
        break
      case 'xfl':
        fieldHex = hex.slice(hexIndex, hexIndex + 16)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 16
        break
      case 'currency':
        fieldHex = hex.slice(hexIndex, hexIndex + 40)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 40
        break
      case 'xrpAddress':
        fieldHex = hex.slice(hexIndex, hexIndex + 40)
        decodedField = decodeField(fieldHex, type)
        hexIndex += 40
        break
      case 'model':
        if (modelMetadata === undefined) {
          throw Error('modelClass is required for type model')
        }
        const modelHexLength = BaseModel.getHexLengthMeta(modelMetadata)
        fieldHex = hex.slice(hexIndex, hexIndex + modelHexLength)
        decodedField = decodeMetadata(fieldHex, modelMetadata)
        hexIndex += modelHexLength
        break
      case 'varModelArray':
        if (modelMetadata === undefined) {
          throw Error('modelClass is required for type varModelArray')
        }
        const lengthHex = hex.slice(hexIndex, hexIndex + 2)
        const varModelArrayLength = hexToUInt8(lengthHex)
        hexIndex += 2
        const modelArray: (typeof modelMetadata)[] = []
        for (let i = 0; i < varModelArrayLength; i++) {
          const modelHexLength = BaseModel.getHexLengthMeta(modelMetadata)
          fieldHex = hex.slice(hexIndex, hexIndex + modelHexLength)
          const decodedVaModelArrayElement = decodeMetadata(
            fieldHex,
            modelMetadata
          )
          // @ts-expect-error - this is functionally correct
          modelArray.push(decodedVaModelArrayElement)
          hexIndex += modelHexLength
        }
        decodedField = modelArray
        break
      default:
        throw Error(`Unknown type: ${type}`)
    }
    // Add decoded field to model
    model[field] = decodedField
  }

  return model
}

function decodeField(
  hex: string,
  type: string,
  maxStringLength?: number
): unknown {
  switch (type) {
    case 'uint8':
      return hexToUInt8(hex)
    case 'uint32':
      return hexToUInt32(hex)
    case 'uint64':
      return hexToUInt64(hex)
    case 'uint224':
      return hexToUInt224(hex)
    case 'hash256':
      return hex
    case 'publicKey':
      return hex
    case 'varString':
      if (maxStringLength === undefined) {
        throw Error('maxStringLength is required for type varString')
      }
      return hexToVarString(hex, maxStringLength)
    case 'xfl':
      return hexToXfl(hex)
    case 'currency':
      return hexToCurrency(hex)
    case 'xrpAddress':
      return hexToXRPAddress(hex)
    case 'model':
      throw Error('model type should be handled by decodeModel')
    case 'varModelArray':
      throw Error('varModelArray type should be handled by decodeModel')
    default:
      throw Error(`Unknown type: ${type}`)
  }
}

export function hexToUInt8(hex: string): UInt8 {
  return parseInt(hex, 16)
}

export function hexToUInt32(hex: string): UInt32 {
  return parseInt(hex, 16)
}

export function hexToUInt64(hex: string): UInt64 {
  return BigInt(`0x${hex}`)
}

export function hexToUInt224(hex: string): UInt224 {
  return BigInt(`0x${hex}`)
}

function hexToVarStringLength(hex: string, maxStringLength: number): number {
  if (maxStringLength <= 2 ** 8) {
    // 1-byte length
    return parseInt(hex.slice(0, 2), 16)
  } else if (maxStringLength <= 2 ** 16) {
    // 2-byte length
    return parseInt(hex.slice(0, 4), 16)
  }
  throw Error('maxStringLength exceeds 2 bytes')
}

export function hexToVarString(
  hex: string,
  maxStringLength: number
): VarString {
  const length = hexToVarStringLength(hex, maxStringLength)
  const prefixLength = lengthToHex(length, maxStringLength)
  const content = hex.slice(prefixLength.length)
  return Buffer.from(content, 'hex').toString('utf8').slice(0, length)
}

export function hexToXfl(hex: string): XFL {
  if (hex === '0000000000000000') {
    return 0
  }
  const value = flipHex(hex)
  const xfl = hexToUInt64(value.slice(0, 16))
  return parseFloat(toString(xfl))
}

export function hexToCurrency(hex: string): Currency {
  const cleanHex = hex.replace(/0/g, ' ').trim().replace(/ /g, '0')
  const value = convertHexToString(cleanHex)
  return value.replace(/\0[\s\S]*$/g, '')
}

export function hexToXRPAddress(hex: string): XRPAddress {
  const value = encodeAccountID(Buffer.from(hex, 'hex'))
  return value.slice(0, 40)
}
