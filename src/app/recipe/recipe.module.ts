import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { IngredientModule } from '../ingredient/ingredient.module';


@NgModule({
  declarations: [RecipeListComponent, RecipeDetailComponent],
  // HttpClient is provided in AppModule for the whole application,
  // so we avoid importing HttpClientModule again here to prevent redundancy.
  imports: [CommonModule, IngredientModule],
  exports: [RecipeListComponent, RecipeDetailComponent],
})
export class RecipeModule {}
