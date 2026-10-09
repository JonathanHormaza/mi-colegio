import React from "react";
import { textoCantidad, obtenerDiaHoy, contarClasesHoy, contarPendientes } from "../lib/validacion.js";

// Tarjeta del resumen con número y detalle.
function TarjetaResumen({ etiqueta, valor, detalle }) {
  return (
    <div className="tarjeta">
      <div className="meta">
        <span>{etiqueta}</span>
        <div className="linea-valor"><h2>{valor}</h2><span className="punto punto-vivo" aria-hidden="true"></span></div>
        <span>{detalle}</span>
      </div>
    </div>
  );
}

// Muestra las clases de hoy y las tareas pendientes.
export function PanelHoy({ clases, tareas }) {
  const diaHoy = obtenerDiaHoy();
  const clasesHoy = contarClasesHoy(clases, diaHoy);
  const pendientes = contarPendientes(tareas);
  const fecha = new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });
  return (
    <section id="resumen" aria-labelledby="tituloResumen">
      <p className="eyebrow">Panel · hoy</p>
      <div className="sec-head">
        <h2 id="tituloResumen">Resumen de hoy</h2>
        <p className="muted">{fecha}</p>
      </div>
      <div className="panel-resumen" aria-live="polite">
        <TarjetaResumen etiqueta="Clases hoy" valor={clasesHoy} detalle={`Hoy (${diaHoy}) tienes ${textoCantidad(clasesHoy, "clase", "clases")}`} />
        <TarjetaResumen etiqueta="Tareas pendientes" valor={pendientes} detalle={`Tienes ${textoCantidad(pendientes, "tarea pendiente", "tareas pendientes")}`} />
      </div>
    </section>
  );
}
