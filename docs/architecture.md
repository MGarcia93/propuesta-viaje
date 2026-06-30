# Architecture — Viaje Tanto

## 1. Objetivo

Este documento define cómo se conectan:

- Los archivos de propuestas.
- El schema de validación.
- Las páginas de Astro.
- El renderizador de slides.
- Los componentes visuales.
- El comparador.
- Las imágenes.

El propósito es que OpenCode no tenga que inferir cómo consumir la estructura definida en `trip-proposal-structure.md`.

---

# 2. Principio principal

Cada propuesta de viaje es un archivo de datos estructurados.

No se debe crear:

- Una página HTML por viaje.
- Un componente exclusivo por viaje.
- Un archivo de lógica por viaje.
- Una copia del slider por propuesta.

La aplicación debe leer todas las propuestas desde una colección común.

---

# 3. Estructura de carpetas

```text
src/
├── content/
│   ├── config.ts
│   └── trips/
│       ├── propuesta-uno.yaml
│       ├── propuesta-dos.yaml
│       └── propuesta-tres.yaml
│
├── assets/
│   └── trips/
│       ├── propuesta-uno/
│       │   ├── cover.webp
│       │   ├── card.webp
│       │   ├── destination-01.webp
│       │   └── gallery-01.webp
│       └── propuesta-dos/
│
├── schemas/
│   └── trip.schema.ts
│
├── lib/
│   ├── trips.ts
│   ├── budget.ts
│   ├── comparison.ts
│   └── slides.ts
│
├── components/
│   ├── home/
│   │   ├── TripCatalog.astro
│   │   ├── TripCard.astro
│   │   └── QuickComparison.astro
│   │
│   ├── presentation/
│   │   ├── PresentationController.ts
│   │   ├── SlideRenderer.astro
│   │   ├── PresentationControls.astro
│   │   ├── CoverSlide.astro
│   │   ├── EditorialSlide.astro
│   │   ├── ReasonsSlide.astro
│   │   ├── RouteSlide.astro
│   │   ├── DestinationSlide.astro
│   │   ├── HighlightSlide.astro
│   │   ├── GallerySlide.astro
│   │   ├── FullImageSlide.astro
│   │   ├── SplitImageSlide.astro
│   │   ├── ItinerarySlide.astro
│   │   ├── PaceSlide.astro
│   │   ├── NightlifeSlide.astro
│   │   ├── GastronomySlide.astro
│   │   ├── BudgetSlide.astro
│   │   ├── ProsConsSlide.astro
│   │   └── ClosingSlide.astro
│   │
│   └── comparison/
│       ├── ComparisonDesktop.astro
│       ├── ComparisonMobile.astro
│       ├── ComparisonSummary.astro
│       └── ScoreIndicator.astro
│
└── pages/
    ├── index.astro
    ├── comparar.astro
    └── viajes/
        └── [slug].astro
```

---

# 4. Archivo fuente de una propuesta

Cada propuesta normalizada se guarda en:

```text
src/content/trips/<slug>.yaml
```

Ejemplo:

```text
src/content/trips/china-clasica.yaml
```

Ese archivo debe respetar la estructura definida en:

```text
docs/trip-proposal-structure.md
```

No debe contener HTML ni imports de componentes.

---

# 5. Registro automático de propuestas

Astro debe descubrir las propuestas mediante Content Collections.

Archivo:

```text
src/content/config.ts
```

Responsabilidad:

- Definir la colección `trips`.
- Aplicar el schema.
- Rechazar datos inválidos durante build.
- Exponer todas las propuestas mediante `getCollection("trips")`.

No mantener manualmente un array duplicado de propuestas.

---

# 6. Schema

Archivo:

```text
src/schemas/trip.schema.ts
```

Debe reflejar la estructura del archivo de propuesta.

Debe validar:

- Identificación.
- Catálogo.
- Identidad visual.
- Puntajes.
- Recorrido.
- Destinos.
- Itinerario.
- Presupuesto.
- Slides.
- Galería.
- Fuentes.
- Estados.
- Datos faltantes.

También debe validar enums:

```text
status
pace
budgetLevel
slide.type
slide.layout
image.orientation
value.status
```

Los tipos TypeScript deben derivarse del schema cuando sea posible.

---

# 7. Carga centralizada de datos

Archivo:

```text
src/lib/trips.ts
```

