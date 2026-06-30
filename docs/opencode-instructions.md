# OpenCode Instructions — Viaje Tanto

## Objetivo

Implementar el proyecto respetando la documentación.

## Orden de lectura

1. `README.md`
2. `docs/project-brief.md`
3. `docs/product-spec.md`
4. `docs/design-spec.md`
5. `docs/content-model.md`
6. `docs/trip-proposal-structure.md`
7. `docs/architecture.md`

`docs/architecture.md` es obligatorio antes de implementar: define dónde vive cada dato, qué consume cada página, cómo se resuelven `sourceRef`, qué campos se calculan al vuelo y cómo se conectan Astro, las APIs nativas del navegador, React opcional y los componentes.

## Reglas obligatorias

### No generar HTML específico por propuesta

Cada propuesta debe ser un archivo de datos.

### No duplicar componentes

Crear componentes reutilizables por tipo de slide.

### Renderizador central

Implementar un único `SlideRenderer`.

### Interacciones por defecto

Usar Astro, HTML estático y APIs nativas del navegador para interacciones simples.

React no es obligatorio. Usarlo solo si la presentación o el comparador requieren estado no trivial de teclado, tacto, progreso, visibilidad o foco que no quede limpio con vanilla.

Si se usa React para la presentación, `SlideRenderer.astro` debe pre-renderizar las slides. React solo controla visibilidad, foco, progreso y navegación alrededor de esos nodos ya renderizados; no debe invocar componentes Astro dinámicamente.

Si se usa React, mantener render puro, estado local, valores derivados durante render, refs solo como escape hatch del DOM/navegador, y evitar Effects/memoización/useCallback innecesarios.

### Slides variables

No asumir una cantidad fija.

### Imágenes múltiples

Los componentes deben soportar una o varias imágenes.

### Presupuesto variable

Las categorías de presupuesto deben ser dinámicas.

### Totales calculados

La estructura puede incluir `budget.calculatedTotals` porque los archivos existentes ya siguen ese formato, pero la aplicación no debe confiar en esos valores como fuente de verdad.

Los totales se recalculan al cargar/renderizar desde los ítems de presupuesto y estados `pending`. El valor derivado es el que usan home, presentación y comparador.

No mostrar totales inconsistentes.

### Proyecciones para home y comparador

La home y el comparador no deben consumir la propuesta completa.

Usar funciones de proyección según `docs/architecture.md` para exponer solo los campos necesarios y evitar cargar slides, itinerario, galería completa o destinos detallados.

### Datos faltantes

Usar `null` y `pending`.

No inventar.

### Nuevas propuestas

Cuando se entregue una propuesta nueva:

1. Leer el documento.
2. Normalizarlo.
3. Crear el archivo de datos.
4. Mover y optimizar imágenes.
5. Validar.
6. Registrar la propuesta.
7. Confirmar que aparece en home, presentación y comparador.

## Arquitectura sugerida

```text
src/
  content/
    trips/

  components/
    presentation/
      SlideRenderer.astro
      CoverSlide.astro
      EditorialSlide.astro
      ReasonsSlide.astro
      RouteSlide.astro
      DestinationSlide.astro
      GallerySlide.astro
      ItinerarySlide.astro
      PaceSlide.astro
      NightlifeSlide.astro
      GastronomySlide.astro
      BudgetSlide.astro
      ProsConsSlide.astro
      HighlightSlide.astro
      FullImageSlide.astro
      SplitImageSlide.astro
      ComparisonSummarySlide.astro
      ClosingSlide.astro

    comparison/

  pages/
    index.astro
    comparar.astro
    viajes/
      [slug].astro

  schemas/
    trip.schema.ts
```

## Regla para componentes nuevos

Crear un nuevo tipo de slide solo cuando:

- El contenido no pueda representarse con uno existente.
- El patrón sea reutilizable.
- Se agregue al schema.
- Se documente.
- Se agreguen pruebas.

## Validación final

Antes de terminar:

- Ejecutar build.
- Validar tipos.
- Validar schema.
- Revisar responsive.
- Revisar teclado.
- Revisar imágenes.
- Revisar presupuesto.
- Revisar comparador.
- Confirmar deploy compatible con Vercel.
