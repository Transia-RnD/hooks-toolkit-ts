const ASSERT = (x, line) => {
  if (!x) {
    trace('line', line, false)
    rollback(x.toString(), line)
  }
}

const sfInvoiceID = 0x50011

const Hook = (arg) => {
  // get this transaction id
  const txn = otxn_id(0)
  ASSERT(txn.length === 32, 1)

  // get the invoice id, which contains the grantor account
  const grantor = otxn_field(sfInvoiceID)
  ASSERT(grantor.length === 32, 2)

  const iterations = (grantor[0] << 8) + grantor[1]
  const p = hook_pos()
  for (let i = 0; i < iterations; ++i) {
    txn[0] = i & 0xff // Lower byte
    txn[1] = (i >> 8) & 0xff // Upper byte
    txn[2] = p
    ASSERT(state_set(txn as number[], txn as number[]) === 32, 3)
  }

  accept('', 0)
}

export { Hook }
