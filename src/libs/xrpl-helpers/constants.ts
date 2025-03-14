import { ECDSA, Wallet } from 'xahau'

// **DO NOT EDIT THESE SEEDS**
// They match the seeds in the rippled source test env.
// Where the secret that is used to generate the seed is the name

// wallet secret == "mastersecret"
// rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
export const MASTER_WALLET = Wallet.fromSeed('snoPBrXtMeMyMHUVTgbuqAfg1SUTb', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "gw"
// rExKpRKXNz25UAjbckCRtQsJFcSfjL9Er3
export const GW_WALLET = Wallet.fromSeed('safmpBLsy2paxybRMpvXqFqSrV5HG', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "notactive"
// rMqTbPY6rzTspuBGBcS7po7FFTPwitrKHX
export const NOT_ACTIVE_WALLET = Wallet.fromSeed(
  'snqPCkCnfAbK4p981HZZGMj8SnhZ7',
  {
    algorithm: ECDSA.secp256k1,
  }
)
// wallet secret == "alice"
// rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn
export const ALICE_WALLET = Wallet.fromSeed('ssbTMHrmEJP7QEQjWJH3a72LQipBM', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "bob"
// rPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK
export const BOB_WALLET = Wallet.fromSeed('spkcsko6Ag3RbCSVXV2FJ8Pd4Zac1', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "carol"
// rH4KEcG9dEwGwpn6AyoWK9cZPLL4RLSmWW
export const CAROL_WALLET = Wallet.fromSeed('snzb83cV8zpLPTE4nQamoLP9pbhB7', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "dave"
//  rGWC14yT3U8bkuAx2c8tA1ajLUJCandp59
export const DAVE_WALLET = Wallet.fromSeed('sh2Q7wDfjdvyVaVHEE8JT3C9osGFD', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "elsa"
// rL8xeQSGxTmKXXyLUFRuAAKsWMY1BMpQbe
export const ELSA_WALLET = Wallet.fromSeed('sspu32LMDPU9V5NCUb584FqbdPsZ6', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "frank"
// rDvJdyJXEMcLByY7y8fPXKnK6g9BpAyhb9
export const FRANK_WALLET = Wallet.fromSeed('sshnbebSnLqrwyh8rorMcYgH18fXR', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "grace"
// rKwXpiHGcQSzKEGXcwej5Eq2CQtN6HoTDr
export const GRACE_WALLET = Wallet.fromSeed('saNMoZ8vo5xHhTkdY591ZM5tzxC4J', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "heidi"
// rMcXuYsQ3MjFeRRqi1GvasJzTdL7wuL3hN
export const HEIDI_WALLET = Wallet.fromSeed('shQ9J4uun5BFQ5coEeUorTPipssR8', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "ivan"
// rhW5hg2xE7w2ewepbhWtgZWW8SuN6uW97S
export const IVAN_WALLET = Wallet.fromSeed('ssUL8VwUfDNzttN7AsimLPyiP7RXQ', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "judy"
// rpggxGs4yFaFEGThxBEbhir7T9Fb5LQKLC
export const JUDY_WALLET = Wallet.fromSeed('shaiav41HpCvyHQhbSJDWS2pAqD77', {
  algorithm: ECDSA.secp256k1,
})

// wallet secret == "hook1"
// rBpVrkKc8QnxsCGsngMJgmDKqxJKoWHfKt
export const HOOK1_WALLET = Wallet.fromSeed('ssM2MJpZchJhEWYCP1wMqpD9MWbcd', {
  algorithm: ECDSA.secp256k1,
})

// wallet secret == "hook2"
// rpeWVvqpm2EPzfFiWrV421AMHKUQBk5aDt
export const HOOK2_WALLET = Wallet.fromSeed('ss7Ec7bReBqsYpLY2cVsyJsgeLJLq', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "hook3"
// raNiq8ztgmvSXuKrD8iEn2QL6MEf72wSXz
export const HOOK3_WALLET = Wallet.fromSeed('shgqrTAn8TkqKSfVHhDU4kMthzHeJ', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "hook4"
// rHbizjpTJsqKh4WBcJnJr99uP6H1chRcTd
export const HOOK4_WALLET = Wallet.fromSeed('snZ1P5gkmuJYUi2LDtSSzYQnxcdp8', {
  algorithm: ECDSA.secp256k1,
})
// wallet secret == "hook5"
// rUPJACGdNu2rNRiWYpjTbr9BGYz8caXEQG
export const HOOK5_WALLET = Wallet.fromSeed('ssUcdBBRiCendP9TenSr2tfKhFw7Z', {
  algorithm: ECDSA.secp256k1,
})