Debe exponer funciones como:

```ts
getAllTrips()
getPublishedTrips()
getTripCardProjections()
getTripComparisonProjections()
getTripBySlug(slug)
getAdjacentTrips(slug)
```

Ninguna página debe leer directamente archivos YAML individuales.
Las páginas de catálogo y comparador deben consumir funciones de proyección, no la propuesta completa.

---

# 8. Qué consume la home

Archivo:

```text
src/pages/index.astro
```

Debe obtener proyecciones livianas mediante:

```ts
getTripCardProjections()
```

Si se conserva `getPublishedTrips()` como API pública, no debe entregar la propuesta completa a la home por defecto: debe aceptar una opción de proyección o delegar internamente en `getTripCardProjections()`.

La home consume únicamente:

```text
id
slug
name
shortName
catalog
visual
durationDays
durationNights
budget
scores
comparison
```

Uso de cada bloque:

```text
catalog
Título, resumen, etiquetas, ritmo y argumentos de la tarjeta.

visual
Imagen de portada, imagen de tarjeta y color de acento.

durationDays / durationNights
Duración visible.

budget
Totales derivados por persona y estado del presupuesto.

scores
Indicadores visuales de comparación rápida.

comparison
Datos resumidos para comparar.
```

La home no debe consumir:

- Itinerario completo.
- Todos los destinos.
- Todos los vuelos.
- Todas las imágenes.
- Todas las slides.

Esto evita cargar contenido innecesario.

---

# 9. Qué consume la página de viaje

Archivo:

```text
src/pages/viajes/[slug].astro
```

Debe:

1. Obtener la propuesta con `getTripBySlug`.
2. Generar rutas estáticas con `getStaticPaths`.
3. Cargar la propuesta completa.
4. Renderizar slides con `SlideRenderer.astro`.
5. Conectar controles de presentación con HTML estático y APIs del navegador, salvo que React esté justificado.
6. Renderizar la vista detallada cuando corresponda.

Consume:

```text
Toda la propuesta
```

Especialmente:

```text
visual
slides
route
destinations
itinerary
budget
strengths
tradeoffs
gallery
sources
missingInformation
```

---

# 10. Presentación

Implementación por defecto:

```text
src/components/presentation/PresentationControls.astro
src/components/presentation/PresentationController.ts
```

React no es obligatorio. Usar `TripPresentation.tsx` o `PresentationControls.tsx` solo si los controles requieren estado no trivial de teclado, tacto, progreso, visibilidad o foco que no quede limpio con APIs nativas.

Responsabilidad:

- Recibir la lista `slides`.
- Calcular cantidad total.
- Mantener slide actual.
- Navegar anterior/siguiente.
- Mostrar progreso.
- Manejar teclado.
- Manejar controles táctiles.
- Cerrar o volver.
- No conocer detalles específicos de ningún viaje.

No debe interpretar contenido interno de una slide.

Si se usa React, Astro debe pre-renderizar el contenido de las slides con `SlideRenderer.astro`. React solo puede controlar visibilidad, foco, progreso y navegación alrededor de nodos ya renderizados; no debe invocar componentes Astro dinámicamente.

Si se usa React, seguir estas reglas: mantener el render puro, mantener estado local, derivar valores durante el render en vez de con Effects, evitar Effects que solo actualizan estado derivado, usar refs solo como escape hatch para APIs del DOM/navegador y no agregar memoización ni `useCallback` por defecto.

---

# 11. Renderizador de slides

Archivo:

```text
src/components/presentation/SlideRenderer.astro
```

Responsabilidad:

- Recibir una slide.
- Leer `slide.type`.
- Seleccionar el componente correcto.
- Pasar los datos sin transformaciones específicas del viaje.

Ejemplo conceptual:

```ts
switch (slide.type) {
  case "cover":
    return CoverSlide;

  case "editorial":
    return EditorialSlide;

  case "route":
    return RouteSlide;

  case "destination":
    return DestinationSlide;

  case "city":
    return DestinationSlide;

  case "highlight":
    return HighlightSlide;

  case "gallery":
    return GallerySlide;

  case "full-image":
    return FullImageSlide;

  case "split-image":
    return SplitImageSlide;

  case "budget":
    return BudgetSlide;

  case "closing":
    return ClosingSlide;
}
```

Debe existir un caso exhaustivo.

