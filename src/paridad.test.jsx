import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { CLAVE_HORARIO, CLAVE_TAREAS } from "./lib/constantes.js";

// Datos con forma del legacy v1.6.6 tal como viven en localStorage.
const legadoHorario = [
  { id: "a1", dia: "Lunes", materia: "Matemáticas", inicio: "07:00", fin: "08:00" },
  { id: "a2", dia: "Viernes", materia: "Arte", inicio: "08:00", fin: "09:00" },
];
const legadoTareas = [
  { id: "t1", materia: "Ciencias", titulo: "Taller", descripcion: "", fechaEntrega: "2026-12-01", entregada: false },
];

// localStorage falso precargado con datos del legacy.
function sembrarLegado() {
  const datos = {
    [CLAVE_HORARIO]: JSON.stringify(legadoHorario),
    [CLAVE_TAREAS]: JSON.stringify(legadoTareas),
  };
  globalThis.localStorage = {
    getItem: (k) => datos[k] ?? null,
    setItem: (k, v) => { datos[k] = v; },
    removeItem: (k) => { delete datos[k]; },
  };
}

describe("paridad observable con el legacy (RF-1–RF-8)", () => {
  beforeEach(() => { delete globalThis.localStorage; });
  it("muestra las secciones y avisos del legacy", () => {
    sembrarLegado();
    const html = renderToString(<App />);
    expect(html).toContain("Resumen de hoy");
    expect(html).toContain("Horario semanal");
    expect(html).toContain("El estado se calcula solo con la fecha de entrega");
    expect(html).toContain("Tu copia, tus datos");
    expect(html).toContain("Exportar copia (JSON)");
    expect(html).toContain("Importar copia");
    expect(html).toContain("Descargar app offline");
    expect(html).toContain("Saltar al contenido");
  });
  it("migra sin pérdida: mismo número y contenido del legacy", () => {
    sembrarLegado();
    const html = renderToString(<App />);
    expect(html).toContain("Matemáticas");
    expect(html).toContain("Arte");
    expect(html).toContain("Ciencias");
    expect(html).toContain("Taller");
    expect(html).toContain("2 clases");
    expect(html).toContain("1 tarea");
  });
  it("muestra la versión en encabezado, legal y pie", () => {
    sembrarLegado();
    const html = renderToString(<App />);
    const veces = html.split("v2.0.0").length - 1;
    expect(veces).toBeGreaterThanOrEqual(3);
  });
  it("arranca vacía sin errores cuando no hay datos", () => {
    const html = renderToString(<App />);
    expect(html).toContain("Sin clases. Agrega tu primera materia.");
    expect(html).toContain("Sin tareas. Agrega la primera.");
  });
});
