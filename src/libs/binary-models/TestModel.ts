import { BaseModel, Metadata } from './BaseModel'
import { UInt64, VarString } from './utils/types'

export class TestModel extends BaseModel {
  updatedTime: UInt64
  message: VarString

  constructor(updatedTime: UInt64, message: VarString) {
    super()
    this.updatedTime = updatedTime
    this.message = message
  }

  getMetadata(): Metadata {
    return [
      { field: 'updatedTime', type: 'uint64' },
      { field: 'message', type: 'varString', maxStringLength: 20 },
    ]
  }

  toJSON() {
    return {
      updatedTime: this.updatedTime,
      message: this.message,
    }
  }
}