Un tipo de slide desconocido debe provocar error de validación.

Los tipos documentados `highlight`, `full-image` y `split-image` deben tener soporte explícito en el renderer aunque reutilicen layouts internos compartidos.

---

# 12. Qué toma cada tipo de slide

## cover

Toma:

```text
slide.title
slide.subtitle
slide.eyebrow
slide.image
visual.accentColor
durationDays
budget.calculatedTotals.totalPerPerson (recalculated from items)
```

## editorial

Toma:

```text
slide.title
slide.subtitle
slide.text
slide.image
slide.images
slide.layout
```

## reasons

Toma:

```text
concept.reasons
```

o contenido explícito en la slide mediante `sourceRef`.

## route

Toma:

```text
route
```

## destination / city

Toma:

```text
destinations
```

Filtrado mediante:

```text
slide.sourceRef
```

Ejemplo:

```yaml
sourceRef: destinations.beijing
```

## gallery

Toma:

```text
slide.images
```

o:

```text
gallery
```

según `sourceRef`.

## highlight

Toma contenido destacado propio de la slide o un bloque resuelto por `sourceRef`. Sirve para momentos clave que no son una ciudad completa.

## full-image

Toma una imagen principal (`slide.image`) con título, subtítulo y texto opcional. Debe degradar correctamente en mobile.

## split-image

Toma texto e imagen principal, o dos imágenes desde `slide.images`, para un layout dividido texto/imagen.

## itinerary

Toma:

```text
itinerary
```

Puede usar:

```text
sourceRef
```

para mostrar un rango de días.

## pace

Toma:

```text
paceSummary
```

## nightlife

Toma:

```text
nightlifeSummary
```

## gastronomy

Toma:

```text
gastronomy
```

## budget

Toma:

```text
budget.items
budget.contingency
budget.calculatedTotals (recalculated from items)
```

## pros-cons

Toma:

```text
strengths
tradeoffs
```

## comparison-summary

Toma:

```text
scores
comparison
catalog.bestArgument
catalog.mainConcession
```

## closing

Toma:

```text
catalog.bestArgument
catalog.mainConcession
concept.overview
```

---

# 13. sourceRef

`sourceRef` permite que una slide apunte a un bloque del archivo sin repetir datos.

Ejemplos:

```yaml
sourceRef: route
```

```yaml
sourceRef: destinations.beijing
```

```yaml
sourceRef: itinerary.days-1-3
```

```yaml
sourceRef: budget
```

```yaml
sourceRef: gallery.shanghai-night
```

```yaml
sourceRef: strengths, tradeoffs
```

```yaml
sourceRef: comparison
```

```yaml
sourceRef: scores
```

El renderizador debe resolver estas referencias mediante una función central.

Archivo sugerido:

```text
src/lib/slides.ts
```

Funciones sugeridas:

```ts
resolveSlideSource(trip, sourceRef)
resolveDestination(trip, id)
resolveItineraryRange(trip, range)
```

No duplicar datos extensos dentro de `slides` si ya existen en otro bloque.

---

# 14. Datos propios de una slide

Una slide puede tener contenido propio cuando no existe en otro bloque.

Ejemplo:

```yaml
slides:
  - id: intro
    type: editorial
    title: Un viaje de contrastes
    text: Texto narrativo exclusivo de esta slide.
```

Regla:

- Usar `sourceRef` para datos estructurados.
- Usar campos propios para contenido narrativo o de presentación.
- No duplicar itinerarios, presupuestos o destinos completos.

---

# 15. Presupuesto

Archivo:

```text
src/lib/budget.ts
```

Responsabilidad:

- Sumar categorías.
- Aplicar contingencia.
- Calcular total por persona.
- Calcular total del grupo.
- Validar números faltantes.
- Ignorar o marcar elementos pendientes.

Funciones sugeridas:

```ts
calculateBudgetSubtotal(items)
calculateContingency(budget)
calculateBudgetTotal(budget)
calculateGroupTotal(budget)
```

Los valores calculados deben derivarse siempre al cargar, construir o renderizar desde `items` y `contingency`. Si el YAML existente trae `budget.calculatedTotals`, esos valores se consideran metadatos heredados: no son fuente de verdad, se ignoran para render/comparación y se recalculan con los mismos nombres de campo (`subtotalPerPerson`, `totalPerPerson`, `totalGroup`).

