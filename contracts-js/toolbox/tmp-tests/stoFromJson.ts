const INVALID_ARGUMENT = -7
const ASSERT = (x) => {
  if (!x) rollback(x.toString(), 0)
}

const accRoot = {
  LedgerEntryType: 'AccountRoot',
  Flags: 0,
  Sequence: 69178585,
  PreviousTxnLgrSeq: 73303223,
  OwnerCount: 0,
  PreviousTxnID:
    '1340B325863196B56F41F589EB7D2FD94C0D7DB80E4B2C67A7782AD6C2B07750',
  Balance: '10779028',
  Account: 'raaRdKAobgyv8VqpRV2UZRjT74FL9PHuei',
}

const sto = [
  0x11, 0x00, 0x61, 0x22, 0x00, 0x00, 0x00, 0x00, 0x24, 0x04, 0x1f, 0x94, 0xd9,
  0x25, 0x04, 0x5e, 0x84, 0xb7, 0x2d, 0x00, 0x00, 0x00, 0x00, 0x55, 0x13, 0x40,
  0xb3, 0x25, 0x86, 0x31, 0x96, 0xb5, 0x6f, 0x41, 0xf5, 0x89, 0xeb, 0x7d, 0x2f,
  0xd9, 0x4c, 0x0d, 0x7d, 0xb8, 0x0e, 0x4b, 0x2c, 0x67, 0xa7, 0x78, 0x2a, 0xd6,
  0xc2, 0xb0, 0x77, 0x50, 0x62, 0x40, 0x00, 0x00, 0x00, 0x00, 0xa4, 0x79, 0x94,
  0x81, 0x14, 0x37, 0xdf, 0x44, 0x07, 0xe7, 0xaa, 0x07, 0xf1, 0xd5, 0xc9, 0x91,
  0xf2, 0xd3, 0x6f, 0x9e, 0xb8, 0xc7, 0x34, 0xaf, 0x6c,
]

const Hook = (reserved) => {
  // Test arg check
  ASSERT(sto_from_json(undefined) === INVALID_ARGUMENT)

  // Test ledger entry
  const accRootSto = sto_from_json(accRoot)
  ASSERT(Array.isArray(accRootSto))
  ASSERT(accRootSto.length === sto.length)
  ASSERT(accRootSto.every((v, i) => v === sto[i]))

  // test transaction
  const txn_json = otxn_json()
  ASSERT(otxn_slot(1) === 1)
  const otxn_sto = slot(1)
  ASSERT(sto_from_json(txn_json).length === otxn_sto.length)
  ASSERT(sto_from_json(txn_json).every((v, i) => v === otxn_sto[i]))

  // Invalid field
  ASSERT(
    sto_from_json({ ...accRoot, SomeInvalidField: '123' }) === INVALID_ARGUMENT
  )

  // Invalid value type
  // TODO: Should be invalid https://github.com/Xahau/xahaud/issues/458
  // ASSERT(sto_from_json({ ...accRoot, Balance: 123 }) === INVALID_ARGUMENT)

  accept('success', 0)
}
