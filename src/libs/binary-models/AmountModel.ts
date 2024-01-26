import { BaseModel, Metadata } from './BaseModel'
import { Currency, XFL, XRPAddress } from './utils'

export class AmountModel extends BaseModel {
  value: XFL
  currency: Currency
  issuer: XRPAddress

  // 48 bytes
  constructor(
    value: XFL, // 8 byte / 0
    currency: Currency, // 20 byte / 8
    issuer: XRPAddress // 20 byte / 28
  ) {
    super()
    this.value = value
    this.currency = currency
    this.issuer = issuer
  }

  getMetadata(): Metadata {
    return [
      { field: 'value', type: 'xfl' },
      { field: 'currency', type: 'currency' },
      { field: 'issuer', type: 'xrpAddress' },
    ]
  }

  toJSON() {
    return {
      value: this.value,
      currency: this.currency,
      issuer: this.issuer,
    }
  }
}
