import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface Script {
  id?: number;
  title: string;
  content: string;
  createdBy: string;
  type: 'PYTHON' | 'R' | 'SQL';
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  private apiUrl = 'http://localhost:8082/api/scripts';


  constructor(private http: HttpClient) {}

  // Récupérer tous les scripts
  getScripts(): Observable<Script[]> {
    return this.http.get<Script[]>(this.apiUrl);
  }

  // Ajouter un nouveau script
  createScript(script: Script): Observable<Script> {
    return this.http.post<Script>(this.apiUrl, script).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création du script', error);
        return throwError(() => new Error('Erreur lors de la création du script'));
      })
    );
  }
  

  // Modifier un script existant
  updateScript(id: number, script: Script): Observable<Script> {
    return this.http.put<Script>(`${this.apiUrl}/${id}`, script);
  }

  // Supprimer un script
  deleteScript(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Exécuter un script (simulé)
  executeScript(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/execute`, {});
  }
}
