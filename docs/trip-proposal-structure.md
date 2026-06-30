# Plantilla maestra para normalizar propuestas de viaje

## Objetivo

Este archivo define la estructura estándar que debe tener cada propuesta de viaje antes de incorporarla al proyecto web.

La propuesta puede llegar como:

- Texto libre.
- Markdown.
- Notas.
- Documento.
- Itinerario incompleto.
- Lista de ciudades.
- Presupuesto parcial.
- Conjunto de enlaces.
- Conjunto de imágenes.

La tarea del asistente que use esta plantilla será:

1. Leer la propuesta original.
2. Detectar la información disponible.
3. Investigar información faltante cuando sea necesario.
4. No inventar datos.
5. Marcar claramente los datos no confirmados.
6. Reorganizar todo en la estructura definida en este documento.
7. Preparar una propuesta lista para convertir en YAML, JSON o Content Collection de Astro.

---

# 1. Reglas generales

## 1.1 No inventar información

Cuando un dato no esté disponible y no pueda verificarse:

```yaml
value: null
status: pending
```

No completar valores falsos para que la propuesta parezca terminada.

## 1.2 Diferenciar datos confirmados y estimados

Cada dato sensible o cambiante debe poder marcarse como:

```text
confirmed
estimated
pending
```

Ejemplos:

- Precio de vuelo.
- Precio de alojamiento.
- Requisitos migratorios.
- Duración de traslados.
- Precio de entradas.
- Temporada recomendada.

## 1.3 Moneda

Usar una moneda principal para toda la propuesta.

Preferencia:

```yaml
currency: USD
```

Cuando una fuente esté en otra moneda, conservar el valor original y agregar la conversión estimada por separado.

## 1.4 Puntajes

Todos los puntajes usan escala de 1 a 5.

```text
1 = muy bajo
2 = bajo
3 = medio
4 = alto
5 = muy alto
```

Excepciones:

```text
organizationDifficulty
1 = muy fácil de organizar
5 = muy difícil de organizar

budgetAccessibility
1 = muy cara
5 = muy accesible
```

## 1.5 Fechas y vigencia

Toda investigación debe incluir:

```yaml
lastUpdated: YYYY-MM-DD
```

Los precios deben considerarse estimativos y sujetos a cambio.

---

# 2. Estructura final obligatoria

La respuesta final debe respetar exactamente este orden.

---

# PROPUESTA DE VIAJE

## 2.1 Identificación

```yaml
id:
slug:
name:
shortName:
status: draft
version: 1
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
```

### Reglas

- `slug` debe usar minúsculas y guiones.
- `status` puede ser:
  - `draft`
  - `incomplete`
  - `ready`
  - `published`
- `travelers` representa la cantidad usada para estimar costos.

---

## 2.2 Resumen para catálogo

```yaml
catalog:
  title:
  subtitle:
  summary:
  tags: []
  pace:
  budgetLevel:
  bestArgument:
  mainConcession:
```

### Reglas

- `summary`: máximo 3 líneas.
- `pace`:
  - `relaxed`
  - `moderate`
  - `intense`
- `budgetLevel`:
  - `low`
  - `medium`
  - `high`
  - `premium`

---

## 2.3 Identidad visual

```yaml
visual:
  accentColor:
  textColor:
  coverImage:
  cardImage:
  socialImage:
  imageStyle:
```

### Reglas

- No inventar rutas de imágenes definitivas si todavía no existen.
- Usar `null` cuando no haya imagen.
- `imageStyle` puede describir el tono:
  - urbano
  - tropical
  - histórico
  - futurista
  - natural
  - nocturno
  - mixto

---

# 3. Puntajes comparativos

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

Agregar una justificación breve:

```yaml
scoreRationale:
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

---

# 4. Concepto narrativo

## 4.1 Idea general

Explicar en 2 a 4 párrafos:

- Qué tipo de viaje propone.
- Qué combina.
- Qué lo diferencia.
- Qué sensación busca generar.
- Qué ritmo tendría.
- Para qué grupo funciona mejor.

## 4.2 Por qué elegirlo

```yaml
reasons:
  - title:
    description:
  - title:
    description:
```

Entre 3 y 6 razones.

## 4.3 Ideal para

```yaml
idealFor:
  - 
```

## 4.4 No ideal para

```yaml
notIdealFor:
  - 
```

---

# 5. Recorrido general

```yaml
route:
  - order: 1
    city:
    country:
    nights:
    role:
    description:
    transportFromPrevious:
    transferDuration:
    arrivalMethod:
    departureMethod:
