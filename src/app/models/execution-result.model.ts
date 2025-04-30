// execution-result.model.ts
export interface ExecutionResultDTO {
    scriptId?: number;
    output: string;
    error?: string;
    status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'PENDING';
    executionTime?: string;
  }