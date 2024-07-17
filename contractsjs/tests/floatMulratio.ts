const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const INVALID_ARGUMENT = -7
const XFL_OVERFLOW = -30
const INVALID_FLOAT = -10024

const Hook = (arg) => {
  // invalid argument
  ASSERT(float_mulratio(undefined, 1, 1, 1) === INVALID_ARGUMENT)
  ASSERT(float_mulratio(float_one(), undefined, 1, 1) === INVALID_ARGUMENT)
  ASSERT(float_mulratio(float_one(), 1, undefined, 1) === INVALID_ARGUMENT)
  ASSERT(float_mulratio(float_one(), 1, 1, undefined) === INVALID_ARGUMENT)

  // ensure invalid xfl are not accepted
  ASSERT(float_mulratio(-1, 0, 1, 1) === INVALID_FLOAT)

  // multiply by 0
  ASSERT(float_mulratio(float_one(), 0, 0, 1) === 0)
  ASSERT(float_mulratio(0, 0, 1, 1) === 0)

  // check 1
  ASSERT(float_mulratio(float_one(), 0, 1, 1) === float_one())
  ASSERT(
    float_mulratio(float_negate(float_one()), 0, 1, 1) ===
      float_negate(float_one())
  )

  // check overflow
  // 1e+95 * 1e+95
  ASSERT(
    float_mulratio(7801234554605699072n, 0, 0xffffffff, 1) === XFL_OVERFLOW
  )
  // 1e+95 * 10
  ASSERT(float_mulratio(7801234554605699072n, 0, 10, 1) === XFL_OVERFLOW)
  // -1e+95 * 10
  ASSERT(float_mulratio(3189548536178311168n, 0, 10, 1) === XFL_OVERFLOW)

  // identity
  ASSERT(float_mulratio(3189548536178311168n, 0, 1, 1) === 3189548536178311168n)

  // random mulratios
  ASSERT(
    float_mulratio(2296131684119423544n, 0, 2210828011, 2814367554) ===
      2294351094683836182n
  )
  ASSERT(
    float_mulratio(565488225163275031n, 0, 2373474507, 4203973264) ===
      562422045628095449n
  )
  ASSERT(
    float_mulratio(2292703263479286183n, 0, 3170020147, 773892643) ===
      2307839765178024100n
  )
  ASSERT(
    float_mulratio(758435948837102675n, 0, 3802740780, 1954123588) ===
      760168290112163547n
  )
  ASSERT(
    float_mulratio(3063742137774439410n, 0, 2888815591, 4122448592) ===
      3053503824756415637n
  )
  ASSERT(
    float_mulratio(974014561126802184n, 0, 689168634, 3222648522) ===
      957408554638995792n
  )
  ASSERT(
    float_mulratio(2978333847445611553n, 0, 1718558513, 2767410870) ===
      2976075722223325259n
  )
  ASSERT(
    float_mulratio(6577058837932757648n, 0, 1423256719, 1338068927) ===
      6577173649752398013n
  )
  ASSERT(
    float_mulratio(2668681541248816636n, 0, 345215754, 4259223936) ===
      2650183845127530219n
  )
  ASSERT(
    float_mulratio(651803640367065917n, 0, 327563234, 1191613855) ===
      639534906402789367n
  )
  ASSERT(
    float_mulratio(3154958130393015979n, 0, 1304112625, 3024066701) ===
      3153571282364880741n
  )
  ASSERT(
    float_mulratio(1713286099776800976n, 0, 1902151138, 2927030061) ===
      1712614441093927707n
  )
  ASSERT(
    float_mulratio(2333142120591277120n, 0, 914099656, 108514965) ===
      2349692988167140473n
  )
  ASSERT(
    float_mulratio(995968561418010814n, 0, 1334462574, 846156977) ===
      998955931389416093n
  )
  ASSERT(
    float_mulratio(6276035843030312442n, 0, 2660687613, 236740983) ===
      6294920527635363073n
  )
  ASSERT(
    float_mulratio(7333118474702086419n, 0, 46947714, 2479204760) ===
      7298214153648998534n
  )
  ASSERT(
    float_mulratio(2873297486994296492n, 0, 880591893, 436034100) ===
      2884122995598532758n
  )
  ASSERT(
    float_mulratio(1935815261812737573n, 0, 3123665800, 3786746543) ===
      1934366328810191207n
  )
  ASSERT(
    float_mulratio(7249556282125616118n, 0, 2378803159, 2248850590) ===
      7250005170160875416n
  )
  ASSERT(
    float_mulratio(311005347529659996n, 0, 992915590, 2433548552) ===
      308187142737041831n
  )

  accept('', 0)
}

export { Hook }