```

### Reglas

- Debe respetar el orden real del viaje.
- La suma de noches debe coincidir con `durationNights`.
- `role` debe explicar la función de esa etapa dentro del viaje.
- No limitar la cantidad de destinos.

---

# 6. Etapas o destinos detallados

Crear un bloque por cada destino.

```yaml
destinations:
  - id:
    city:
    country:
    nights:
    pace:
    role:
    description:
    whyIncluded:
    freeTime:
    notes: []

    activities:
      - name:
        category:
        description:
        estimatedDuration:
        optional:
        estimatedCostPerPerson:
        status:

    nightlife:
      - name:
        type:
        description:
        optional:
        estimatedCostPerPerson:
        status:

    foodHighlights:
      - name:
        type:
        description:
        estimatedCostPerPerson:
        status:

    images:
      - src:
        alt:
        caption:
        size:
        orientation:
        status:
```

### Categorías sugeridas

```text
culture
nature
nightlife
gastronomy
technology
history
shopping
relaxation
adventure
urban
```

### Tamaños sugeridos para imágenes

```text
large
medium
small
wide
full
```

### Orientación

```text
landscape
portrait
square
```

---

# 7. Itinerario día por día

```yaml
itinerary:
  - day:
    city:
    title:
    summary:
    intensity:
    transport:
    freeTimeHours:

    morning:
      - 

    afternoon:
      - 

    evening:
      - 

    notes:
      - 

    images:
      - src:
        alt:
        caption:
        status:
```

### Intensidad

```text
relaxed
moderate
intense
```

### Reglas

- No inventar actividades para completar días.
- Puede haber días agrupados si la propuesta original no tiene detalle diario.
- Debe quedar claro qué días incluyen traslados.

---

# 8. Presupuesto resumido

El presupuesto debe mostrarse por categorías variables.

```yaml
budget:
  currency: USD
  travelers:
  priceBasis: per-person
  disclaimer:
  lastUpdated:

  items:
    - category: flights
      label: Vuelos
      amountPerPerson:
      note:
      status:

    - category: accommodation
      label: Hospedaje
      amountPerPerson:
      note:
      status:

    - category: transport
      label: Transporte interno
      amountPerPerson:
      note:
      status:

    - category: food
      label: Comida
      amountPerPerson:
      note:
      status:

    - category: activities
      label: Entradas y actividades
      amountPerPerson:
      note:
      status:

    - category: insurance
      label: Seguro
      amountPerPerson:
      note:
      status:

    - category: visa
      label: Visa
      amountPerPerson:
      note:
      status:

    - category: extras
      label: Extras
      amountPerPerson:
      note:
      status:

  contingency:
    amountPerPerson:
    percentage:
    note:

  calculatedTotals:
    subtotalPerPerson:
    totalPerPerson:
    totalGroup:
```

### Reglas

- Las categorías son variables.
- Se pueden agregar o quitar categorías.
- `calculatedTotals` puede quedar en la estructura para archivos existentes, pero no es fuente de verdad.
- La aplicación debe recalcular los totales desde `items` y `contingency` al cargar, construir o renderizar.
- Si los totales escritos no coinciden con el cálculo, la validación debe reportar el desajuste y el render debe usar el valor recalculado.
- Todo valor debe indicar `confirmed`, `estimated` o `pending`.

---

# 9. Detalle opcional de vuelos

```yaml
flights:
  - type:
    from:
    to:
    departureDate:
    arrivalDate:
    airline:
    stops:
    duration:
    baggageIncluded:
    amountPerPerson:
    source:
    status:
```

### Tipos

```text
international
domestic
regional
```

---

# 10. Detalle opcional de alojamientos

```yaml
accommodations:
  - city:
    nights:
    type:
    area:
    rooms:
    peoplePerRoom:
    breakfastIncluded:
    amountPerNight:
    amountPerPerson:
    totalAmount:
    source:
    status:
    notes:
```

---

# 11. Detalle opcional de transportes

```yaml
transports:
  - from:
    to:
    type:
    duration:
    overnight:
    amountPerPerson:
    source:
    status:
    notes:
```

### Tipos sugeridos

```text
flight
train
bus
ferry
private-transfer
taxi
local-transport
rental-car
```

---

# 12. Ritmo del viaje

```yaml
paceSummary:
  relaxedDays:
  moderateDays:
  intenseDays:
  accommodationChanges:
  longTransfers:
  activityNights:
  freeTimeDays:
  description:
```

La descripción debe explicar:

- Dónde se concentra el cansancio.
- Qué días permiten descansar.
- Si el viaje está equilibrado.
- Qué parte podría eliminarse para relajarlo.

---

# 13. Vida nocturna

```yaml
nightlifeSummary:
  overview:
  quietNights:
  urbanNights:
  partyOptionalNights:

  experiences:
    - city:
      name:
      type:
      description:
      optional:
      estimatedCostPerPerson:
      status:
```

No limitar vida nocturna a discotecas.

También puede incluir:

- Mercados nocturnos.
- Miradores.
- Barrios.
- Bares.
- Paseos.
- Restaurantes.
- Espectáculos.

---

# 14. Gastronomía

```yaml
gastronomy:
  overview:
  dailyBudgetLow:
  dailyBudgetMedium:
  dailyBudgetComfortable:

  experiences:
    - city:
      name:
      type:
      description:
      estimatedCostPerPerson:
      status:

  possibleDifficulties:
    - 
