import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-execution-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './execution-result.component.html',
  styleUrls: ['./execution-result.component.scss']
  
})
export class ExecutionResultComponent {
  @Input() title: string = 'Résultat d\'exécution';
  @Input() success: boolean = true;
  @Input() output: string = '';
  @Input() error: string = '';
  
  isCollapsed = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}