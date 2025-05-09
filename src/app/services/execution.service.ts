import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ExecutionResultDTO } from '../models/execution-result.model';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  deleteExecution(executionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/executions/${executionId}`, {
      observe: 'response'
    }).pipe(
      tap(response => console.log('Réponse suppression:', response)),
      map(response => response.body),
      catchError(err => {
        console.error('Erreur HTTP lors de la suppression:', err);
        return throwError(() => err);
      })
    );
  }

  saveExecutionResult(result: ExecutionResultDTO): Observable<any> {
    console.log('Envoi de la sauvegarde:', result);
    return this.http.post(`${this.apiUrl}/executions/save`, result).pipe(
      tap(response => console.log('Réponse de la sauvegarde:', response)),
      catchError(err => {
        console.error('Erreur HTTP lors de la sauvegarde:', err);
        return throwError(() => err);
      })
    );
  }

  executeRCode(code: string, scriptId: number | null): Observable<ExecutionResultDTO> {
    const body = { code, scriptId };
    console.log('Envoi du script R au serveur:', body);
    return this.http.post<ExecutionResultDTO>(`${this.apiUrl}/executions/executeR`, body).pipe(
      tap(response => console.log('Réponse de l\'exécution R:', response)),
      catchError(err => {
        console.error('Erreur HTTP lors de l\'exécution R:', err);
        return throwError(() => err);
      })
    );
  }

  getAllExecutionsGrouped(): Observable<any> {
    return this.http.get(`${this.apiUrl}/executions/grouped`);
  }
  getExecutionsByScriptId(scriptId: number): Observable<ExecutionResultDTO[]> {
    return this.http.get<ExecutionResultDTO[]>(`${this.apiUrl}/executions/byScriptId/${scriptId}`).pipe(
      tap(response => console.log('Réponse de getExecutionsByScriptId:', response)),
      catchError(err => {
        console.error('Erreur HTTP lors de la récupération des exécutions par scriptId:', err);
        return throwError(() => err);
      })
    );
  }
}