# Product Specification — Viaje Tanto

## 1. Objetivo funcional

Construir una web para presentar, explorar y comparar propuestas de viaje.

## 2. Flujo de contenido

```text
Propuesta libre
      ↓
Normalización
      ↓
Archivo estructurado
      ↓
Validación
      ↓
Render automático en Astro
      ↓
Home + presentación + comparador
```

## 3. Páginas

### `/`

Debe incluir:

- Hero principal.
- Catálogo de propuestas.
- Comparación rápida.
- Acceso al comparador completo.

### `/viajes/[slug]`

Debe incluir:

- Presentación editorial.
- Controles anterior/siguiente.
- Indicador de progreso.
- Navegación por teclado.
- Vista detallada.
- Acceso al comparador.
- Navegación entre propuestas.

### `/comparar`

Debe incluir:

- Comparación completa.
- Múltiples propuestas en desktop.
- Selección de dos propuestas en mobile.
- Síntesis automática.

## 4. Catálogo

Cada propuesta debe mostrar:

- Imagen.
- Nombre.
- Resumen.
- Duración.
- Presupuesto estimado.
- Ritmo.
- Etiquetas.
- Principal fortaleza.
- Principal concesión.

Toda la tarjeta debe ser clickeable.

## 5. Presentación editorial

La presentación se genera desde `slides`.

No existe una cantidad fija de slides.

Cada propuesta puede usar una secuencia diferente.

Ejemplos:

```text
cover
editorial
route
destination
gallery
budget
closing
```

Otra propuesta podría usar:

```text
cover
reasons
highlight
gallery
city
nightlife
pace
budget
pros-cons
closing
```

## 6. Renderizador

Debe existir un único `SlideRenderer`.

El renderizador recibe una slide y selecciona el componente según `type`.

No generar páginas HTML específicas por viaje.

## 7. Tipos de slide

Soportar inicialmente:

- cover
- editorial
- reasons
- route
- destination
- city
- highlight
- gallery
- full-image
- split-image
- itinerary
- pace
- nightlife
- gastronomy
- budget
- pros-cons
- comparison-summary
- closing

## 8. Imágenes

Una slide puede tener:

- Una imagen principal.
- Varias imágenes.
- Ninguna imagen.

Debe soportar:

- Collage.
- Grilla.
- Masonry.
- Hero con miniaturas.
- Lado a lado.
- Full bleed.

## 9. Presupuesto

El presupuesto debe ser una lista variable de categorías.

Ejemplo:

```yaml
items:
  - category: flights
    label: Vuelos
    amountPerPerson: 1200

  - category: accommodation
    label: Hospedaje
    amountPerPerson: 650

  - category: transport
    label: Transporte
    amountPerPerson: 250
```

Las categorías no son obligatorias.

Cada propuesta puede agregar o quitar categorías.

Los totales se calculan automáticamente.

## 10. Comparador

Debe comparar:

- Duración.
- Presupuesto.
- Ritmo.
- Cultura.
- Naturaleza.
- Vida nocturna.
- Gastronomía.
- Aventura.
- Tecnología.
- Comodidad.
- Organización.
- Traslados.
- Tiempo libre.
- Variedad.
- Principal fortaleza.
- Principal concesión.

## 11. Datos faltantes

Los campos faltantes deben usar:

```yaml
value: null
status: pending
```

No inventar información.

## 12. Estados

```text
draft
incomplete
ready
published
```

## 13. Validaciones

- Suma de noches coherente.
- Días coherentes.
- Totales de presupuesto correctos.
- Puntajes entre 1 y 5.
- Imágenes con alt.
- Slides con IDs únicos.
- Slug único.
- Fuentes con fecha.
- Datos faltantes marcados.
- Sin HTML específico por propuesta.

## 14. Alcance inicial

Incluir:

- Home.
- Presentación.
- Slides variables.
- Vista detallada.
- Comparador.
- Responsive.
- Accesibilidad.
- SEO básico.
- Deploy en Vercel.

No incluir:

- Backend.
- CMS.
- Login.
- Base de datos.
- Reservas.
- Votación persistente.
