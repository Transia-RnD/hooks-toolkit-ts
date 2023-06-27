import {
  BaseModel,
  Metadata,
  UInt8,
  UInt64,
  VarString,
} from 'hooks-library/dist/npm/src'

export class GambitBet extends BaseModel {
  state: UInt8
  odd: UInt64
  outcome: VarString
  winningPosition: UInt8

  constructor(
    state: UInt8,
    odd: UInt64,
    outcome: VarString,
    winningPosition: UInt8
  ) {
    super()
    this.state = state
    this.odd = odd
    this.outcome = outcome
    this.winningPosition = winningPosition
  }

  getMetadata(): Metadata {
    return [
      { field: 'state', type: 'uint8' },
      { field: 'odd', type: 'uint64' },
      { field: 'outcome', type: 'varString', maxStringLength: 150 },
      { field: 'winningPosition', type: 'uint8' },
    ]
  }

  toJSON() {
    return {
      state: this.state,
      odd: this.odd,
      outcome: this.outcome,
      winningPosition: this.winningPosition,
    }
  }
}