```

---

# 15. Logística y requisitos

```yaml
logistics:
  internationalFlightDuration:
  internalFlights:
  trainTrips:
  busTrips:
  longestTransfer:
  accommodationChanges:

requirements:
  visa:
  passport:
  vaccines:
  travelInsurance:
  connectivity:
  paymentMethods:
  language:
  restrictions:
```

Cada campo cambiante debe incluir una nota de vigencia o fuente.

---

# 16. Fortalezas y concesiones

```yaml
strengths:
  - 

tradeoffs:
  - 

risks:
  - title:
    description:
    impact:
    status:
```

### Impacto

```text
low
medium
high
```

---

# 17. Alternativas

```yaml
alternatives:
  moreRelaxed:
    description:
    changes: []

  cheaper:
    description:
    changes: []

  moreComplete:
    description:
    changes: []
```

---

# 18. Datos específicos para comparación

```yaml
comparison:
  durationDays:
  durationNights:
  countriesCount:
  citiesCount:
  accommodationChanges:
  longTransfers:
  internationalFlightHours:
  requiresVisa:
  organizationDifficulty:
  languageBarrier:
  comfort:
  freeTime:
  experienceVariety:
  totalPerPerson:
  budgetLevel:
  pace:
```

---

# 19. Slides de la presentación

La presentación debe generarse desde datos.

No escribir HTML específico para cada propuesta.

Cada propuesta puede tener distinta cantidad de slides.

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

## Tipos de slide permitidos

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

## Layouts permitidos

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

## Imágenes múltiples

```yaml
images:
  - src:
    alt:
    caption:
    size:
    orientation:
    status:
```

### Regla importante

La cantidad y el orden de slides deben depender del contenido real.

No forzar:

- Una slide por ciudad.
- Una cantidad fija de páginas.
- Una galería obligatoria.
- Una estructura idéntica para todos los viajes.

---

# 20. Galería general

```yaml
gallery:
  - src:
    alt:
    caption:
    city:
    category:
    orientation:
    status:
```

---

# 21. Fuentes

```yaml
sources:
  - topic:
    name:
    url:
    accessedAt:
    notes:
```

Temas típicos:

- Vuelos.
- Alojamientos.
- Transporte.
- Requisitos migratorios.
- Entradas.
- Clima.
- Temporada.
- Actividades.

---

# 22. Datos faltantes

```yaml
missingInformation:
  - field:
    reason:
    priority:
    suggestedAction:
```

### Prioridad

```text
low
medium
high
blocking
```

---

# 23. Validaciones obligatorias

Antes de entregar la propuesta, validar:

```text
[ ] La suma de noches coincide con durationNights.
[ ] La cantidad de días coincide con durationDays.
[ ] Todos los destinos del itinerario existen en route.
[ ] Los totales del presupuesto coinciden con el desglose.
[ ] Todos los precios tienen estado.
[ ] Todas las imágenes tienen alt.
[ ] Todas las fuentes tienen fecha de consulta.
[ ] Los puntajes están entre 1 y 5.
[ ] organizationDifficulty está interpretado correctamente.
[ ] budgetAccessibility está interpretado correctamente.
[ ] No se inventaron datos faltantes.
[ ] Los datos pendientes están marcados.
[ ] La propuesta puede renderizarse sin HTML específico.
[ ] La cantidad de slides es coherente con el contenido.
[ ] La propuesta tiene resumen, recorrido, presupuesto, fortalezas y concesiones.
```

---

# 24. Formato de entrega final

El asistente debe devolver dos bloques.

## Bloque 1 — Propuesta estructurada

Entregar la propuesta completa siguiendo este documento.

## Bloque 2 — Informe de calidad

```yaml
qualityReport:
  completenessPercentage:
  readyForWebsite:
  blockingIssues: []
  pendingResearch: []
  assumptions: []
  validationErrors: []
```

---

# 25. Prompt recomendado para usar en otro chat

Copiar este texto junto con la propuesta original:

```text
Usá el archivo `trip-proposal-structure.md` como contrato de salida.

Voy a darte una propuesta de viaje en formato libre.

Tu tarea es:

1. Leerla completa.
2. Extraer toda la información útil.
3. Investigar en fuentes actuales cuando falten datos verificables.
4. No inventar información.
5. Marcar como `pending` aquello que no pueda confirmarse.
6. Convertir la propuesta a la estructura definida.
7. Mantener los textos narrativos claros y atractivos.
8. Preparar datos útiles para catálogo, presentación, presupuesto y comparador.
9. Elegir una cantidad y orden de slides coherentes con el contenido.
10. No generar HTML ni componentes.
11. No repetir código.
12. Entregar al final el informe de calidad y los datos faltantes.

Toda la información cambiante debe incluir fuente y fecha de consulta.
Los precios deben marcarse como confirmados, estimados o pendientes.
La respuesta debe respetar el orden del archivo de estructura.
```
