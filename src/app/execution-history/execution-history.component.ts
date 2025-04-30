import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecutionService } from 'src/app/services/execution.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-execution-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './execution-history.component.html',
  styleUrls: ['./execution-history.component.scss'],
  providers: [DatePipe]
})
export class ExecutionHistoryComponent implements OnInit {
  groupedExecutions: any[] = [];
  expandedScriptId: number | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private executionService: ExecutionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadExecutions();
  }

  loadExecutions(): void {
    this.isLoading = true;
    this.error = null;
    
    this.executionService.getAllExecutionsGrouped().subscribe({
      next: (data) => {
        this.groupedExecutions = this.processData(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  private processData(data: any[]): any[] {
    return data.map(group => ({
      ...group,
      scriptTitle: group.scriptTitle || `Script #${group.scriptId}`,
      executions: group.executions.map((exec: any) => ({
        ...exec,
        formattedTime: this.formatExecutionTime(exec.executionTime),
        formattedDate: this.datePipe.transform(exec.timestamp, 'dd/MM/yyyy HH:mm') || 'Date inconnue'
      }))
    }));
  }

  private formatExecutionTime(time: number): string {
    if (!time) return 'N/A';
    if (time < 1000) return `${time} ms`;
    return `${(time / 1000).toFixed(2)} s`;
  }

  toggle(scriptId: number): void {
    this.expandedScriptId = this.expandedScriptId === scriptId ? null : scriptId;
  }

  isError(status: string): boolean {
    if (!status) return false;
    return ['error', 'failed', 'failure', 'err'].includes(status.toLowerCase());
  }

  hasAnyError(executions: any[]): boolean {
    return executions.some(exec => this.isError(exec.status));
  }

  refresh(): void {
    this.loadExecutions();
  }
}