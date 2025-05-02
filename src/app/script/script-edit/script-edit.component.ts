import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScriptService, Script } from '../../services/script.service';
import { ExecutionResultComponent } from '../../execution-result/execution-result.component';
import { ExecutionService } from 'src/app/services/execution.service';
import { NgForm } from '@angular/forms';




declare function loadPyodide(config: {
  stdout?: (text: string) => void,
  stderr?: (text: string) => void
}): Promise<any>;


@Component({
  selector: 'app-script-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ExecutionResultComponent],
  templateUrl: './script-edit.component.html',
})
export class ScriptEditComponent implements OnInit {

  scriptId!: number;
  script: Script = { id: 0, title: '', type: 'PYTHON', createdBy: '', content: '' }; // 🔥 Valeurs par défaut

  output: string = '';
  isRunning: boolean = false;
  pyodide: any = null;
  
  constructor(
    private route: ActivatedRoute,
    private scriptService: ScriptService,
    private router: Router,
    private executionService: ExecutionService // ⚠️ Assure-toi que ce service est bien injecté
  ) {}
  

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.scriptId = +id;
        // 🔥 Correction ici : on s'abonne à l'observable
        this.scriptService.findScriptById(this.scriptId).subscribe({
          next: (foundScript) => {
            this.script = { ...foundScript };
          },
          error: (err) => {
            console.error('Script non trouvé', err);
            this.router.navigate(['/scripts']);
          }
        });
      }
    });
  }

  async runCode() {
    if (!this.script.content || this.script.type !== 'PYTHON') return;
  
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
  
      const result = await this.pyodide.runPython(this.script.content);
      if (result) this.output += '\nRésultat: ' + result;
  
      const executionTime = performance.now() - startTime;
  
      this.executionService.saveExecutionResult({
        scriptId: this.script.id,
        output: this.output,
        status: 'SUCCESS',
        executionTime: executionTime
      }).subscribe();
  
    } catch (error: any) {
      this.output += '\nErreur: ' + error.message;
  
      const executionTime = performance.now() - startTime;
  
      this.executionService.saveExecutionResult({
        scriptId: this.script.id,
        output: this.output,
        error: error.message,
        status: 'FAILED',
        executionTime: executionTime
      }).subscribe();
  
    } finally {
      this.isRunning = false;
    }
  }
  
  saveToFile() {
    if (!this.script.content) return;
  
    const filename = this.script.title ? `${this.script.title.replace(/[^a-z0-9]/gi, '_')}.py` : 'script.py';
    const blob = new Blob([this.script.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  clearEditor() {
    if (!this.script.content || confirm('Voulez-vous vraiment effacer le contenu ?')) {
      this.script.content = '';
      this.output = '';
    }
  }
  

  focusTextarea(event: MouseEvent) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.setSelectionRange(0, 0);
    textarea.focus();
  }
  
  saveScript() {
    if (!this.script.title || !this.script.type || !this.script.createdBy || !this.script.content) {
      return;
    }
  
    this.scriptService.updateScript(this.scriptId, this.script).subscribe(() => {
      this.router.navigate(['/scripts']);
    });
  }
  

  cancel() {
    this.router.navigate(['/scripts']);
  }
}
