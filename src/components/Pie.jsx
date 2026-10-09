import React from "react";
import { VERSION } from "../lib/constantes.js";

// Pie con mapa del sitio y versión legal.
export function Pie() {
  const anio = new Date().getFullYear();
  return (
    <footer>
      <div className="foot-inner">
        <div className="foot-col">
          <h3>Agenda Escolar</h3>
          <p>Horario y tareas · 100% local, sin cuentas. Tus datos quedan en tu navegador.</p>
        </div>
        <div className="foot-col">
          <h3>App</h3>
          <ul>
            <li><a href="#resumen">Resumen</a></li>
            <li><a href="#horario">Horario</a></li>
            <li><a href="#tareas">Tareas</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h3>Legal</h3>
          <ul>
            <li><a href="#legal">Privacidad</a></li>
            <li><a href="#legal">Términos</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h3>Contacto</h3>
          <ul>
            <li><a href="mailto:jhormaza.dev@gmail.com">jhormaza.dev@gmail.com</a></li>
            <li><a href="#contenido">Volver arriba</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-base">
        <span>© {anio} Agenda Escolar · {VERSION} · Uso educativo</span>
        <span><a href="#legal">Privacidad</a> · <a href="#legal">Términos</a></span>
      </div>
    </footer>
  );
}
