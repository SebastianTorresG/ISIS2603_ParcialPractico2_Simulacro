import { Component, OnInit } from '@angular/core';
import { Recipe } from '../Recipe';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  standalone: false,
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit {
  // Lista de recetas que se mostrará en la vista
  recipes: Recipe[] = [];
  // Estados para UX: cargando y errores
  loading = false;
  error: string | null = null;

  // Inyectamos el servicio para separar la lógica de datos de la UI
  // y Router para navegar hacia la ruta de detalle.
  constructor(private readonly recipeService: RecipeService, private readonly router: Router) {}

  ngOnInit() {
    // Al iniciar el componente solicitamos al servicio la lista remota.
    // Preferimos hacerlo aquí y almacenar el resultado en `recipes`.
    // Comentario: realizamos la petición en ngOnInit para mantener el constructor
    // ligero y para que el componente no haga nada hasta que Angular haya
    // inicializado las dependencias.
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

  // Cuando el usuario selecciona una receta navegamos a la ruta /recipe/:id
  // El componente de detalle leerá el id desde la ruta y realizará la
  // petición para obtener la receta completa. Esto separa responsabilidades
  // y permite compartir la URL directamente.
  onSelect(recipe: Recipe) {
    // Navegación programática: usamos Router para cambiar la URL a
    // `/recipe/:id`. El componente `RecipeDetailComponent` se encargará de
    // leer el parámetro y cargar la receta correspondiente.
    this.router.navigate(['/recipe', recipe.id]);
  }
}
