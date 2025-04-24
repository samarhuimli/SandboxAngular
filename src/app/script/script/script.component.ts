import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScriptService, Script } from '../../services/script.service';

declare function loadPyodide(config: {
  stdout?: (text: string) => void,
  stderr?: (text: string) => void
}): Promise<any>;

// ✅ Pour manipuler la modale Bootstrap
declare var bootstrap: any;

@Component({
  selector: 'app-script',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './script.component.html',

})
export class ScriptComponent implements OnInit {
  scripts: Script[] = [];
  form: Script = {
    title: '',
    content: '',
    createdBy: '',
    type: 'PYTHON'
  };
  isEdit = false;
  editId?: number;
  mode: 'list' | 'form' = 'list';
  output: string = '';
  isRunning: boolean = false;
  pyodide: any = null;

  constructor(private scriptService: ScriptService) {}

  ngOnInit(): void {
    this.loadScripts();

    const templateCode = history.state.templateCode;
    if (templateCode) {
      this.showCreateForm(templateCode);
    }
  }

  loadScripts(): void {
    this.scriptService.getScripts().subscribe((data) => {
      this.scripts = data;
    });
  }

  showCreateForm(templateCode?: string): void {
    this.form = {
      title: '',
      content: templateCode ?? `# Python 3.12 Template\ndef main():\n    print("Hello from Python 3.12!")\nmain()`,
      createdBy: '',
      type: 'PYTHON'
    };
    this.isEdit = false;
    this.mode = 'form';
    this.output = '';
  }

  editScript(script: Script): void {
    this.form = { ...script };
    this.isEdit = true;
    this.editId = script.id;
    this.mode = 'form';
    this.output = '';
  }

  submitForm(): void {
    if (this.isEdit && this.editId !== undefined) {
      this.scriptService.updateScript(this.editId, this.form).subscribe(() => {
        this.loadScripts();
        this.mode = 'list';
      });
    } else {
      this.scriptService.createScript(this.form).subscribe(() => {
        this.loadScripts();
        this.mode = 'list';
      });
    }
  }

  deleteScript(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce script ?')) {
      this.scriptService.deleteScript(id).subscribe(() => {
        this.loadScripts();
      });
    }
  }

  cancel(): void {
    this.mode = 'list';
  }

  async runCode() {
    if (!this.form.content || this.form.type !== 'PYTHON') return;

    this.isRunning = true;
    this.output = 'Exécution du code Python...\n';

    try {
      if (!this.pyodide) {
        this.pyodide = await loadPyodide({
          stdout: (text: string) => {
            this.output += text;
          },
          stderr: (text: string) => {
            this.output += text;
          }
        });
        await this.pyodide.loadPackage(['numpy']);
      }

      const result = await this.pyodide.runPython(this.form.content);
      if (result) {
        this.output += '\nRésultat: ' + result;
      }
    } catch (error: any) {
      this.output += '\nErreur: ' + error.message;
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

  // ✅ NOUVEAU : Script sélectionné pour la modale
  selectedScript: any = null;

  // ✅ NOUVEAU : Ouvre la modale Bootstrap
  openViewModal(script: any): void {
    this.selectedScript = script;
    const modalElement = document.getElementById('viewScriptModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  // ✅ NOUVEAU : Copie le contenu du script
  copyToClipboard(): void {
    if (this.selectedScript?.content) {
      navigator.clipboard.writeText(this.selectedScript.content);
      alert("Contenu copié !");
    }
  }

  // ✅ NOUVEAU : Télécharge le script
  downloadScript(): void {
    if (this.selectedScript?.content) {
      const blob = new Blob([this.selectedScript.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.selectedScript.title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}
