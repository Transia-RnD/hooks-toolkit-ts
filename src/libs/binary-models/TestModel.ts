import { BaseModel, Metadata } from './BaseModel'
import { UInt64, VarString } from './utils/types'

export class TestModel extends BaseModel {
  updatedTime: UInt64
  updatedBy: VarString
  message: VarString

  constructor(updatedTime: UInt64, updatedBy: VarString, message: VarString) {
    super()
    this.updatedTime = updatedTime
    this.updatedBy = updatedBy
    this.message = message
  }

  getMetadata(): Metadata {
    return [
      { field: 'updatedTime', type: 'uint64' },
      { field: 'updatedBy', type: 'varString', maxStringLength: 32 },
      { field: 'message', type: 'varString', maxStringLength: 250 },
    ]
  }

  toJSON() {
    return {
      updatedTime: this.updatedTime,
      updatedBy: this.updatedBy,
      message: this.message,
    }
  }
}
