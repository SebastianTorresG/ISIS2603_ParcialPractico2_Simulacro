import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Import HttpClientModule to enable HttpClient injection across the app.
// We add it here at the root so any feature module or service can
// inject HttpClient without importing the module repeatedly.
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipeModule } from './recipe/recipe.module';

@NgModule({
  declarations: [AppComponent],
  // HttpClientModule is provided at the root level so that services
  // like RecipeService can inject HttpClient anywhere in the app.
  imports: [BrowserModule, AppRoutingModule, RecipeModule, HttpClientModule],
  // No providers here; modules should not be listed in providers.
  bootstrap: [AppComponent],
})
export class AppModule {}
