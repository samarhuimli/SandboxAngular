import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <-- Ajout

declare const loadPyodide: any;

@Component({
  selector: 'app-scripts-spaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scripts-spaces.component.html',
  styleUrls: ['./scripts-spaces.component.scss']
})
export class ScriptsSpacesComponent {
  templates = [
    {
      title: 'Python 3.12',
      description: 'Start with the latest stable Python version.',
      author: 'By FinConnect 😊',
      code: `# Python 3.12 Template
def main():
    print("Hello from Python 3.12!")
main()
`
    },
    {
      title: 'Python 3.12',
      description: 'Start with the latest stable Python version.',
      author: 'By FinConnect 😊',
      code: `# Python 3.12 Template
def main():
    print("Hello from Python 3.12!")
main()
`
    },
    {
      title: 'Python 3.12',
      description: 'Start with the latest stable Python version.',
      author: 'By FinConnect 😊',
      code: `# Python 3.12 Template
def main():
    print("Hello from Python 3.12!")
main()
`
    },
    {
      title: 'Python 3.12',
      description: 'Start with the latest stable Python version.',
      author: 'By FinConnect 😊',
      code: `# Python 3.12 Template
def main():
    print("Hello from Python 3.12!")
main()
`
    },
    {
      title: 'R 4.1',
      description: 'Start with the latest stable R version.',
      author: 'By FinConnect 😊',
      code: `# R 4.1 Template
print("Hello from R 4.1!")
`
    },
    {
      title: 'R 4.1',
      description: 'Start with the latest stable R version.',
      author: 'By FinConnect 😊',
      code: `# R 4.1 Template
print("Hello from R 4.1!")
`
    },
   
  ];

  selectedTemplate: string = '';
  output: string = '';
  isRunning: boolean = false;
  pyodide: any = null;

  constructor(private router: Router) {} // <-- Injecte Router

  useTemplate(code: string) {
    // Optionnel: sauvegarde dans localStorage
    localStorage.setItem('pythonTemplate', code);

    // Redirection vers création de script avec le template
    this.router.navigate(['/scripts'], { state: { templateCode: code } });
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
