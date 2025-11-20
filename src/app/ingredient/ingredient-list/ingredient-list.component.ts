import { Component, Input } from '@angular/core';
import { Ingredient } from '../Ingredient';

@Component({
  selector: 'app-ingredient-list',
  standalone: false,
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css'],
})
export class IngredientListComponent {
  @Input() ingredients: Ingredient[] = [];
  // No constructor needed; the component only receives `@Input` data.

  // Formatea el nombre insertando espacios entre letras y números si están pegados.
  formatName(name: string): string {
    if (!name) { return '' }
    // Inserta espacio entre letra seguida de número y número seguido de letra
    return name
      .replaceAll(/([A-Za-zÁÉÍÓÚáéíóúÑñ])(?=\d)/g, '$1 ')
      .replaceAll(/(\d)(?=[A-Za-zÁÉÍÓÚáéíóúÑñ])/g, '$1 ')
      .trim();
  }

  // Formatea la cantidad y la unidad, agregando espacios si están pegados,
  // y limpando comas por puntos para consistencia visual.
  formatQuantity(ingredient: Ingredient): string {
    if (!ingredient) { return ''; }
    let cantidad = (ingredient.cantidad || '').toString().trim();
    let unidad = (ingredient.unidad || '').toString().trim();

    // Si la cantidad tiene letras pegadas (ej. '500g'), separa números y letras.
    cantidad = cantidad.replaceAll(/(\d)(?=[A-Za-zÁÉÍÓÚáéíóúÑñ])/g, '$1 ');
    cantidad = cantidad.replaceAll(/([A-Za-zÁÉÍÓÚáéíóúÑñ])(?=\d)/g, '$1 ');

    // Normalizar comas a punto en números (visual)
    cantidad = cantidad.replaceAll(',', '.');

    // Construir la cadena final: 'cantidad unidad' (si existen)
    if (cantidad && unidad) {
      return `${cantidad} ${unidad}`.replaceAll(/\s+/g, ' ').trim();
    }
    if (cantidad) { return cantidad; }
    if (unidad) { return unidad; }
    return '';
  }

  // Devuelve la cantidad y unidad pegadas sin espacio entre número y unidad.
  // Ejemplo: cantidad='100', unidad='ml' -> '100ml'
  formatQuantityNoSpace(ingredient: Ingredient): string {
    if (!ingredient) { return ''; }
    const cantidadRaw = (ingredient.cantidad || '').toString().trim();
    const unidadRaw = (ingredient.unidad || '').toString().trim();

    // Normalizar comas a puntos y espacios intermedios
    const cantidad = cantidadRaw.replaceAll(',', '.').replaceAll(/\s+/g, ' ').trim();
    const unidad = unidadRaw.replaceAll(/\s+/g, ' ').trim();

    if (cantidad && unidad) {
      // Pegamos sin espacio entre número y unidad
      return `${cantidad}${unidad}`;
    }
    if (cantidad) { return cantidad; }
    if (unidad) { return unidad; }
    return '';
  }

  // El componente solo recibe la lista de ingredientes via `@Input` y la
  // renderiza en la plantilla. No necesita lógica de ciclo de vida por ahora,
  // por eso no implementamos OnInit; mantener clases y dependencias simples
  // reduce advertencias de lint y facilita pruebas.
}
