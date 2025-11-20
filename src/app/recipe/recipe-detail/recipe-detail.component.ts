import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../Recipe';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent implements OnInit {
  // Receta pasada desde el componente padre (RecipeList) después de
  // obtener el detalle remoto usando RecipeService.
  @Input() recipe: Recipe | null = null;

  constructor() {}
  ngOnInit(): void {}
}
