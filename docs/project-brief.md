# Project Brief — Viaje Tanto

## Resumen

Viaje Tanto es una aplicación web para presentar distintas propuestas de viaje a un grupo de amigos.

La idea es reemplazar una presentación tradicional de PowerPoint por una experiencia web visual, interactiva y fácil de compartir.

La web debe permitir:

- Explorar propuestas.
- Recorrer cada viaje como una revista digital.
- Consultar itinerarios y presupuesto.
- Comparar opciones.
- Tomar una decisión en grupo.

## Objetivo

La experiencia debe combinar emoción visual e información concreta.

Primero debe permitir imaginar cómo sería cada viaje. Después debe facilitar la comparación racional.

## Público

Un grupo de amigos que quiere elegir su próximo viaje.

No está orientado a:

- Agencias.
- Clientes.
- Venta de paquetes.
- Reservas.
- Turismo comercial.

## Concepto de experiencia

```text
Portada general
      ↓
Explorar propuestas
      ↓
Seleccionar una propuesta
      ↓
Recorrer una presentación editorial
      ↓
Consultar detalles
      ↓
Volver y explorar otra
      ↓
Comparar
      ↓
Decidir
```

## Dirección visual

La web debe sentirse como una mezcla entre:

- Revista digital de viajes.
- Presentación interactiva.
- Catálogo cinematográfico.
- Comparador visual.

No debe parecer:

- Dashboard.
- Agencia de turismo.
- Tienda.
- Landing genérica.
- PowerPoint copiado a HTML.

## Propuestas

Las propuestas concretas se entregarán posteriormente.

Pueden llegar como:

- Markdown.
- Texto libre.
- Itinerario.
- Documento.
- Notas.
- Conjunto de imágenes.

Cada propuesta debe normalizarse a una estructura común antes de incorporarse.

No asumir:

- Cantidad fija de propuestas.
- Cantidad fija de slides.
- Cantidad fija de ciudades.
- Cantidad fija de imágenes.
- Categorías de presupuesto obligatorias.

## Principio técnico central

Las propuestas se representan como datos estructurados.

No se debe generar HTML exclusivo para cada propuesta.

Cada propuesta puede decidir:

- Cuántas slides tiene.
- Qué tipos de slide utiliza.
- En qué orden aparecen.
- Cuántas imágenes tiene cada slide.
- Qué destinos merecen una slide propia.
- Qué contenido agrupar.

## Tecnología

- Astro.
- TypeScript.
- Tailwind CSS.
- React opcional, solo cuando la interacción con estado lo justifique.
- Vercel.
- Sin backend.
- Sin base de datos.
- Sin autenticación.

## Fuera de alcance

- Login.
- Usuarios.
- Comentarios.
- Chat.
- Reservas.
- Compra de vuelos.
- Panel administrativo.
- Conversión automática de moneda.
- APIs de terceros obligatorias.
