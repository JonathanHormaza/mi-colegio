import React, { useState } from "react";
import { construirRespaldo, hayDatos, analizarRespaldo, excedeTamano, elegirVia } from "../lib/validacion.js";
import { borrarDatos } from "../lib/storage.js";

// Descarga un texto como archivo en el navegador.
function descargarArchivo(texto, nombre, tipo) {
  const url = URL.createObjectURL(new Blob([texto], { type: tipo }));
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

// Exporta el respaldo como JSON descargable.
function exportarRespaldo(clases, tareas, avisar) {
  const texto = JSON.stringify(construirRespaldo(clases, tareas, new Date().toISOString()), null, 2);
  descargarArchivo(texto, "agenda-escolar-respaldo.json", "application/json");
  avisar("Copia exportada. Guárdala en un lugar seguro.");
}

// Comparte el respaldo por la mejor vía disponible.
async function compartirRespaldo(clases, tareas, avisar) {
  if (!hayDatos(clases, tareas)) { avisar("Nada que enviar: agrega clases o tareas."); return; }
  const texto = JSON.stringify(construirRespaldo(clases, tareas, new Date().toISOString()), null, 2);
  if (excedeTamano(texto)) { avisar("Respaldo muy grande (máx 1 MB)."); return; }
  if (!confirm("Tus datos saldrán de este dispositivo. ¿Enviar respaldo?")) return;
  const via = elegirVia(puedeCompartir(), hayPortapapeles(), hayClasico());
  if (via === "archivos") return compartirArchivo(texto, avisar);
  if (via === "portapapeles") return copiarModerno(texto, avisar);
  if (via === "clasico") return copiarClasico(texto, avisar);
  avisar("Abre la versión en línea para compartir.");
}

// Detecta si el navegador comparte archivos.
function puedeCompartir() {
  try {
    const prueba = new File(["x"], "x.json", { type: "application/json" });
    return Boolean(navigator.share && navigator.canShare && navigator.canShare({ files: [prueba] }));
  } catch { return false; }
}

// Detecta el portapapeles moderno.
function hayPortapapeles() {
  return Boolean(navigator.clipboard && navigator.clipboard.writeText);
}

// Detecta el copiado clásico (último recurso).
function hayClasico() {
  return typeof document.execCommand === "function";
}

// Envía el respaldo con el diálogo nativo.
async function compartirArchivo(texto, avisar) {
  const archivo = new File([texto], "agenda-escolar-respaldo.json", { type: "application/json" });
  try {
    await navigator.share({ files: [archivo] });
  } catch (error) {
    if (error && error.name !== "AbortError") avisar("No se pudo compartir.");
  }
}

// Copia con el portapapeles moderno.
async function copiarModerno(texto, avisar) {
  try {
    await navigator.clipboard.writeText(texto);
    avisar("Respaldo copiado. Pégalo donde quieras.");
  } catch {
    avisar("Portapapeles bloqueado por el navegador.");
  }
}

// Copia con técnica clásica para contextos sin portapapeles.
function copiarClasico(texto, avisar) {
  try {
    const caja = document.createElement("textarea");
    caja.value = texto;
    document.body.appendChild(caja);
    caja.select();
    const copiado = document.execCommand("copy");
    caja.remove();
    avisar(copiado ? "Respaldo copiado. Pégalo donde quieras." : "Abre la versión en línea para compartir.");
  } catch {
    avisar("Abre la versión en línea para compartir.");
  }
}

// Importa un respaldo validando tamaño y formato.
function importarRespaldo(archivo, alImportar, avisar) {
  if (!archivo) return;
  if (archivo.size > 1024 * 1024) { avisar("Archivo muy grande (máx 1 MB)."); return; }
  const lector = new FileReader();
  lector.onload = () => {
    try {
      const analizado = analizarRespaldo(JSON.parse(lector.result));
      if (!analizado.ok) throw new Error("formato");
      alImportar(analizado.horario, analizado.tareas);
      avisar("Copia importada correctamente.");
    } catch { avisar("Archivo inválido. No se importó nada."); }
  };
  lector.readAsText(archivo);
}

// Descarga el documento construido para consulta offline.
async function descargarApp(avisar) {
  try {
    const respuesta = await fetch(`${import.meta.env.BASE_URL}index.html`);
    const texto = await respuesta.text();
    descargarArchivo(texto, "agenda-escolar.html", "text/html");
    avisar("App descargada. Ábrela con doble clic, sin internet.");
  } catch {
    avisar("No se pudo descargar. Revisa tu conexión.");
  }
}

// Borra horario y tareas con confirmación.
function borrarTodo(alVaciar, avisar) {
  if (!confirm("¿Borrar horario y tareas de este navegador?")) return;
  borrarDatos();
  alVaciar();
  avisar("Datos locales eliminados.");
}

// Tarjeta de respaldo local: exportar, compartir, importar y descarga.
export function Respaldo({ clases, tareas, alImportar, alVaciar }) {
  const [info, setInfo] = useState("");
  return (
    <section id="respaldo" className="cta-card" aria-labelledby="tituloRespaldo">
      <p className="eyebrow">Respaldo local</p>
      <h2 id="tituloRespaldo">Tu copia, tus datos</h2>
      <p className="muted">Todo queda en este navegador. Exporta tu JSON antes de borrar o cambiar de dispositivo.</p>
      <div className="datos-acciones">
        <button className="btn-secundario" type="button" onClick={() => exportarRespaldo(clases, tareas, setInfo)}>Exportar copia (JSON)</button>
        <button className="btn-secundario" type="button" onClick={() => compartirRespaldo(clases, tareas, setInfo)}>Compartir</button>
        <label className="btn-secundario" htmlFor="inputImportar">Importar copia</label>
        <input type="file" id="inputImportar" accept="application/json" hidden onChange={(e) => { importarRespaldo(e.target.files[0], alImportar, setInfo); e.target.value = ""; }} />
        <button className="btn-secundario" type="button" onClick={() => descargarApp(setInfo)}>Descargar app offline (.html)</button>
        <button className="btn-borrar" type="button" onClick={() => borrarTodo(alVaciar, setInfo)}>Borrar todos mis datos</button>
      </div>
      <p className="muted" aria-live="polite">{info}</p>
      <p className="muted">La copia .html muestra el documento construido; sin sus archivos puede verse simple sin conexión.</p>
    </section>
  );
}
