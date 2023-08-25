import { encodeModel } from './utils/encode'
import { decodeModel } from './utils/decode'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModelClass<T extends BaseModel> = new (...args: any[]) => T

export type MetadataElement<T extends BaseModel> = {
  field: string
  type:
    | 'uint8'
    | 'uint32'
    | 'uint64'
    | 'uint224'
    | 'hash256'
    | 'varString'
    | 'xfl'
    | 'currency'
    | 'xrpAddress'
    | 'model'
    | 'varModelArray'
  maxStringLength?: number
  modelClass?: ModelClass<T>
  metadata?: Metadata<T>
  maxArrayLength?: number
}

export type Metadata<T extends BaseModel = BaseModel> = MetadataElement<T>[]

export abstract class BaseModel {
  abstract getMetadata(): Metadata

  encode(): string {
    return encodeModel(this)
  }

  static decode<T extends BaseModel>(
    hex: string,
    modelClass: ModelClass<T>
  ): T {
    return decodeModel(hex, modelClass)
  }

  /**
   * Used for decoding a model
   * @param modelClass
   * @returns modelClass's encoded hex length
   */
  static getHexLength<T extends BaseModel>(modelClass: ModelClass<T>): number {
    const metadata = modelClass.prototype.getMetadata()
    let length = 0

    for (const {
      type,
      maxStringLength,
      modelClass: fieldModelClass,
    } of metadata) {
      switch (type) {
        case 'uint8':
          length += 2
          break
        case 'uint32':
          length += 8
          break
        case 'uint64':
          length += 16
          break
        case 'uint224':
          length += 56
          break
        case 'hash256':
          length += 64
          break
        case 'varString':
          if (maxStringLength === undefined) {
            throw Error('maxStringLength is required for type varString')
          }
          length += maxStringLength * 2 + (maxStringLength <= 2 ** 8 ? 2 : 4)
          break
        case 'xfl':
          length += 16
        case 'currency':
          length += 40
          break
        case 'xrpAddress':
          length += 40
          break
        case 'model':
          length += BaseModel.getHexLength(fieldModelClass)
          break
        case 'varModelArray':
          throw Error(
            "varModelArray hex length doesn't need to be computed for this application; only its model elements only do. However, this will fail if getHexLength is called on a model that contains a varModelArray. Will need to be updated if this is ever needed."
          )
        default:
          throw Error(`Unknown type: ${type}`)
      }
    }

    return length
  }

  /**
   * Used for decoding a model
   * @param modelClass
   * @returns modelClass's encoded hex length
   */
  static getHexLengthMeta<T extends BaseModel>(metadata: Metadata<T>): number {
    // const metadata = modelClass.prototype.getMetadata()
    let length = 0

    for (const { type, maxStringLength, metadata: modelMetadata } of metadata) {
      switch (type) {
        case 'uint8':
          length += 2
          break
        case 'uint32':
          length += 8
          break
        case 'uint64':
          length += 16
          break
        case 'uint224':
          length += 56
          break
        case 'hash256':
          length += 64
          break
        case 'varString':
          if (maxStringLength === undefined) {
            throw Error('maxStringLength is required for type varString')
          }
          length += maxStringLength * 2 + (maxStringLength <= 2 ** 8 ? 2 : 4)
          break
        case 'xfl':
          length += 16
          break
        case 'currency':
          length += 40
          break
        case 'xrpAddress':
          length += 40
          break
        case 'model':
          length += BaseModel.getHexLengthMeta(modelMetadata)
          break
        case 'varModelArray':
          throw Error(
            "varModelArray hex length doesn't need to be computed for this application; only its model elements only do. However, this will fail if getHexLength is called on a model that contains a varModelArray. Will need to be updated if this is ever needed."
          )
        default:
          throw Error(`Unknown type: ${type}`)
      }
    }

    return length
  }

  /**
   * Used for decoding a model
   * @param modelClass
   * @returns modelClass's encoded hex length
   */
  private static createEmpty<T extends BaseModel>(
    modelClass: ModelClass<T>
  ): T {
    const modelArgs = modelClass.prototype
      .getMetadata()
      .map((metadata: MetadataElement<T>) => {
        switch (metadata.type) {
          case 'uint8':
            return 0
          case 'uint32':
            return 0
          case 'uint64':
            return BigInt(0)
          case 'uint224':
            return BigInt(0)
          case 'hash256':
            return ''
          case 'varString':
            return ''
          case 'xfl':
            return BigInt(0)
          case 'currency':
            return ''
          case 'varString':
            return ''
          case 'xrpAddress':
            return ''
          case 'model':
            if (metadata.modelClass === undefined) {
              throw Error('modelClass is required for type model')
            }
            return BaseModel.createEmpty(metadata.modelClass)
          default:
            throw Error(`Unknown type: ${metadata.type}`)
        }
      })
    return new modelClass(...modelArgs)
  }
}
