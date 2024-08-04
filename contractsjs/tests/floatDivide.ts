import {
  DIVISION_BY_ZERO,
  INVALID_ARGUMENT,
  INVALID_FLOAT,
  XFL_OVERFLOW,
} from 'jshooks-api'

const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

function frexp(value: bigint): [number, number] {
  if (value === BigInt(0)) return [0, 0]
  const data = new DataView(new ArrayBuffer(8))
  data.setFloat64(0, Number(value))
  let bits = (data.getUint32(0) >>> 20) & 0x7ff
  if (bits === 0) {
    // Subnormal number - shift until normalized
    data.setFloat64(0, Number(value) * Math.pow(2, 64))
    bits = ((data.getUint32(0) >>> 20) & 0x7ff) - 64
  }
  const exponent = bits - 1022
  const mantissa = Number(value) / Math.pow(2, exponent)
  return [mantissa, exponent]
}

function floatMantissa(x: bigint): number {
  // Extract the mantissa from a floating-point number
  if (x === BigInt(0)) return 0
  const [mantissa, exponent] = frexp(x)
  return mantissa * Math.pow(2, 52)
}

function floatExponent(x: bigint): number {
  // Extract the exponent from a floating-point number
  if (x === BigInt(0)) return 0
  const [mantissa, exponent] = frexp(x)
  return exponent
}

function ASSERT_EQUAL(x: bigint, y: bigint): void {
  const px = x
  const py = y
  let mx = floatMantissa(px)
  let my = floatMantissa(py)
  const diffexp = floatExponent(px) - floatExponent(py)

  if (diffexp === 1) mx *= 10
  if (diffexp === -1) my *= 10

  let diffman = mx - my
  if (diffman < 0) diffman *= -1

  if (Math.abs(diffexp) > 1 || diffman > 5000000 || mx < 0 || my < 0) {
    rollback('x', 0)
  }
}

