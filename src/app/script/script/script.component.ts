import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Script } from '../../models/script.model';
import { ScriptService } from '../../services/script.service';



@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.scss']
})
export class ScriptComponent {
  scripts: Script[] = [];
  form: Script = { title: '', content: '', createdBy: '', type: 'PYTHON' };
  isEdit = false;
  editId?: number;
  message = '';
  isError = false;
  isLoading = false;

  constructor(private scriptService: ScriptService) {}

 

  // Modifier un script
  editScript(script: Script): void {
    this.form = { ...script };
    this.isEdit = true;
    this.editId = script.id;
  }

  // Supprimer un script
  deleteScript(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce script ?')) {
      this.isLoading = true;
      this.scriptService.deleteScript(id).subscribe({
        next: () => {
          // Mise à jour locale après suppression
          this.scripts = this.scripts.filter(s => s.id !== id);
          this.message = 'Script supprimé avec succès.';
          this.isError = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.message = 'Erreur lors de la suppression du script.';
          this.isError = true;
          this.isLoading = false;
        }
      });
    }
  }
  
  // Exécuter un script
  executeScript(id: number): void {
    this.isLoading = true;
    console.log('Exécution du script', id);
    setTimeout(() => {
      this.isLoading = false;
      this.message = 'Script exécuté avec succès.';
      this.isError = false;
    }, 1000);
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.form = { title: '', content: '', createdBy: '', type: 'PYTHON' };
    this.isEdit = false;
    this.editId = undefined;
  }

  // Soumettre le formulaire
  submitForm(): void {
    this.isLoading = true;
  
    if (this.isEdit && this.editId) {
      // Mode ÉDITION : on met à jour un script existant
      this.scriptService.updateScript(this.editId, this.form).subscribe({
        next: (updatedScript) => {
          const index = this.scripts.findIndex(s => s.id === this.editId);
          if (index !== -1) {
            this.scripts[index] = updatedScript; // mettre à jour dans le tableau local
          }
          this.message = 'Script mis à jour avec succès.';
          this.isError = false;
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.message = 'Erreur lors de la mise à jour du script.';
          this.isError = true;
          this.isLoading = false;
        }
      });
  
    } else {
      // Mode CRÉATION : on crée un nouveau script
      this.scriptService.createScript(this.form).subscribe({
        next: (newScript) => {
          this.scripts.push(newScript); // ajoute le script dans la liste
          this.message = 'Script créé avec succès.';
          this.isError = false;
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.message = 'Erreur lors de la création du script.';
          this.isError = true;
          this.isLoading = false;
        }
      });
    }
  }
  
  
}
