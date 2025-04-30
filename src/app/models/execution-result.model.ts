export interface ExecutionResultDTO {
    scriptId?: number;
    scriptTitle?: string;  // Ajout du titre du script
    output: string;
    error?: string;
    status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'PENDING' | string; // Plus flexible
    executionTime?: number; // Changé en number pour meilleur traitement
    timestamp?: string | Date; // Ajout pour la date
}