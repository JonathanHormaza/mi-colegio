import React from "react";
import { VERSION } from "../lib/constantes.js";

// Artículos de privacidad, términos y datos locales.
export function Legal() {
  return (
    <section id="legal" aria-labelledby="tituloLegal">
      <p className="eyebrow">03 — Privacidad y datos</p>
      <div className="sec-head"><div><h2 id="tituloLegal">Privacidad, términos y datos</h2><p>Vigencia: 2026-10-06 · Versión {VERSION} · Uso educativo.</p></div></div>
      <div className="legal-grid">
        <article><h3>1. Responsable y contacto</h3><p>Responsable: el autor del proyecto. Contacto: jhormaza.dev@gmail.com. Jurisdicción: Colombia (Ley 1581 de 2012). Esta app es una página estática publicada en GitHub Pages: no opera cuentas ni servidores propios.</p></article>
        <article><h3>2. Menores de edad</h3><p>Uso con acompañamiento de acudiente o docente. No hay registro, login ni recolección en servidor. No se pide nombre, documento ni ubicación. Si eres acudiente y tienes dudas, escribe a jhormaza.dev@gmail.com.</p></article>
        <article><h3>3. Privacidad y datos locales</h3><ul><li>Todo queda en <code>localStorage</code> de tu navegador (<code>colegio_horario</code>, <code>colegio_tareas</code>).</li><li>Sin cookies de rastreo, sin analítica, sin envíos a internet.</li><li>Datos por dispositivo y navegador: no se sincronizan solos; usa Exportar/Importar.</li><li>Modo privado o “borrar datos” del navegador elimina la app. GitHub aloja la página por HTTPS pero no recibe tus tareas.</li></ul></article>
        <article><h3>4. Términos de uso</h3><ul><li>Uso personal y educativo; verifica tus entregas por otros medios.</li><li>Eres responsable de tu respaldo (Exportar JSON) y de tu dispositivo.</li><li>Sin garantías de disponibilidad; el servicio puede cambiar sin aviso.</li><li>Uso aceptable: no intentes romper la página ni subir contenido ilícito vía Importar.</li></ul></article>
        <article><h3>5. Seguridad</h3><ul><li>React + Vite por archivos, sin CDNs; sin conexiones externas (<code>connect-src &apos;none&apos;</code>).</li><li>Escape automático de React (anti-XSS) y sin <code>onclick</code> inline.</li><li>Si encuentras un fallo, repórtalo a jhormaza.dev@gmail.com antes de difundirlo.</li></ul></article>
        <article><h3>6. Tus derechos</h3><p>Como nada viaja a un servidor, ejerces tus derechos localmente: consulta con Exportar, rectifica editando, suprime con “Borrar todos mis datos” o limpiando el navegador. Reclamos Ley 1581: jhormaza.dev@gmail.com. Cambios de esta política se publican aquí con nueva fecha y versión.</p></article>
      </div>
      <div className="legal-grid legal-doble">
        <article><h3>Acceso directo sin internet</h3>
          <details><summary>Android (Chrome)</summary><p className="muted">Abre la página, toca ⋮ &gt; Añadir a pantalla de inicio &gt; Añadir. Se abre a pantalla completa.</p></details>
          <details><summary>iPhone (Safari)</summary><p className="muted">Abre la página, toca Compartir &gt; Añadir a inicio &gt; Añadir.</p></details>
        </article>
        <article><h3>En computador</h3>
          <details><summary>Windows (Chrome/Edge)</summary><p className="muted">Abre el .html descargado, ⋮ &gt; Guardar y compartir &gt; Crear acceso directo &gt; marca “Abrir como ventana”.</p></details>
          <details><summary>Linux</summary><p className="muted">Guarda el .html en Descargas y crea <code>~/.local/share/applications/agenda.desktop</code> con: <code>Exec=xdg-open ~/Descargas/agenda-escolar.html</code>.</p></details>
        </article>
      </div>
      <p className="muted">La copia .html no incluye tus tareas: muévelas con Exportar/Importar JSON.</p>
    </section>
  );
}
