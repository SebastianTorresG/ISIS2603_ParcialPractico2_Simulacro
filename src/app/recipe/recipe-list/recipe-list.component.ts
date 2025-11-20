import { Component, OnInit } from '@angular/core';
import { Recipe } from '../Recipe';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: false,
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit {
  // Lista de recetas que se mostrará en la vista
  recipes: Recipe[] = [];
  // Estados para UX: seleccionado, cargando y errores
  selected = false;
  loading = false;
  error: string | null = null;
  selectedRecipe: Recipe | null = null;

  // Inyectamos el servicio para separar la lógica de datos de la UI
  constructor(private readonly recipeService: RecipeService) {}

  ngOnInit() {
    // Al iniciar el componente solicitamos al servicio la lista remota.
    // Preferimos hacerlo aquí y almacenar el resultado en `recipes`.
    this.loading = true;
    this.error = null;
    this.recipeService.listRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.loading = false;
      },
      error: (err) => {
        // Mensaje amigable para la UI; `handleError` ya hace console.error
        this.error = err?.message ?? 'No se pudo cargar la lista de recetas';
        this.loading = false;
      }
    });
  }

  // Cuando el usuario selecciona una receta, pedimos el detalle al servicio.
  // De esta forma sólo cargamos el JSON de detalle cuando se necesita.
  onSelect(recipe: Recipe) {
    this.selected = false;
    this.loading = true;
    this.error = null;
    this.recipeService.getRecipeById(recipe.id).subscribe({
      next: (detail) => {
        this.selectedRecipe = detail;
        this.selected = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'No se pudo cargar el detalle de la receta';
        this.loading = false;
      }
    });
  }
}
