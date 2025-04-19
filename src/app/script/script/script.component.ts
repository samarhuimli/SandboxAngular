import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScriptService, Script } from '../../services/script.service';

@Component({
  selector: 'app-script',
  standalone: true, // OUI ici
  imports: [CommonModule, FormsModule], // + imports nécessaires
  templateUrl: './script.component.html',
})
export class ScriptComponent implements OnInit {
  scripts: Script[] = [];
  form: Script = { title: '', content: '', createdBy: '', type: 'PYTHON' };
  isEdit = false;
  editId?: number;
  mode: 'list' | 'form' = 'list'; // "list" pour la liste, "form" pour le formulaire

  constructor(private scriptService: ScriptService) {}

  ngOnInit(): void {
    this.loadScripts();
  }

  loadScripts(): void {
    this.scriptService.getScripts().subscribe((data) => {
      this.scripts = data;
    });
  }

  showCreateForm(): void {
    this.form = { title: '', content: '', createdBy: '', type: 'PYTHON' };
    this.isEdit = false;
    this.mode = 'form';
  }

  editScript(script: Script): void {
    this.form = { ...script };
    this.isEdit = true;
    this.editId = script.id;
    this.mode = 'form';
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
    if (confirm('Es-tu sûr de vouloir supprimer ce script ?')) {
      this.scriptService.deleteScript(id).subscribe(() => {
        this.loadScripts();
      });
    }
  }

  cancel(): void {
    this.mode = 'list';
  }
}
