import {
  LedgerEntryRequest,
  SetHookFlags,
  calculateHookOn,
} from '@transia/xrpl'
// xrpl-helpers
import {
  serverUrl,
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
} from '../../../src/libs/xrpl-helpers'
// src
import {
  SetHookParams,
  setHooksV3,
  hexNamespace,
  iHook,
  readHookBinaryHexFromNS,
} from '../../../dist/npm/src'
import {
  HookDefinition as LeHookDefinition,
  Hook as LeHook,
} from '@transia/xrpl/dist/npm/models/ledger'

// TEST WITH DELTA/DEFAULT PARAMS - HookHash
// The hook parameters on the hook definition are not always the hook parameters.
// They are the delta default variables.

describe('Application.provider', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => teardownClient(testContext))

  it('sethook - no operation', async () => {
    // SKIP
  })

  it('sethook - create', async () => {
    const hook = {
      CreateCode: readHookBinaryHexFromNS('hook_on_tt'),
      Flags: SetHookFlags.hsfOverride,
      HookOn: calculateHookOn(['Invoke']),
      HookNamespace: hexNamespace('hook_on_tt'),
      HookApiVersion: 0,
    } as iHook

    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
    const hookReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: testContext.alice.classicAddress,
      },
    }
    const hookRes = await testContext.client.request(hookReq)
    const leHook = hookRes.result.node as LeHook
    console.log(leHook.Hooks[0])
    expect(leHook.Hooks.length).toBe(1)
    expect(leHook.Hooks[0].Hook.HookHash).toEqual(
      '1AE9659320E368B3F5D912F6227F59020FC5F85A5970C5F4355AFB70928E160B'
    )
    const hookDefRequest: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook_definition: leHook.Hooks[0].Hook.HookHash,
    }
    const hookDefRes = await testContext.client.request(hookDefRequest)
    console.log(hookDefRes)
    expect((hookDefRes.result.node as LeHookDefinition).HookNamespace).toEqual(
      '326178559E63837BA3B83BC05E5DC323A7B52C782AC4D5B3B182B2E050565581'
    )
  })

  it('sethook - install', async () => {
    const hook = {
      HookHash:
        '1AE9659320E368B3F5D912F6227F59020FC5F85A5970C5F4355AFB70928E160B',
      Flags: SetHookFlags.hsfOverride,
      HookOn: calculateHookOn(['Invoke']),
      HookNamespace: hexNamespace('hook_on_tt'),
    } as iHook

    await setHooksV3({
      client: testContext.client,
      seed: testContext.bob.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    const hookReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: testContext.bob.classicAddress,
      },
    }
    const hookRes = await testContext.client.request(hookReq)
    const leHook = hookRes.result.node as LeHook
    console.log(leHook.Hooks[0])

    expect(leHook.Hooks.length).toBe(1)
    const hookDefRequest: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook_definition: leHook.Hooks[0].Hook.HookHash,
    }
    const hookDefRes = await testContext.client.request(hookDefRequest)
    expect((hookDefRes.result.node as LeHookDefinition).HookNamespace).toBe(
      '326178559E63837BA3B83BC05E5DC323A7B52C782AC4D5B3B182B2E050565581'
    )
  })

  // TODO: Make sure that the namespace was changed: Do Params & Grant
  it('sethook - update: Namespace', async () => {
    const hook = {
      HookNamespace: hexNamespace('hook_on_tts'),
    } as iHook

    await setHooksV3({
      client: testContext.client,
      seed: testContext.bob.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
    const hookReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: testContext.bob.classicAddress,
      },
    }
    const hookRes = await testContext.client.request(hookReq)
    const leHook = hookRes.result.node as LeHook
    expect(leHook.Hooks.length).toBe(1)
    const hookDefRequest: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook_definition: leHook.Hooks[0].Hook.HookHash,
    }
    const hookDefRes = await testContext.client.request(hookDefRequest)
    console.log((hookDefRes.result.node as LeHookDefinition).HookNamespace)
    console.log(
      '326178559E63837BA3B83BC05E5DC323A7B52C782AC4D5B3B182B2E050565581'
    )

    expect((hookDefRes.result.node as LeHookDefinition).HookNamespace).toBe(
      '326178559E63837BA3B83BC05E5DC323A7B52C782AC4D5B3B182B2E050565581'
    )
  })

  it('sethook - delete', async () => {
    const hook = {
      CreateCode: '',
      Flags: SetHookFlags.hsfOverride,
    } as iHook
    await setHooksV3({
      client: testContext.client,
      seed: testContext.bob.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
    try {
      const hookReq: LedgerEntryRequest = {
        command: 'ledger_entry',
        hook: {
          account: testContext.bob.classicAddress,
        },
      }
      await testContext.client.request(hookReq)
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual('entryNotFound')
      }
    }
  })

  // TODO: Use State Hook and test reset
  it('sethook - ns reset', async () => {
    const hook = {
      Flags: SetHookFlags.hsfNSDelete,
      HookNamespace: hexNamespace('hook_on_tt'),
    } as iHook
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
    const hookReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: testContext.alice.classicAddress,
      },
    }
    const hookRes = await testContext.client.request(hookReq)
    const leHook = hookRes.result.node as LeHook
    expect(leHook.Hooks.length).toBe(1)
    const hookDefRequest: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook_definition: leHook.Hooks[0].Hook.HookHash,
    }
    const hookDefRes = await testContext.client.request(hookDefRequest)
    expect((hookDefRes.result.node as LeHookDefinition).HookNamespace).toBe(
      '326178559E63837BA3B83BC05E5DC323A7B52C782AC4D5B3B182B2E050565581'
    )
  })
})
