import { BaseModel, Metadata, UInt8 } from 'hooks-library/dist/npm/src'

export class GambitVote extends BaseModel {
  winningPosition: UInt8

  constructor(winningPosition: UInt8) {
    super()
    this.winningPosition = winningPosition
  }

  getMetadata(): Metadata {
    return [{ field: 'winningPosition', type: 'uint8' }]
  }

  toJSON() {
    return {
      winningPosition: this.winningPosition,
    }
  }
}