---

# 16. Qué consume el comparador

Archivo:

```text
src/pages/comparar.astro
```

Debe cargar proyecciones livianas:

```ts
getTripComparisonProjections()
```

Si se conserva `getPublishedTrips()` como API pública, el comparador debe usar una opción de proyección o una función wrapper que no incluya itinerarios, galerías, slides, destinos detallados ni vuelos.

Consume únicamente:

```text
slug
name
shortName
visual
durationDays
durationNights
budget
scores
comparison
catalog.bestArgument
catalog.mainConcession
```

No debe cargar:

- Itinerarios.
- Galerías completas.
- Slides.
- Destinos detallados.

---

# 17. Comparación derivada

Archivo:

```text
src/lib/comparison.ts
```

Responsabilidad:

- Comparar puntajes.
- Detectar mayor y menor presupuesto.
- Detectar viaje más relajado.
- Detectar mayor impacto cultural.
- Detectar mayor variedad.
- Generar síntesis.

Funciones sugeridas:

```ts
compareTrips(trips)
getBestByScore(trips, score)
getCheapestTrip(trips)
getMostRelaxedTrip(trips)
buildComparisonSummary(trips)
```

No hardcodear conclusiones por nombre de viaje.

---

# 18. Imágenes

Ubicación:

```text
src/assets/trips/<slug>/
```

Ejemplo:

```text
src/assets/trips/china-clasica/
  cover.webp
  card.webp
  beijing-01.webp
  beijing-02.webp
  shanghai-night.webp
```

El archivo de propuesta debe referenciar imágenes del mismo viaje.

OpenCode debe:

- Renombrarlas de forma consistente.
- Optimizar formato.
- Generar alt.
- No usar imágenes remotas como solución final salvo indicación explícita.
- No inventar rutas inexistentes.

---

# 19. Alta de una propuesta

Cuando se entregue:

```text
incoming/propuesta.md
incoming/images/
```

OpenCode debe:

1. Leer `trip-proposal-structure.md`.
2. Normalizar la propuesta.
3. Crear:

```text
src/content/trips/<slug>.yaml
```

4. Copiar y optimizar imágenes en:

```text
src/assets/trips/<slug>/
```

5. Validar contra `trip.schema.ts`.
6. Ejecutar validaciones de presupuesto.
7. Ejecutar validaciones de noches y días.
8. Confirmar que las slides tienen tipos válidos.
9. Confirmar que aparece en home.
10. Confirmar que genera `/viajes/<slug>`.
11. Confirmar que aparece en `/comparar`.

No debe ser necesario registrar manualmente la propuesta si Content Collections la descubre automáticamente.

---

# 20. Archivos que OpenCode puede tocar al agregar una propuesta

Normalmente:

```text
src/content/trips/<slug>.yaml
src/assets/trips/<slug>/*
```

Solo si falta una capacidad reutilizable:

```text
src/components/presentation/<NewReusableSlide>.astro
src/schemas/trip.schema.ts
src/components/presentation/SlideRenderer.astro
docs/content-model.md
docs/design-spec.md
```

---

# 21. Archivos que no debe crear por propuesta

No crear:

```text
src/pages/viajes/<slug>.astro
src/components/trips/<slug>/*
src/data/<slug>-logic.ts
public/<slug>.html
```

No duplicar:

- Slider.
- Layout.
- Presupuesto.
- Comparador.
- Controles.
- Navegación.

---

# 22. Flujo completo

```text
trip-proposal-structure.md
        ↓
Propuesta normalizada
        ↓
src/content/trips/<slug>.yaml
        ↓
trip.schema.ts
        ↓
Content Collection
        ↓
src/lib/trips.ts
        ├── index.astro
        │     └── catálogo + comparación rápida
        │
        ├── comparar.astro
        │     └── scores + budget + comparison
        │
        └── viajes/[slug].astro
              └── SlideRenderer.astro pre-renderizado
                    └── controles nativos o React opcional
                          └── componente según slide.type
```

---

# 23. Regla final

`trip-proposal-structure.md` define qué datos produce una propuesta.

`content-model.md` define cómo se guardan esos datos.

`architecture.md` define quién consume cada dato y cómo se renderiza.

`opencode-instructions.md` define qué debe hacer OpenCode al incorporar una propuesta.
