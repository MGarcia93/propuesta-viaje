# Content Model — Viaje Tanto

## 1. Principio

Cada propuesta es un archivo de datos.

No contiene HTML.

No contiene componentes.

No contiene lógica.

## 2. Formato recomendado

Usar una Content Collection de Astro con archivos YAML, JSON o Markdown con frontmatter estructurado.

Preferencia:

```text
src/content/trips/
  propuesta-uno.yaml
  propuesta-dos.yaml
```

## 3. Estructura principal

```yaml
id:
slug:
name:
shortName:
status:
version:
lastUpdated:

countries: []
regions: []

durationDays:
durationNights:
estimatedDates:
recommendedSeason:
travelers:
departureCity:
arrivalCity:
returnCity:

catalog:
  title:
  subtitle:
  summary:
  tags: []
  pace:
  budgetLevel:
  bestArgument:
  mainConcession:

visual:
  accentColor:
  textColor:
  coverImage:
  cardImage:
  socialImage:
  imageStyle:

scores: {}
scoreRationale: {}

concept:
  overview:
  reasons: []
  idealFor: []
  notIdealFor: []

route: []
destinations: []
itinerary: []

budget:
  currency:
  travelers:
  priceBasis:
  disclaimer:
  lastUpdated:
  items: []
  contingency: {}
  calculatedTotals: {}

flights: []
accommodations: []
transports: []

paceSummary: {}
nightlifeSummary: {}
gastronomy: {}
logistics: {}
requirements: {}

strengths: []
tradeoffs: []
risks: []
alternatives: {}

comparison: {}

slides: []
gallery: []
sources: []
missingInformation: []
```

## 4. Estado de valores

Campos sensibles pueden incluir:

```yaml
value:
status:
source:
lastUpdated:
```

Estados:

```text
confirmed
estimated
pending
```

## 5. Presupuesto

```yaml
budget:
  currency: USD
  travelers: 4
  priceBasis: per-person

  items:
    - category: flights
      label: Vuelos
      amountPerPerson: 1200
      note:
      status: estimated

    - category: accommodation
      label: Hospedaje
      amountPerPerson: 650
      note:
      status: estimated

  contingency:
    amountPerPerson: 150
    percentage:
    note:

  calculatedTotals:
    subtotalPerPerson:
    totalPerPerson:
    totalGroup:
```

Los totales deben calcularse desde `items` y `contingency` al cargar, construir o renderizar. `calculatedTotals` puede permanecer en la estructura para compatibilidad con archivos existentes, pero la aplicación no debe confiar en esos valores escritos: debe recalcularlos siempre desde los ítems. Los campos se llaman igual (`subtotalPerPerson`, `totalPerPerson`, `totalGroup`), solo cambia que el valor es derivado, no el que venga escrito en el YAML.

## 6. Slides

```yaml
slides:
  - id:
    type:
    order:
    title:
    subtitle:
    eyebrow:
    text:
    layout:
    image:
    images: []
    sourceRef:
```

## 7. Tipos de slide

```text
cover
editorial
reasons
route
destination
city
highlight
gallery
full-image
split-image
itinerary
pace
nightlife
gastronomy
budget
pros-cons
comparison-summary
closing
```

## 8. Imágenes

```yaml
images:
  - src:
    alt:
    caption:
    size:
    orientation:
    status:
```

## 9. Layouts

```text
default
collage
grid
masonry
hero-with-thumbs
side-by-side
full-bleed
text-left
text-right
```

## 10. Puntajes

Todos de 1 a 5.

```yaml
scores:
  culture:
  nature:
  nightlife:
  gastronomy:
  relaxation:
  adventure:
  technology:
  comfort:
  organizationDifficulty:
  budgetAccessibility:
  variety:
  visualImpact:
```

## 11. Validaciones

- `slug` único.
- `durationDays >= durationNights`.
- Suma de noches coherente.
- Presupuesto consistente.
- Puntajes válidos.
- Imágenes con alt.
- Slides con IDs únicos.
- Tipos de slide válidos.
- Layouts válidos.
- Estados válidos.
