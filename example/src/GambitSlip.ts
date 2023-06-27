import { BaseModel, Metadata, UInt8, UInt64 } from 'hooks-library/dist/npm/src'

export class GambitSlip extends BaseModel {
  position: UInt8
  value: UInt64
  win: UInt64
  toSeal: UInt64
  executed: UInt8
  refunded: UInt8

  constructor(
    position: UInt8,
    value: UInt64,
    win: UInt64,
    toSeal: UInt64,
    executed: UInt8,
    refunded: UInt8
  ) {
    super()
    this.position = position
    this.value = value
    this.win = win
    this.toSeal = toSeal
    this.executed = executed
    this.refunded = refunded
  }

  getMetadata(): Metadata {
    return [
      { field: 'position', type: 'uint8' },
      { field: 'value', type: 'uint64' },
      { field: 'win', type: 'uint64' },
      { field: 'toSeal', type: 'uint64' },
      { field: 'executed', type: 'uint8' },
      { field: 'refunded', type: 'uint8' },
    ]
  }

  toJSON() {
    return {
      position: this.position,
      value: this.value,
      win: this.win,
      toSeal: this.toSeal,
      executed: this.executed,
      refunded: this.refunded,
    }
  }
}
