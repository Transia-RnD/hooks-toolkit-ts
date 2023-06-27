import {
  BaseModel,
  Metadata,
  XRPAddress,
} from '../../../src/libs/binary-models'

describe('BaseModel', () => {
  it('encodes and decodes a model', () => {
    const SampleModel = class extends BaseModel {
      owner: XRPAddress

      constructor(owner: XRPAddress) {
        super()
        this.owner = owner
      }

      getMetadata(): Metadata {
        return [{ field: 'owner', type: 'xrpAddress' }]
      }
    }

    const owner = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
    const sample = new SampleModel(owner)

    const sampleEncoded = sample.encode()
    const sampleDecoded = BaseModel.decode(sampleEncoded, SampleModel)
    expect(sampleDecoded.owner).toBe(sample.owner)
  })

  describe('getHexLength', () => {
    it('gets the hex length of a model', () => {
      const SampleModel = class extends BaseModel {
        owner: XRPAddress

        constructor(owner: XRPAddress) {
          super()
          this.owner = owner
        }

        getMetadata(): Metadata {
          return [{ field: 'owner', type: 'xrpAddress' }]
        }
      }

      const hexLength = BaseModel.getHexLength(SampleModel)
      expect(hexLength).toBe(72)
    })
  })
})
