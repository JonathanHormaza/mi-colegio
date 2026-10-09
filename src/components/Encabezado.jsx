import React from "react";
import { VERSION } from "../lib/constantes.js";

// Encabezado fijo con marca, versión y navegación.
export function Encabezado() {
  return (
    <header className="top">
      <div className="top-inner">
        <div className="marca">
          <a className="wordmark" href="#contenido"><span className="punto punto-vivo" aria-hidden="true"></span>Agenda·Escolar</a>
          <div>
            <h1>Agenda Escolar <span className="version">{VERSION}</span></h1>
            <small>Horario y tareas · 100% local, sin cuentas</small>
          </div>
        </div>
        <nav aria-label="Navegación principal">
          <a href="#resumen">Resumen</a>
          <a href="#horario">Horario</a>
          <a href="#tareas">Tareas</a>
          <a href="#legal">Legal</a>
        </nav>
      </div>
    </header>
  );
}
