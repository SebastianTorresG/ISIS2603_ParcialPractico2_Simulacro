import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Recipe } from './Recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly LIST_URL = 'https://raw.githubusercontent.com/2603-Uniandes/jsons/refs/heads/main/2025-10%20Recetas/recipe.json';

  constructor(private readonly http: HttpClient) { }

  listRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.LIST_URL).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener el detalle de una receta por su id.
   * Construimos la URL dinámica usando el id proporcionado por el cliente.
   * Usamos el mismo patrón de resiliencia que en listRecipes: retry + catchError.
   * Devuelve un Observable<Recipe> para que el componente pueda suscribirse o usar async pipe.
   */
  getRecipeById(id: number | string): Observable<Recipe> {
    const url = `https://raw.githubusercontent.com/2603-Uniandes/jsons/refs/heads/main/2025-10%20Recetas/${id}/recipe.json`;
    return this.http.get<Recipe>(url).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    const message = error?.message ?? 'Error desconocido en la petición HTTP';
    console.error('RecipeService HTTP Error:', error);
    return throwError(() => new Error(message));
  }
}
