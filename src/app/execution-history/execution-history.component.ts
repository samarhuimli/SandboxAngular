import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExecutionService } from 'src/app/services/execution.service';
import { ExecutionResultComponent } from '../execution-result/execution-result.component';

@Component({
  selector: 'app-execution-history',
  standalone: true,
  imports: [CommonModule ,ExecutionResultComponent],
  templateUrl: './execution-history.component.html',
  styleUrls: ['./execution-history.component.scss'],
  providers: [DatePipe]
})


export class ExecutionHistoryComponent implements OnInit {
  groupedExecutions: any[] = [];
  isLoading: boolean = true;

@Input() title: string = '';
@Input() success: boolean = false;
@Input() output: string = '';
@Input() error?: string;


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
        console.log('RAW EXECUTION DATA:', data); // 💡 debug
        this.groupedExecutions = this.processData(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private processData(data: any[]): any[] {
    return data.map(group => {
      const firstExec = group.executions[0] || {};
  
      return {
        ...group,
        scriptTitle: group.title || firstExec.title || firstExec.scriptTitle || 'Script sans titre',
        executions: group.executions.map((exec: any) => ({
          ...exec,
          status: exec.success ? 'success' : 'failed', // ✅ ajoute ceci
          formattedTime: this.formatExecutionTime(exec.executionTime),
          formattedDate: exec.timestamp ? 
            this.datePipe.transform(exec.timestamp, 'dd/MM/yy HH:mm') : '',
          isCollapsed: true
        }))
      };
    });
  }
  

  private formatExecutionTime(time?: number): string {
    if (!time) return '-';
    return time < 1000 ? `${time} ms` : `${(time / 1000).toFixed(2)} s`;
  }

  toggleExecution(execution: any): void {
    execution.isCollapsed = !execution.isCollapsed;
  }
  

  isSuccess(status: string): boolean {
    if (!status) return false;
    const normalized = status.toLowerCase();
    return normalized === 'success';
  }
  
}
