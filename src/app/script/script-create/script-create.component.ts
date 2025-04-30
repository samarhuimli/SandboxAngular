import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Script, ScriptService } from '../../services/script.service';
import { ExecutionService } from '../../services/execution.service';
import { ExecutionResultComponent } from '../../execution-result/execution-result.component';
import { ExecutionResultDTO } from 'src/app/models/execution-result.model';

declare function loadPyodide(config: {
  stdout?: (text: string) => void,
  stderr?: (text: string) => void
}): Promise<any>;

@Component({
  selector: 'app-script-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ExecutionResultComponent],
  templateUrl: './script-create.component.html',
  styleUrls: ['./script-create.component.scss']
})
export class ScriptCreateComponent {
  executionResult = {
    title: 'Mon Script Python',
    success: false,
    output: 'Début de l\'exécution...\nCalcul terminé',
    error: 'Erreur: Division par zéro à la ligne 15'
  };

  @Input() form: Script = {
    title: '',
    content: '',
    createdBy: '',
    type: 'PYTHON'
  };
  @Input() isEdit = false;
  @Output() submitFormEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  output: string = '';
  isRunning: boolean = false;
  pyodide: any = null;

  constructor(
    private scriptService: ScriptService,
    private router: Router,
    private executionService: ExecutionService
  ) {}

  async runCode() {
    if (!this.form.content || this.form.type !== 'PYTHON') return;

    const startTime = performance.now();
    this.isRunning = true;
    this.output = 'Exécution du code Python...\n';

    try {
        if (!this.pyodide) {
            this.pyodide = await loadPyodide({
                stdout: (text: string) => this.output += text,
                stderr: (text: string) => this.output += text
            });
            await this.pyodide.loadPackage(['numpy']);
        }

        const result = await this.pyodide.runPython(this.form.content);
        if (result) {
            this.output += '\nRésultat: ' + result;
        }

        // CORRECTION ICI: Convertir en nombre (millisecondes)
        const executionTime = performance.now() - startTime;

        const executionResult: ExecutionResultDTO = {
            scriptId: this.form.id,
            output: this.output,
            status: 'SUCCESS',
            executionTime: executionTime // Envoyé comme number
        };

        this.executionService.saveExecutionResult(executionResult).subscribe();
    } catch (error: any) {
        this.output += '\nErreur: ' + error.message;

        // CORRECTION ICI aussi
        const executionTime = performance.now() - startTime;

        const executionResult: ExecutionResultDTO = {
            scriptId: this.form.id,
            output: this.output,
            error: error.message,
            status: 'FAILED',
            executionTime: executionTime // Envoyé comme number
        };

        this.executionService.saveExecutionResult(executionResult).subscribe();
    } finally {
        this.isRunning = false;
    }
}
  saveToFile() {
    if (!this.form.content) return;

    const filename = this.form.title ? `${this.form.title.replace(/[^a-z0-9]/gi, '_')}.py` : 'script.py';
    const blob = new Blob([this.form.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearEditor() {
    if (!this.form.content || confirm('Voulez-vous vraiment effacer le contenu ?')) {
      this.form.content = '';
      this.output = '';
    }
  }

  submitForm() {
    if (this.isEdit) {
      // Mise à jour du script
      this.scriptService.updateScript(this.form.id!, this.form).subscribe(() => {
        this.submitFormEvent.emit();
        this.router.navigate(['/scripts']);
      });
    } else {
      // Création d’un nouveau script
      this.scriptService.createScript(this.form).subscribe(newScript => {
        this.form.id = newScript.id; // Affecter l'ID pour lier les résultats d’exécution
        this.scriptService.addScriptToLocal(newScript);
        this.submitFormEvent.emit();

        this.runCode(); // Exécuter après la création
        this.router.navigate(['/scripts']);
      });
    }
  }

  cancel() {
    this.cancelEvent.emit();
  }
}
