import {
  AccountSet,
  Payment,
  SetHook,
  SetHookFlags,
  TransactionMetadata,
  calculateHookOn,
  xrpToDrops,
} from '@transia/xrpl'
import { IssuedCurrencyAmount } from '@transia/xrpl/dist/npm/models/common'
import {
  XrplIntegrationTestContext,
  serverUrl,
  setupClient,
  teardownClient,
} from '../../../../src/libs/xrpl-helpers'
import {
  Application,
  ExecutionUtility,
  createHookPayload,
  floatToLEXfl,
  setHooksV3,
  SetHookParams,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
} from '../../../../dist/npm/src'

// Firewall.Base: ACCEPT: passing sethook tt
// Firewall.Base: ACCEPT: amount < 0
// Firewall.Base: ROLLBACK: block account - TODO
// Firewall.Base: ROLLBACK: block in tt
// Firewall.Base: ROLLBACK: block out tt
// Firewall.Base: ROLLBACK: block min xrp
// Firewall.Base: ROLLBACK: block max xrp
// Firewall.Base: ROLLBACK: block min usd
// Firewall.Base: ROLLBACK: block max xrp
// Firewall.Base: ACCEPT: Passthrough

describe('firewall.base - Success Group', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('firewall base - passing sethook tt', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FI'),
      new iHookParamValue(calculateHookOn(['SetHook']), true)
    )
    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['SetHook'],
      [param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    const aliceWallet = testContext.alice
    const builtTx: SetHook = {
      TransactionType: 'SetHook',
      Account: aliceWallet.address,
      Hooks: [
        {
          Hook: createHookPayload(0, 'base', 'base', SetHookFlags.hsfOverride, [
            'Payment',
          ]),
        },
      ],
    }

    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookEmitted = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookEmitted.executions[0].HookReturnString).toMatch(
      'Firewall: Passing SetHook txn'
    )
  })

  it('firewall base - amount < 0', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FI'),
      new iHookParamValue(calculateHookOn(['SetHook', 'AccountSet']), true)
    )
    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['AccountSet'],
      [param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // ACCOUNT SET OUT
    const aliceWallet = testContext.alice
    const builtTx: AccountSet = {
      TransactionType: 'AccountSet',
      Account: aliceWallet.address,
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: aliceWallet,
      tx: builtTx,
    })

    const hookEmitted = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookEmitted.executions[0].HookReturnString).toMatch(
      'Firewall: Ignoring negative amount'
    )
  })

  it('firewall base - block in tt', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FI'),
      new iHookParamValue(calculateHookOn(['SetHook']), true)
    )
    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      // PAYMENT IN
      const aliceWallet = testContext.alice
      const bobWallet = testContext.bob
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: bobWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        Amount: xrpToDrops(100),
      }
      await Application.testHookTx(testContext.client, {
        wallet: bobWallet,
        tx: builtTx,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch('Firewall: blocking txn type')
      }
    }
  })

  it('firewall base - block out tt', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FO'),
      new iHookParamValue(calculateHookOn(['SetHook']), true)
    )

    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [param1.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      // PAYMENT OUT
      const aliceWallet = testContext.alice
      const carolWallet = testContext.carol
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: aliceWallet.classicAddress,
        Destination: carolWallet.classicAddress,
        Amount: xrpToDrops(100),
      }
      await Application.testHookTx(testContext.client, {
        wallet: aliceWallet,
        tx: builtTx,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch('Firewall: blocking txn type')
      }
    }
  })

  it('firewall base - block min xrp', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FI'),
      new iHookParamValue(calculateHookOn(['SetHook', 'Payment']), true)
    )
    const param2 = new iHookParamEntry(
      new iHookParamName('FLD'),
      new iHookParamValue(floatToLEXfl('100'), true)
    )

    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [param1.toXrpl(), param2.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      // PAYMENT IN
      const aliceWallet = testContext.alice
      const carolWallet = testContext.carol
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: carolWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        Amount: xrpToDrops(99),
      }
      await Application.testHookTx(testContext.client, {
        wallet: carolWallet,
        tx: builtTx,
      })
      throw Error('Expected Failure')
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message)
        expect(error.message).toMatch(
          'Firewall: blocking amount below threshold'
        )
      }
    }
  })

  it('firewall base - block max xrp', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FI'),
      new iHookParamValue(calculateHookOn(['SetHook', 'Payment']), true)
    )
    const param2 = new iHookParamEntry(
      new iHookParamName('FLD'),
      new iHookParamValue(floatToLEXfl('10'), true)
    )
    const param3 = new iHookParamEntry(
      new iHookParamName('FUD'),
      new iHookParamValue(floatToLEXfl('100'), true)
    )

    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [param1.toXrpl(), param2.toXrpl(), param3.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    try {
      // PAYMENT IN
      const aliceWallet = testContext.alice
      const carolWallet = testContext.carol
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: carolWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        Amount: xrpToDrops(101),
      }
      await Application.testHookTx(testContext.client, {
        wallet: carolWallet,
        tx: builtTx,
      })
      throw Error('Expected Failure')
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(
          'Firewall: blocking amount above threshold'
        )
      }
    }
  })

  it('firewall base - block min amount', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FI'),
      new iHookParamValue(calculateHookOn(['SetHook', 'Payment']), true)
    )
    const param2 = new iHookParamEntry(
      new iHookParamName('FLT'),
      new iHookParamValue(floatToLEXfl('100'), true)
    )

    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [param1.toXrpl(), param2.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    const amount: IssuedCurrencyAmount = {
      value: '99',
      currency: 'USD',
      issuer: testContext.gw.classicAddress,
    }

    try {
      // PAYMENT IN
      const aliceWallet = testContext.alice
      const carolWallet = testContext.carol
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: carolWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        Amount: amount,
      }
      await Application.testHookTx(testContext.client, {
        wallet: carolWallet,
        tx: builtTx,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(
          'Firewall: blocking amount below threshold'
        )
      }
    }
  })
  it('firewall base - block max amount', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FI'),
      new iHookParamValue(calculateHookOn(['SetHook', 'Payment']), true)
    )
    const param2 = new iHookParamEntry(
      new iHookParamName('FLT'),
      new iHookParamValue(floatToLEXfl('10'), true)
    )
    const param3 = new iHookParamEntry(
      new iHookParamName('FUT'),
      new iHookParamValue(floatToLEXfl('100'), true)
    )

    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [param1.toXrpl(), param2.toXrpl(), param3.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    const amount: IssuedCurrencyAmount = {
      value: '101',
      currency: 'USD',
      issuer: testContext.gw.classicAddress,
    }
    try {
      // PAYMENT IN
      const aliceWallet = testContext.alice
      const carolWallet = testContext.carol
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: carolWallet.classicAddress,
        Destination: aliceWallet.classicAddress,
        Amount: amount,
      }
      await Application.testHookTx(testContext.client, {
        wallet: carolWallet,
        tx: builtTx,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(
          'Firewall: blocking amount above threshold'
        )
      }
    }
  })

  it('firewall - passthrough', async () => {
    const param1 = new iHookParamEntry(
      new iHookParamName('FI'),
      new iHookParamValue(calculateHookOn(['SetHook', 'Payment']), true)
    )
    const param2 = new iHookParamEntry(
      new iHookParamName('FO'),
      new iHookParamValue(calculateHookOn(['SetHook']), true)
    )
    const param3 = new iHookParamEntry(
      new iHookParamName('FLD'),
      new iHookParamValue(floatToLEXfl('1'), true)
    )
    const param4 = new iHookParamEntry(
      new iHookParamName('FUD'),
      new iHookParamValue(floatToLEXfl('100'), true)
    )

    const hook = createHookPayload(
      0,
      'firewall_base',
      'firewall_base',
      SetHookFlags.hsfOverride,
      ['Payment'],
      [param1.toXrpl(), param2.toXrpl(), param3.toXrpl(), param4.toXrpl()]
    )
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // PAYMENT IN
    const aliceWallet = testContext.alice
    const carolWallet = testContext.carol
    const builtTx: Payment = {
      TransactionType: 'Payment',
      Account: carolWallet.classicAddress,
      Destination: aliceWallet.classicAddress,
      Amount: xrpToDrops(100),
    }
    const result = await Application.testHookTx(testContext.client, {
      wallet: carolWallet,
      tx: builtTx,
    })

    const hookEmitted = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    expect(hookEmitted.executions[0].HookReturnString).toMatch(
      'Firewall: Passing txn within thresholds'
    )
  })
})
