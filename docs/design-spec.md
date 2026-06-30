# Design Specification — Viaje Tanto

## 1. Concepto visual

La web debe combinar:

- Revista digital.
- Presentación interactiva.
- Catálogo visual.
- Comparador.

## 2. Sensación

Debe sentirse:

- Cinematográfica.
- Editorial.
- Moderna.
- Inmersiva.
- Clara.
- Cercana.

## 3. Home

La home funciona como catálogo de portadas.

Cada propuesta debe verse como una tapa de revista.

Cada tarjeta incluye:

- Imagen fuerte.
- Nombre.
- Frase breve.
- Duración.
- Presupuesto.
- Ritmo.
- Etiquetas.

## 4. Presentación

Al abrir una propuesta:

- Debe ocupar toda la pantalla o una página inmersiva.
- Debe mostrar progreso.
- Debe permitir avanzar y retroceder.
- Debe funcionar con teclado.
- Debe funcionar con gestos o controles táctiles.
- Debe poder cerrarse o volver al catálogo.

## 5. Slides variables

El diseño no debe asumir una cantidad fija de slides.

Una propuesta puede tener 6 y otra 18.

No forzar:

- Una slide por ciudad.
- Una galería por propuesta.
- Un orden idéntico.
- Una única imagen por slide.

## 6. Slides con imágenes múltiples

Layouts permitidos:

- collage
- grid
- masonry
- hero-with-thumbs
- side-by-side
- full-bleed
- text-left
- text-right

En mobile:

- Evitar scroll horizontal accidental.
- Convertir collages complejos en grillas o secuencias verticales.
- Permitir carrusel táctil simple cuando sea apropiado.

## 7. Identidad por propuesta

Cada viaje puede definir:

- Color de acento.
- Color de texto.
- Estilo visual.
- Imagen de portada.
- Tono fotográfico.

La identidad cambia por viaje, pero la estructura visual sigue siendo consistente.

## 8. Presupuesto

La slide de presupuesto debe mostrar:

```text
Vuelos
Hospedaje
Transporte
Comida
Actividades
Extras
Total
```

Las categorías son variables.

No usar una tabla empresarial pesada.

Preferir:

- Barras.
- Bloques.
- Tarjetas grandes.
- Desglose editorial.

## 9. Comparación

La comparación rápida debe ser visual.

La comparación completa puede usar columnas y filas, pero debe conservar una estética editorial.

En mobile se comparan dos propuestas.

## 10. Tipografía

Usar:

- Títulos grandes.
- Tipografía editorial o display para encabezados.
- Sans serif legible para datos.

## 11. Animaciones

Permitidas:

- Aparición suave.
- Transición entre slides.
- Progreso.
- Cambio de color por propuesta.
- Movimiento sutil de imágenes.
- Expansión de detalles.

Evitar:

- Scroll hijacking.
- Parallax agresivo.
- Carruseles automáticos.
- Animaciones largas.
- Efectos que dificulten leer.

Respetar `prefers-reduced-motion`.

## 12. Responsive

Diseñar mobile first.

Mobile:

- Slides a pantalla completa.
- Controles táctiles.
- Textos breves.
- Recorrido vertical.
- Comparador de dos opciones.
- Galerías adaptadas.

## 13. Accesibilidad

- HTML semántico.
- Foco visible.
- Navegación por teclado.
- Escape para cerrar.
- Flechas para navegar.
- Alt en imágenes.
- Contraste suficiente.
- Botones reales.
- Enlaces reales.

## 14. Rendimiento

- Lazy loading.
- Imágenes responsivas.
- Formatos modernos.
- Precarga limitada.
- No cargar todas las galerías al inicio.
- JavaScript solo donde sea necesario.

## 15. Regla de diseño

No crear diseños exclusivos para una sola propuesta salvo que el patrón pueda reutilizarse en futuras propuestas.
