import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExecutionService } from 'src/app/services/execution.service';
import { ExecutionResultComponent } from '../execution-result/execution-result.component';

@Component({
  selector: 'app-execution-history',
  standalone: true,
  imports: [CommonModule, ExecutionResultComponent],
  templateUrl: './execution-history.component.html',
  styleUrls: ['./execution-history.component.scss'],
  providers: [DatePipe]
})
export class ExecutionHistoryComponent implements OnInit {
  groupedExecutions: any[] = [];
  isLoading: boolean = true;
  showConfirmModal: boolean = false;
  executionToDelete: string | null = null;

  constructor(
    private executionService: ExecutionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadExecutions();
  }

  loadExecutions(): void {
    this.isLoading = true;
    this.executionService.getAllExecutionsGrouped().subscribe({
      next: (data) => {
        this.groupedExecutions = this.processData(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  async deleteExecution(executionId: string): Promise<void> {
  try {
    await this.executionService.deleteExecution(executionId).toPromise();
    this.groupedExecutions = this.groupedExecutions.map(group => ({
      ...group,
      executions: group.executions.filter(exec => exec._id !== executionId)
    }));
  } catch (err) {
    console.error('Échec de la suppression:', err);
  }
}

private processData(data: any[]): any[] {
  return data.map(group => {
    const firstExec = group.executions[0] || {};
    return {
      ...group,
      scriptTitle: group.title || firstExec.title || firstExec.scriptTitle || 'Script sans titre',
     executions: group.executions
  .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .map((exec: any) => ({
    ...exec,
    status: exec.success ? 'success' : 'failed',
    formattedTime: this.formatExecutionTime(exec.executionTime),
    formattedDate: exec.timestamp ? this.datePipe.transform(exec.timestamp, 'dd/MM/yy HH:mm') : '',
    createdBy: exec.createdBy || 'Inconnu'
}))
,
      isCollapsed: true // Le groupe lui-même est aussi fermé par défaut
    };
  });
}

  private formatExecutionTime(time?: number): string {
    if (!time) return '-';
    return time < 1000 ? `${time} ms` : `${(time / 1000).toFixed(2)} s`;
  }

  toggleGroup(group: any): void {
    group.isCollapsed = !group.isCollapsed;
  }
  isSuccess(status: string): boolean {
    if (!status) return false;
    return status.toLowerCase() === 'success';
  }

  requestDeleteExecution(executionId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.executionToDelete = executionId;
    this.showConfirmModal = true;
  }

  confirmDelete(): void {
    if (this.executionToDelete) {
      this.executionService.deleteExecution(this.executionToDelete).subscribe({
        next: () => {
          this.loadExecutions();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.closeModal();
        }
      });
    }
  }

  closeModal(): void {
    this.showConfirmModal = false;
    this.executionToDelete = null;
  }
}