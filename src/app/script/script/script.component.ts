import { Component, OnInit } from '@angular/core';
import { ScriptService, Script } from '../../services/script.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-script',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './script.component.html',
})
export class ScriptComponent implements OnInit {

  mode: 'list' = 'list';  // Toujours en mode liste
  scripts: Script[] = [];  // Liste dynamique des scripts
  selectedScript: Script | null = null;

  constructor(private scriptService: ScriptService, private router: Router) {}

  ngOnInit(): void {
    // Récupérer la liste des scripts depuis le service
    this.scriptService.getScriptsObservable().subscribe(scripts => {
      this.scripts = scripts;  // Met à jour la liste locale des scripts
    });
  }

  openViewModal(script: Script) {
    this.selectedScript = script;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('viewScriptModal'));
    modal.show();
  }

  deleteScript(id: number) {
    // Supprimer le script via le service
    this.scriptService.deleteScript(id).subscribe(() => {
      // Mettre à jour la liste des scripts localement après suppression
      this.scripts = this.scripts.filter(s => s.id !== id);
      // Mettre à jour le localStorage après suppression
      this.scriptService.updateScripts(this.scripts);
    });
  }
  // Modifiez votre méthode copyToClipboard dans script.component.ts
copyToClipboard(text: string) {
  if (text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Texte copié !');
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  }
}

  // Télécharge un script fictif
  downloadScript() {
    const element = document.createElement('a');
    const file = new Blob(['Contenu du script'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'script.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
