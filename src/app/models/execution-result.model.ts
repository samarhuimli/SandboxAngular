export interface ExecutionResultDTO {
    scriptId?: number;
    scriptTitle?: string;
    output: string;
    error?: string;
    status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'PENDING' | string;
    executionTime?: number;
    timestamp?: string | Date;
    createdBy?: string;
  }
  