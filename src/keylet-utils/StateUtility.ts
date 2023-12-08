import { Client, LedgerEntryRequest, Request } from '@transia/xrpl'
import {
  Hook as LeHook,
  HookDefinition as LeHookDefinition,
  HookState as LeHookState,
} from '@transia/xrpl/dist/npm/models/ledger'

export class StateUtility {
  static async getHook(client: Client, account: string): Promise<LeHook> {
    if (!client.isConnected()) {
      throw new Error('xrpl Client is not connected')
    }
    const hookReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: account,
      },
    }
    const hookRes = await client.request(hookReq)
    return hookRes.result.node as LeHook
  }

  static async getHookDefinition(
    client: Client,
    hash: string
  ): Promise<LeHookDefinition> {
    if (!client.isConnected()) {
      throw new Error('xrpl Client is not connected')
    }
    const hookDefRequest: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook_definition: hash,
    }
    const hookDefRes = await client.request(hookDefRequest)
    return hookDefRes.result.node as LeHookDefinition
  }

  static async getHookStateDir(
    client: Client,
    account: string,
    namespace: string
  ): Promise<LeHookState[]> {
    if (!client.isConnected()) {
      throw new Error('xrpl Client is not connected')
    }
    const request: Request = {
      // @ts-expect-error - this command exists on Hooks Testnet v3
      command: 'account_namespace',
      account: account,
      namespace_id: namespace,
    }
    const response = await client.request(request)
    // @ts-expect-error - this is defined
    return response.result.namespace_entries as unknown
  }
  static async getHookState(
    client: Client,
    account: string,
    key: string,
    namespace: string
  ): Promise<LeHookState> {
    if (!client.isConnected()) {
      throw new Error('xrpl Client is not connected')
    }
    const hookStateReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook_state: {
        account: account,
        key: key,
        namespace_id: namespace,
      },
    }
    const hookStateResp = await client.request(hookStateReq)
    const hookStateLe = hookStateResp.result.node as LeHookState
    return hookStateLe
  }
}
