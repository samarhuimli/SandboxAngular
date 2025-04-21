import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const loadPyodide: any; // 👈 pour éviter les erreurs TypeScript sur loadPyodide

@Component({
  selector: 'app-python-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './python-editor.component.html',
  styleUrls: ['./python-editor.component.scss']
})
export class PythonEditorComponent {
  templates = [
    {
      title: 'Python 3.12',
      description: 'Start with the latest stable Python version',
      author: 'By FinConnect 😊',
      code: `# Python 3.12 Template
def main():
    print("Hello from Python 3.12!")
main()
`
    },
    // Tu peux ajouter d'autres templates ici
  ];

  selectedTemplate: string = '';
  output: string = '';
  isRunning: boolean = false;
  pyodide: any = null;

  useTemplate(code: string) {
    this.selectedTemplate = code;
    localStorage.setItem('pythonTemplate', code);
  }

  async runCode() {
    if (!this.selectedTemplate) return;

    this.isRunning = true;
    this.output = 'Running Python code...\n';

    try {
      if (!this.pyodide) {
        this.pyodide = await loadPyodide({
          stdout: (text: string) => {
            this.output += text + '\n';
          }
        });
        await this.pyodide.loadPackage(['numpy']);
      }

      const result = await this.pyodide.runPython(this.selectedTemplate);

      if (result) {
        this.output += '\nResult: ' + result;
      }
    } catch (error: any) {
      this.output += '\nError: ' + error.message;
    } finally {
      this.isRunning = false;
    }
  }

  saveToFile() {
    const blob = new Blob([this.selectedTemplate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python_script.py';
    a.click();
    URL.revokeObjectURL(url);
  }

  clearEditor() {
    this.selectedTemplate = '';
    this.output = '';
  }
}
