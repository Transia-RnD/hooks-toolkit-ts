import { convertHexToString } from '@transia/xrpl'
import { HookExecution } from '@transia/xrpl/dist/npm/models/transactions/metadata'

export interface iHookExecution {
  HookAccount: string
  HookEmitCount: number
  HookExecutionIndex: number
  HookHash: string
  HookInstructionCount: string
  HookResult: number
  HookReturnCode: number
  HookReturnString: string
  HookStateChangeCount: number
}

export class iHookExecutions {
  executions: iHookExecution[]

  constructor(results: HookExecution[]) {
    this.executions = results.map((entry: HookExecution) => {
      const execution = entry.HookExecution
      return {
        ...execution,
        HookReturnString: convertHexToString(
          entry.HookExecution.HookReturnString
        ).replace(/\0[\s\S]*$/g, ''),
      } as iHookExecution
    })
  }
}
