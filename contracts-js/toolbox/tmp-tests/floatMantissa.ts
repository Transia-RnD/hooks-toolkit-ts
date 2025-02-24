const ASSERT = (x) => {
  if (!x) {
    rollback(x.toString(), 0)
  }
}

const INVALID_ARGUMENT = -7
const INVALID_FLOAT = -10024

const Hook = (arg) => {
  // invalid argument
  ASSERT(float_mantissa(undefined) === INVALID_ARGUMENT)

  // test invalid floats
  {
    ASSERT(float_mantissa(-1) === INVALID_FLOAT)
    ASSERT(float_mantissa(-11010191919n) === INVALID_FLOAT)
  }

  // test canonical zero
  ASSERT(float_mantissa(0) === 0)

  // test one, negative one
  {
    ASSERT(float_mantissa(float_one()) === 1000000000000000n)
    ASSERT(float_mantissa(float_negate(float_one())) === 1000000000000000n)
  }

  // test random numbers
  {
    ASSERT(
      float_mantissa(4763370308433150973n /* 7.569101929907197e-74 */) ===
        7569101929907197n
    )
    ASSERT(
      float_mantissa(668909658849475214n /* -2.376913998641806e-45 */) ===
        2376913998641806n
    )
    ASSERT(
      float_mantissa(962271544155031248n /* -7.508423152486096e-29 */) ===
        7508423152486096n
    )
    ASSERT(
      float_mantissa(7335644976228470276n /* 3.784782869302788e+69 */) ===
        3784782869302788n
    )
    ASSERT(
      float_mantissa(2837780149340315954n /* -9.519583351644467e+75 */) ===
        9519583351644466n
    )
    ASSERT(
      float_mantissa(2614004940018599738n /* -1.917156143712058e+63 */) ===
        1917156143712058n
    )
    ASSERT(
      float_mantissa(4812250541755005603n /* 2.406139723315875e-71 */) ===
        2406139723315875n
    )
    ASSERT(
      float_mantissa(5140304866732560580n /* 6.20129153019514e-53 */) ===
        6201291530195140n
    )
    ASSERT(
      float_mantissa(1124677839589482624n /* -7.785132001599617e-20 */) ===
        7785132001599616n
    )
    ASSERT(
      float_mantissa(5269336076015865585n /* 9.131711247126257e-46 */) ===
        9131711247126257n
    )
    ASSERT(
      float_mantissa(2296179634826760368n /* -8.3510241225484e+45 */) ===
        8351024122548400n
    )
    ASSERT(
      float_mantissa(1104028240398536470n /* -5.149931320135446e-21 */) ===
        5149931320135446n
    )
    ASSERT(
      float_mantissa(2691222059222981864n /* -7.076681310166248e+67 */) ===
        7076681310166248n
    )
    ASSERT(
      float_mantissa(6113256168823855946n /* 63.7507410946337 */) ===
        6375074109463370n
    )
    ASSERT(
      float_mantissa(311682216630003626n /* -5.437441968809898e-65 */) ===
        5437441968809898n
    )
    ASSERT(
      float_mantissa(794955605753965262n /* -2.322071336757966e-38 */) ===
        2322071336757966n
    )
    ASSERT(
      float_mantissa(204540636400815950n /* -6.382252796514126e-71 */) ===
        6382252796514126n
    )
    ASSERT(
      float_mantissa(5497195278343034975n /* 2.803732951029855e-33 */) ===
        2803732951029855n
    )
    ASSERT(
      float_mantissa(1450265914369875626n /* -0.09114033611316906 */) ===
        9114033611316906n
    )
    ASSERT(
      float_mantissa(7481064015089962668n /* 5.088633654939308e+77 */) ===
        5088633654939308n
    )
  }

  accept('', 0)
}

export { Hook }
