/* =========================================================
   PROYECTEL — Comportamiento del sitio
   1. Menú móvil
   2. Año del pie de página
   3. Preselección del producto desde la URL (?producto=...)
   4. Validación y envío del formulario de cotización
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Menú móvil ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("navPrincipal");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var abierto = nav.classList.toggle("abierto");
      menuBtn.setAttribute("aria-expanded", String(abierto));
      menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    // Cerrar el menú al pasar a escritorio
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && nav.classList.contains("abierto")) {
        nav.classList.remove("abierto");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 2. Año actual en el pie ---------- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- 3. Producto preseleccionado ----------
     Los botones de productos.html enlazan así:
     contacto.html?producto=vpn-corporativa#cotizacion
     Acá leemos ese valor y lo dejamos elegido en el <select>. */
  var selectProducto = document.getElementById("producto");

  if (selectProducto) {
    var pedido = new URLSearchParams(window.location.search).get("producto");
    var valores = Array.prototype.map.call(selectProducto.options, function (o) { return o.value; });

    if (pedido && valores.indexOf(pedido) !== -1) {
      selectProducto.value = pedido;
      // Señal visual breve para que se note qué quedó seleccionado
      selectProducto.style.borderColor = "#C08A2E";
      window.setTimeout(function () { selectProducto.style.borderColor = ""; }, 2500);
    }
  }

  /* ---------- 4. Formulario de cotización ---------- */
  var form = document.getElementById("formCotizacion");
  if (!form) return;

  var confirmacion = document.getElementById("confirmacion");

  var mensajes = {
    nombre:   "Escriba su nombre y apellido.",
    empresa:  "Indique el nombre de su empresa o institución.",
    email:    "Escriba un correo válido, por ejemplo nombre@empresa.com.",
    producto: "Elija el servicio que necesita cotizar.",
    detalle:  "Cuéntenos brevemente qué necesita para poder cotizarlo.",
    acuerdo:  "Marque la autorización para poder responderle."
  };

  function esCorreoValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
  }

  function mostrarError(campo, texto) {
    var salida = form.querySelector('[data-error-de="' + campo.name + '"]');
    if (salida) salida.textContent = texto || "";
    if (texto) {
      campo.setAttribute("aria-invalid", "true");
    } else {
      campo.removeAttribute("aria-invalid");
    }
  }

  function validarCampo(campo) {
    var valor = campo.type === "checkbox" ? campo.checked : campo.value.trim();

    if (!valor) {
      mostrarError(campo, mensajes[campo.name] || "Este dato es obligatorio.");
      return false;
    }
    if (campo.type === "email" && !esCorreoValido(campo.value)) {
      mostrarError(campo, mensajes.email);
      return false;
    }
    if (campo.name === "detalle" && campo.value.trim().length < 15) {
      mostrarError(campo, "Agregue un poco más de detalle (mínimo 15 caracteres).");
      return false;
    }

    mostrarError(campo, "");
    return true;
  }

  var obligatorios = form.querySelectorAll("[required]");

  Array.prototype.forEach.call(obligatorios, function (campo) {
    campo.addEventListener("blur", function () { validarCampo(campo); });
    campo.addEventListener("input", function () {
      if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var valido = true;
    var primerError = null;

    Array.prototype.forEach.call(obligatorios, function (campo) {
      if (!validarCampo(campo)) {
        valido = false;
        if (!primerError) primerError = campo;
      }
    });

    if (!valido) {
      primerError.focus();
      return;
    }

    /* ---- Envío ----
       Sin servidor, acá solo mostramos la confirmación.

       OPCIÓN A — servicio externo (lo más rápido para la pasantía):
         creá un formulario en formspree.io y reemplazá este bloque por:

           fetch("https://formspree.io/f/TU_ID", {
             method: "POST",
             headers: { "Accept": "application/json" },
             body: new FormData(form)
           }).then(function (r) { if (r.ok) exito(); });

       OPCIÓN B — PHP propio: poné action="enviar.php" method="post"
         en el <form>, sacá el novalidate y borrá este preventDefault. */

    exito();
  });

  function exito() {
    form.hidden = true;
    if (confirmacion) {
      confirmacion.hidden = false;
      confirmacion.scrollIntoView({ behavior: "smooth", block: "center" });
      confirmacion.setAttribute("tabindex", "-1");
      confirmacion.focus();
    }
  }
})();
