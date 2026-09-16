# Sitio web Proyectel — guía rápida

## Archivos

```
proyectel/
├── index.html          Inicio: portada, diagrama de red, resumen de los 4 servicios, cifras
├── productos.html      Productos y soluciones (cada uno con su botón de cotización)
├── nosotros.html       Quiénes somos, misión, visión, valores, compromiso, certificaciones
├── contacto.html       Formulario de cotización + datos corporativos
└── assets/
    ├── css/estilos.css  Todo el diseño (una sola hoja para las 4 páginas)
    ├── js/main.js       Menú móvil, preselección de producto, validación del formulario
    └── img/             Acá va el logo oficial
```

Para verlo: abrí `index.html` con doble clic. No necesita servidor.

---

## Lo que tenés que reemplazar antes de presentarlo

Está todo marcado con comentarios en el código (`<!-- REEMPLAZÁ ... -->`).

1. **El logo.** Ahora hay un logotipo provisional hecho en SVG. Cuando tengas el oficial,
   guardalo en `assets/img/` y cambiá el bloque `<a class="logo">` de las 4 páginas por:
   ```html
   <a class="logo" href="index.html"><img src="assets/img/logo-proyectel.svg" alt="Proyectel" height="34"></a>
   ```

2. **Las cifras del inicio** (`+15 años`, `99,9 %`, `24/7`, `N+1`) y los valores del diagrama
   (`1 Gbps`, `1:1`, `< 10 ms`, `Tier III`). Son de ejemplo. Poné los reales.

3. **Las fichas técnicas** de `productos.html`: cada servicio tiene seis filas de
   especificaciones que hay que ajustar a lo que Proyectel realmente ofrece.

4. **Los datos corporativos** de `contacto.html` y del pie: dirección, correos y teléfonos.

5. **Las certificaciones** de `nosotros.html`. Importante: dejá solo las que la empresa
   tiene vigentes. Publicar una certificación que no se posee puede traer problemas legales.

6. **El texto de "Quiénes somos"**: escribilo con la historia real de la empresa.

---

## Cómo funciona el botón "Cotizar" de cada producto

Los botones de `productos.html` enlazan así:

```
contacto.html?producto=enlace-de-datos#cotizacion
```

`main.js` lee el parámetro `producto` de la URL y deja ese servicio ya elegido en el
`<select>` del formulario, con un destello del borde para que el usuario lo note.
Los valores válidos son: `vpn-corporativa`, `data-center`, `enlace-de-datos`,
`housing-colocation`, `varios`, `asesoria`.

---

## Hacer que el formulario envíe de verdad

Hoy valida los campos y muestra la confirmación, pero no envía nada (es solo navegador).
Dos formas de conectarlo, explicadas también en los comentarios de `main.js`:

**Opción A — Formspree** (sin backend, la más rápida):
creá un formulario en formspree.io y reemplazá la llamada `exito()` del `submit` por:

```js
fetch("https://formspree.io/f/TU_ID", {
  method: "POST",
  headers: { "Accept": "application/json" },
  body: new FormData(form)
}).then(function (r) { if (r.ok) exito(); });
```

**Opción B — PHP propio** (si el hosting lo permite):
poné `action="enviar.php" method="post"` en el `<form>`, sacá el atributo `novalidate`
y borrá el `evento.preventDefault()` de `main.js`.

---

## Decisiones de diseño (por si te las preguntan en la defensa)

- **Paleta.** Azul profundo `#10263A` como base corporativa, papel `#F4F5F3` para el
  contenido, latón `#C08A2E` como acento y verde señal `#2BB3A3` reservado únicamente para
  los valores de red en el diagrama. El verde no se usa en ningún otro lado: así comunica
  "dato técnico medido" y no decora.
- **Tipografía.** Archivo en títulos, IBM Plex Sans en textos, IBM Plex Mono solo para
  valores técnicos (ms, Gbps, %, U). La monoespaciada es el lenguaje visual del rubro.
- **Portada.** En vez del típico número grande con degradado, el diagrama de topología
  muestra el recorrido real del servicio y las cifras son las etiquetas del propio diagrama.
- **Servicios como hoja de especificaciones.** Filas separadas por líneas finas en lugar de
  tarjetas con sombra: más sobrio y más fácil de comparar.
- **Movimiento.** Un solo efecto en todo el sitio (el pulso que recorre los enlaces del
  diagrama), y se desactiva solo si el sistema del usuario pide reducir animaciones.

## Accesibilidad y responsive

- Un solo punto de quiebre principal en 860 px (menú hamburguesa, diagrama que pasa de
  horizontal a vertical) y ajustes en 1000 px y 560 px.
- Enlace "Saltar al contenido", foco visible en color latón, `aria-current` en la página
  activa, `aria-expanded` en el menú, errores del formulario anunciados con `aria-invalid`.
- Probado sin desborde horizontal en 390 px, 768 px y 1440 px.
