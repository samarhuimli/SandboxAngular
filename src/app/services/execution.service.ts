import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ExecutionResultDTO } from '../models/execution-result.model';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  deleteExecution(executionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/executions/${executionId}`, {
      observe: 'response' // Pour voir la réponse complète
    }).pipe(
      tap(response => console.log('Réponse suppression:', response)),
      map(response => response.body)
    );
  }
  // Base URL propre pour le backend
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  // Enregistre le résultat d'une exécution
  saveExecutionResult(result: ExecutionResultDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/executions/save`, result);
  }

  

  // Récupère toutes les exécutions groupées par script
  getAllExecutionsGrouped(): Observable<any> {
    return this.http.get(`${this.apiUrl}/executions/grouped`);
  }
  

  
}
