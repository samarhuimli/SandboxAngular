import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-execution-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './execution-result.component.html',
  styleUrls: ['./execution-result.component.scss']
})
export class ExecutionResultComponent implements OnChanges {
  @Input() executions: {
    success: boolean;
    output: string;
    error: string;
    date?: Date;
    createdBy?: string;
  }[] = [];

  @Input() title: string = 'Résultat d\'exécution';
  @Input() success?: boolean;
  @Input() output?: string;
  @Input() error?: string;
  @Input() date?: Date;
  @Input() createdBy?: string; // Nouvel input pour le créateur

  collapseStates: boolean[] = [];
  displayMode: 'single' | 'multiple' = 'multiple';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['executions']) {
      this.displayMode = 'multiple';
      this.collapseStates = this.executions.map(() => true);
    } else if (changes['success'] || changes['output'] || changes['error'] || changes['createdBy']) {
      this.displayMode = 'single';
      this.executions = [{
        success: this.success || false,
        output: this.output || '',
        error: this.error || '',
        date: this.date,
        createdBy: this.createdBy // Utilise le créateur passé en input
      }];
      this.collapseStates = [true];
    }
  }

  toggleCollapse(index: number): void {
    this.collapseStates[index] = !this.collapseStates[index];
  }
}