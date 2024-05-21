// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Hook = (arg) => {
  let obj = {
    somekey: [0xde, 0xad, 0xbe, 0xef],
    anotherkey: 'some value',
  }
  trace('Some message', obj, false)

  let accid = [
    0x09, 0x61, 0xa4, 0xa0, 0xaf, 0xbb, 0xca, 0xe6, 0x14, 0x90, 0x8f, 0x6e,
    0x8e, 0x6d, 0x76, 0xae, 0xfb, 0x55, 0x80, 0x0c,
  ]

  let raddr
  trace('R-addr', (raddr = util_raddr(accid)), false)

  trace('Accid', util_accid(raddr), false)

  trace('hash1', util_sha512h([0xde, 0xad, 0xbe, 0xef]), false)
  trace('hash2', util_sha512h('cafebabe12'), false)
  trace('hash3', util_sha512h('caFEbAbe12'), false)

  return accept('hello world', 123)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Callback = (arg) => {
  return accept('', 1)
}