const Hook = (arg) => {
  ASSERT(float_divide(undefined, float_one()) === INVALID_ARGUMENT)
  ASSERT(float_divide(float_one(), undefined) === INVALID_ARGUMENT)

  // ensure invalid xfl are not accepted
  ASSERT(float_divide(-1, float_one()) === INVALID_FLOAT)

  // divide by 0
  ASSERT(float_divide(float_one(), 0) === DIVISION_BY_ZERO)
  ASSERT(float_divide(0, float_one()) === 0)

  // check 1
  ASSERT(float_divide(float_one(), float_one()) === float_one())
  ASSERT(
    float_divide(float_one(), float_negate(float_one())) ===
      float_negate(float_one())
  )
  ASSERT(
    float_divide(float_negate(float_one()), float_one()) ===
      float_negate(float_one())
  )
  ASSERT(
    float_divide(float_negate(float_one()), float_negate(float_one())) ===
      float_one()
  )

  // 1 / 10 = 0.1
  ASSERT_EQUAL(
    float_divide(float_one(), 6107881094714392576n),
    6071852297695428608n
  )

  // 123456789 / 1623 = 76067.0295749
  ASSERT_EQUAL(
    float_divide(6234216452170766464n, 6144532891733356544n),
    6168530993200328528n
  )

  // -1.245678451111 / 1.3546984132111e+42 = -9.195245517106014e-43
  ASSERT_EQUAL(
    float_divide(1478426356228633688n, 6846826132016365020n),
    711756787386903390n
  )

  // 9.134546514878452e-81 / 1
  ASSERT(
    float_divide(4638834963451748340n, float_one()) === 4638834963451748340n
  )

  // 9.134546514878452e-81 / 1.41649684651e+75 = (underflow 0)
  ASSERT(float_divide(4638834963451748340n, 7441363081262569392n) === 0)

  // 1.3546984132111e+42 / 9.134546514878452e-81  = XFL_OVERFLOW
  ASSERT(
    float_divide(6846826132016365020n, 4638834963451748340n) === XFL_OVERFLOW
  )

  ASSERT_EQUAL(
    float_divide(
      3121244226425810900n /* -4.753284285427668e+91 */,
      2135203055881892282n /* -9.50403176301817e+36 */
    ),
    7066645550312560102n /* 5.001334595622374e+54 */
  )
  ASSERT_EQUAL(
    float_divide(
      2473507938381460320n /* -5.535342582428512e+55 */,
      6365869885731270068n /* 6787211884129716 */
    ),
    2187897766692155363n /* -8.155547044835299e+39 */
  )
  ASSERT_EQUAL(
    float_divide(
      1716271542690607496n /* -49036842898190.16 */,
      3137794549622534856n /* -3.28920897266964e+92 */
    ),
    4667220053951274769n /* 1.490839995440913e-79 */
  )
  ASSERT_EQUAL(
    float_divide(
      1588045991926420391n /* -2778923.092005799 */,
      5933338827267685794n /* 6.601717648113058e-9 */
    ),
    1733591650950017206n /* -420939403974674.2 */
  )
  ASSERT_EQUAL(
    float_divide(
      5880783758174228306n /* 8.089844083101523e-12 */,
      1396720886139976383n /* -0.00009612200909863615 */
    ),
    1341481714205255877n /* -8.416224503589061e-8 */
  )
  ASSERT_EQUAL(
    float_divide(
      5567703563029955929n /* 1.254423600022873e-29 */,
      2184969513100691140n /* -5.227293453371076e+39 */
    ),
    236586937995245543n /* -2.399757371979751e-69 */
  )
  ASSERT_EQUAL(
    float_divide(
      7333313065548121054n /* 1.452872188953566e+69 */,
      1755926008837497886n /* -8529353417745438 */
    ),
    2433647177826281173n /* -1.703379046213333e+53 */
  )
  ASSERT_EQUAL(
    float_divide(
      1172441975040622050n /* -1.50607192429309e-17 */,
      6692015311011173216n /* 8.673463993357152e+33 */
    ),
    560182767210134346n /* -1.736413416192842e-51 */
  )
  ASSERT_EQUAL(
    float_divide(
      577964843368607493n /* -1.504091065184005e-50 */,
      6422931182144699580n /* 9805312769113276000 */
    ),
    235721135837751035n /* -1.533955214485243e-69 */
  )
  ASSERT_EQUAL(
    float_divide(
      6039815413139899240n /* 0.0049919124634346 */,
      2117655488444284242n /* -9.970862834892113e+35 */
    ),
    779625635892827768n /* -5.006499985102456e-39 */
  )
  ASSERT_EQUAL(
    float_divide(
      1353563835098586141n /* -2.483946887437341e-7 */,
      6450909070545770298n /* 175440415122002600000 */
    ),
    992207753070525611n /* -1.415835049016491e-27 */
  )
  ASSERT_EQUAL(
    float_divide(
      6382158843584616121n /* 50617712279937850 */,
      5373794957212741595n /* 5.504201387110363e-40 */
    ),
    7088854809772330055n /* 9.196195545910343e+55 */
  )
  ASSERT_EQUAL(
    float_divide(
      2056891719200540975n /* -3.250289119594799e+32 */,
      1754532627802542730n /* -7135972382790282 */
    ),
    6381651867337939070n /* 45547949813167340 */
  )
  ASSERT_EQUAL(
    float_divide(
      5730152450208688630n /* 1.573724193417718e-20 */,
      1663581695074866883n /* -62570322025.24355 */
    ),
    921249452789827075n /* -2.515128806245891e-31 */
  )
  ASSERT_EQUAL(
    float_divide(
      6234301156018475310n /* 131927173.7708846 */,
      2868710604383082256n /* -4.4212413754468e+77 */
    ),
    219156721749007916n /* -2.983939635224108e-70 */
  )
  ASSERT_EQUAL(
    float_divide(
      2691125731495874243n /* -6.980353583058627e+67 */,
      7394070851520237320n /* 8.16746263262388e+72 */
    ),
    1377640825464715759n /* -0.000008546538744084975 */
  )
  ASSERT_EQUAL(
    float_divide(
      5141867696142208039n /* 7.764120939842599e-53 */,
      5369434678231981897n /* 1.143922406350665e-40 */
    ),
    5861466794943198400n /* 6.7872793615536e-13 */
  )
  ASSERT_EQUAL(
    float_divide(
      638296190872832492n /* -7.792243040963052e-47 */,
      5161669734904371378n /* 9.551761192523954e-52 */
    ),
    1557396184145861422n /* -81579.12330410798 */
  )
  ASSERT_EQUAL(
    float_divide(
      2000727145906286285n /* -1.128911353786061e+29 */,
      2096625200460673392n /* -6.954973360763248e+34 */
    ),
    5982403476503576795n /* 0.000001623171355558107 */
  )
  ASSERT_EQUAL(
    float_divide(
      640472838055334326n /* -9.968890223464885e-47 */,
      5189754252349396763n /* 1.607481618585371e-50 */
    ),
    1537425431139169736n /* -6201.557833201096 */
  )

  accept('', 0)
}

export { Hook }
