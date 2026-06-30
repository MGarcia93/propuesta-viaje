# Viaje Tanto

Viaje Tanto es una aplicación web para presentar y comparar propuestas de viaje entre amigos.

La experiencia reemplaza una presentación tradicional por una web visual e interactiva con:

- Catálogo de propuestas.
- Presentaciones editoriales por viaje.
- Slides variables generadas desde datos.
- Itinerarios.
- Presupuestos.
- Comparación entre propuestas.
- Diseño responsive.
- Deploy en Vercel.

## Documentación


Leer en este orden:

1. `docs/project-brief.md`
2. `docs/product-spec.md`
3. `docs/design-spec.md`
4. `docs/content-model.md`
5. `docs/architecture.md`
6. `docs/trip-proposal-structure.md`
7. `docs/opencode-instructions.md`

## Tecnología

- Astro.
- TypeScript.
- Tailwind CSS.
- React opcional, solamente cuando la interacción con estado lo justifique.
- Content Collections o archivos estructurados.
- Deploy en Vercel.
- Sin backend.
- Sin base de datos.
- Sin autenticación.

## Principio principal

Las propuestas no son páginas programadas individualmente.

Cada propuesta es un archivo de datos que define:

- Metadatos.
- Contenido.
- Recorrido.
- Itinerario.
- Presupuesto.
- Puntajes.
- Imágenes.
- Slides.
- Orden narrativo.

El sitio renderiza todas las propuestas mediante componentes reutilizables.
