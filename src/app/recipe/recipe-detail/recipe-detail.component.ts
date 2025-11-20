import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../Recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  // La receta se obtiene a partir del id en la ruta; inicializada a null.
  recipe: Recipe | null = null;
  loading = false;
  error: string | null = null;
  // Nombre del ingrediente más usado calculado (sin unidades)
  mostUsedIngredient: string | null = null;
  private sub: Subscription | null = null;

  // Inyectamos ActivatedRoute para obtener el parámetro :id, RecipeService
  // para recuperar el detail remoto y Router para navegación programática.
  constructor(
    private readonly route: ActivatedRoute,
    private readonly recipeService: RecipeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Subscribimos a cambios en los parámetros de la ruta para soportar
    // navegación dentro del componente (ej. cambiar id sin destruir componente).
    // Comentario: usar `paramMap` permite reaccionar si el usuario navega a
    // otra receta mientras el componente sigue montado; así evitamos recrear
    // el componente y manejamos la actualización internamente.
    this.sub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadRecipe(id);
      } else {
        this.recipe = null;
      }
    });
  }

  private loadRecipe(id: string) {
    this.loading = true;
    this.error = null;
    this.recipeService.getRecipeById(id).subscribe({
      next: (r) => {
        // Guardar la receta en el estado local para que la plantilla la muestre
        // y desactivar el spinner de carga.
        this.recipe = r;
        // Calcular el ingrediente más usado (por cantidad numérica)
        this.mostUsedIngredient = this.calculateMostUsedIngredient(r);
        this.loading = false;
      },
      error: (err) => {
        // Mostrar mensaje amigable en la UI; `handleError` del servicio ya
        // reporta detalles en consola si es necesario.
        this.error = err?.message ?? 'No se pudo cargar la receta';
        this.loading = false;
      }
    });
  }

  // Calcula el ingrediente con la mayor cantidad numérica (ignorando unidades).
  // Intenta parsear cantidades con decimales, comas y fracciones del tipo "1 1/2".
  private calculateMostUsedIngredient(recipe: Recipe): string | null {
    if (!recipe?.ingredientes?.length) { return null; }

    let maxQty = -Infinity;
    let chosenName: string | null = null;

    for (const ing of recipe.ingredientes) {
      const qty = this.parseQuantityValue(ing.cantidad);
      if (qty > maxQty) {
        maxQty = qty;
        chosenName = ing.nombre ? ing.nombre.toString() : null;
      }
    }

    // Si no encontramos cantidades numéricas, devolver el nombre del primer ingrediente (sin unidades).
    if (!chosenName && recipe.ingredientes.length) {
      chosenName = recipe.ingredientes[0].nombre || null;
    }

    // Limpiar el nombre (insertar espacios si hubiera partes pegadas) - similar a IngredientList formatName
    if (chosenName) {
      return chosenName
        .replaceAll(/([A-Za-zÁÉÍÓÚáéíóúÑñ])(?=\d)/g, '$1 ')
        .replaceAll(/(\d)(?=[A-Za-zÁÉÍÓÚáéíóúÑñ])/g, '$1 ')
        .trim();
    }
    return null;
  }

  // Parsear una cadena de cantidad a un número. Soporta formatos como:
  // "100", "1.5", "1,5", "1 1/2", "1/2". Si no se detecta número devuelve 0.
  private parseQuantityValue(s: any): number {
    if (!s) { return 0; }
    let str = String(s).trim();
    // Normalizar comas a puntos
    str = str.replaceAll(',', '.');

    // Fracción mixta: "1 1/2"
    const mixedMatch = /^(\d+)\s+(\d+)\/(\d+)/.exec(str);
    if (mixedMatch) {
      const whole = Number.parseFloat(mixedMatch[1]);
      const num = Number.parseFloat(mixedMatch[2]);
      const den = Number.parseFloat(mixedMatch[3]);
      if (!Number.isNaN(whole) && !Number.isNaN(num) && !Number.isNaN(den) && den !== 0) {
        return whole + (num/den);
      }
    }

    // Fracción simple: "1/2"
    const fracMatch = /^(\d+)\/(\d+)/.exec(str);
    if (fracMatch) {
      const num = Number.parseFloat(fracMatch[1]);
      const den = Number.parseFloat(fracMatch[2]);
      if (!Number.isNaN(num) && !Number.isNaN(den) && den !== 0) { return num/den; }
    }

    // Buscar el primer número decimal/int en la cadena
    const numMatch = /(\d+(?:\.\d+)?)/.exec(str);
    if (numMatch) {
      const v = Number.parseFloat(numMatch[1]);
      if (!Number.isNaN(v)) { return v; }
    }

    return 0;
  }

  // Limpieza de la suscripción al destruir el componente (buena práctica)
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // Método para regresar al listado usando navegación programática.
  // Método para regresar: primero intentamos retroceder en el historial del navegador
  // para mantener el flujo de navegación del usuario. Si no hay historial, como
  // fallback navegamos al listado de recetas.
  goBack(): void {
    // Use globalThis to satisfy the linter; fall back to router navigation.
    if (globalThis?.history && globalThis.history.length > 1) {
      globalThis.history.back();
    } else {
      this.router.navigate(['/recipe']);
    }
  }
}
