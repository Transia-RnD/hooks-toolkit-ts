import { Wallet } from '@transia/xrpl'

// **DO NOT EDIT THESE SEEDS**
// They match the seeds in the rippled source test env.
// Where the secret that is used to generate the seed is the name

// wallet secret == "mastersecret"
// rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
export const MASTER_WALLET = Wallet.fromSeed('snoPBrXtMeMyMHUVTgbuqAfg1SUTb')
// wallet secret == "gw"
// rExKpRKXNz25UAjbckCRtQsJFcSfjL9Er3
export const GW_WALLET = Wallet.fromSeed('safmpBLsy2paxybRMpvXqFqSrV5HG')
// wallet secret == "notactive"
// rMqTbPY6rzTspuBGBcS7po7FFTPwitrKHX
export const NOT_ACTIVE_WALLET = Wallet.fromSeed(
  'snqPCkCnfAbK4p981HZZGMj8SnhZ7'
)
// wallet secret == "alice"
// rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn
export const ALICE_WALLET = Wallet.fromSeed('ssbTMHrmEJP7QEQjWJH3a72LQipBM')
// wallet secret == "bob"
// rPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK
export const BOB_WALLET = Wallet.fromSeed('spkcsko6Ag3RbCSVXV2FJ8Pd4Zac1')
// wallet secret == "carol"
// rH4KEcG9dEwGwpn6AyoWK9cZPLL4RLSmWW
export const CAROL_WALLET = Wallet.fromSeed('snzb83cV8zpLPTE4nQamoLP9pbhB7')
// wallet secret == "dave"
//  rGWC14yT3U8bkuAx2c8tA1ajLUJCandp59
export const DAVE_WALLET = Wallet.fromSeed('sh2Q7wDfjdvyVaVHEE8JT3C9osGFD')
// wallet secret == "elsa"
// rL8xeQSGxTmKXXyLUFRuAAKsWMY1BMpQbe
export const ELSA_WALLET = Wallet.fromSeed('sspu32LMDPU9V5NCUb584FqbdPsZ6')
