import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScriptService, Script } from '../../services/script.service';

@Component({
  selector: 'app-script-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './script-edit.component.html',
})
export class ScriptEditComponent implements OnInit {

  scriptId!: number;
  script: Script = { id: 0, title: '', type: 'PYTHON', createdBy: '', content: '' }; // 🔥 Valeurs par défaut

  constructor(
    private route: ActivatedRoute,
    private scriptService: ScriptService,
    private router: Router
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

  saveScript() {
    this.scriptService.updateScript(this.scriptId, this.script).subscribe(() => {
      this.scriptService.getAllScriptsFromBackend(); // 🔥 Recharge la liste complète après modification
      this.router.navigate(['/scripts']);
    });
  }
  

  cancel() {
    this.router.navigate(['/scripts']);
  }
}
