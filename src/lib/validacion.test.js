import { describe, it, expect } from "vitest";
import {
  normalizarClase, normalizarTarea, calcularEstado, textoCantidad,
  validarClase, construirRespaldo, hayDatos, analizarRespaldo,
  excedeTamano, obtenerDiaHoy, contarClasesHoy, contarPendientes, elegirVia,
} from "./validacion.js";

const claseBase = { id: "a1", dia: "Lunes", materia: "Mate", inicio: "07:00", fin: "08:00" };
const tareaBase = { id: "t1", materia: "Ciencias", titulo: "Taller", descripcion: "Pág 5", fechaEntrega: "2026-12-01", entregada: false };
// Mediodía fijo para comparar solo fechas, sin horas.
const hoy = new Date(2026, 9, 9, 12, 0, 0);

describe("normalizarClase (RF-6)", () => {
  it("acepta una clase válida y recorta textos largos", () => {
    const larga = { ...claseBase, id: "x".repeat(99), materia: "m".repeat(99) };
    expect(normalizarClase(larga)).toEqual({ id: "x".repeat(40), dia: "Lunes", materia: "m".repeat(60), inicio: "07:00", fin: "08:00" });
  });
  it("rechaza día inválido, hora malformada y fin anterior al inicio", () => {
    expect(normalizarClase({ ...claseBase, dia: "Sábado" })).toBeNull();
    expect(normalizarClase({ ...claseBase, inicio: "7:00" })).toBeNull();
    expect(normalizarClase({ ...claseBase, inicio: "08:00", fin: "08:00" })).toBeNull();
    expect(normalizarClase({ ...claseBase, inicio: "09:00", fin: "08:00" })).toBeNull();
    expect(normalizarClase(null)).toBeNull();
    expect(normalizarClase({ ...claseBase, id: 5 })).toBeNull();
  });
});

describe("normalizarTarea (RF-6)", () => {
  it("acepta tarea válida y recorta textos largos", () => {
    expect(normalizarTarea(tareaBase)).toEqual(tareaBase);
  });
  it("rechaza fecha malformada y solo acepta entregada === true", () => {
    expect(normalizarTarea({ ...tareaBase, fechaEntrega: "01-12-2026" })).toBeNull();
    expect(normalizarTarea({ ...tareaBase, fechaEntrega: "" })).toBeNull();
    expect(normalizarTarea({ ...tareaBase, entregada: 1 }).entregada).toBe(false);
    expect(normalizarTarea({ ...tareaBase, entregada: true }).entregada).toBe(true);
    expect(normalizarTarea({ ...tareaBase, id: 7 })).toBeNull();
    expect(normalizarTarea(undefined)).toBeNull();
  });
});

describe("calcularEstado (RF-3)", () => {
  it("entregada gana aunque la fecha ya pasó", () => {
    expect(calcularEstado({ ...tareaBase, fechaEntrega: "2020-01-01", entregada: true }, hoy)).toBe("Entregada");
  });
  it("fecha anterior a hoy es vencida", () => {
    expect(calcularEstado({ ...tareaBase, fechaEntrega: "2026-10-08" }, hoy)).toBe("Vencida");
  });
  it("fecha igual a hoy sigue pendiente", () => {
    expect(calcularEstado({ ...tareaBase, fechaEntrega: "2026-10-09" }, hoy)).toBe("Pendiente");
  });
  it("fecha futura es pendiente", () => {
    expect(calcularEstado(tareaBase, hoy)).toBe("Pendiente");
  });
});

describe("plural correcto (RF-4, hereda spec 001)", () => {
  it("usa singular con 1 y plural con 0 o 2+", () => {
    expect(textoCantidad(1, "clase", "clases")).toBe("1 clase");
    expect(textoCantidad(0, "clase", "clases")).toBe("0 clases");
    expect(textoCantidad(2, "tarea pendiente", "tareas pendientes")).toBe("2 tareas pendientes");
  });
});

describe("anti-solapes (RF-4, hereda spec 001)", () => {
  const existentes = [claseBase];
  it("bloquea cruce parcial y cruce total", () => {
    expect(validarClase(existentes, "Lunes", "07:30", "08:30", null)).toBe("Ese horario se cruza con otra clase del mismo día.");
    expect(validarClase(existentes, "Lunes", "07:10", "07:50", null)).toBe("Ese horario se cruza con otra clase del mismo día.");
  });
  it("permite bordes exactos y otros días", () => {
    expect(validarClase(existentes, "Lunes", "08:00", "09:00", null)).toBe("");
    expect(validarClase(existentes, "Lunes", "06:00", "07:00", null)).toBe("");
    expect(validarClase(existentes, "Martes", "07:30", "08:30", null)).toBe("");
  });
  it("detecta duplicado exacto con su aviso propio", () => {
    expect(validarClase(existentes, "Lunes", "07:00", "08:00", null)).toBe("Ya existe una clase en ese día y horario.");
  });
  it("al editar no choca consigo misma", () => {
    expect(validarClase(existentes, "Lunes", "07:00", "08:00", "a1")).toBe("");
    expect(validarClase([...existentes, { ...claseBase, id: "a2", inicio: "08:00", fin: "09:00" }], "Lunes", "07:30", "08:30", "a1"))
      .toBe("Ese horario se cruza con otra clase del mismo día.");
  });
  it("exige campos y fin mayor que inicio antes que solapes", () => {
    expect(validarClase(existentes, "", "07:00", "08:00", null)).toBe("Completa día, inicio y fin.");
    expect(validarClase(existentes, "Lunes", "08:00", "07:00", null)).toBe("La hora de fin debe ser mayor que la de inicio.");
  });
});

describe("respaldo exportar/importar (RF-6)", () => {
  it("construye el formato {app, version, horario, tareas}", () => {
    const respaldo = construirRespaldo([claseBase], [tareaBase], "2026-10-09T00:00:00.000Z");
    expect(respaldo.app).toBe("agenda-escolar");
    expect(respaldo.horario).toEqual([claseBase]);
    expect(respaldo.tareas).toEqual([tareaBase]);
    expect(typeof respaldo.version).toBe("string");
  });
  it("analiza un respaldo válido y lo normaliza", () => {
    const datos = { app: "agenda-escolar", version: "v1.6.6", horario: [claseBase, { id: "mala" }], tareas: [tareaBase] };
    const r = analizarRespaldo(datos);
    expect(r.ok).toBe(true);
    expect(r.horario).toEqual([claseBase]);
    expect(r.tareas).toEqual([tareaBase]);
  });
  it("rechaza respaldo vacío, sin arreglos o malformado", () => {
    expect(analizarRespaldo(null).ok).toBe(false);
    expect(analizarRespaldo({}).ok).toBe(false);
    expect(analizarRespaldo({ horario: [], tareas: {} }).ok).toBe(false);
    expect(analizarRespaldo({ horario: "x", tareas: [] }).ok).toBe(false);
  });
  it("detecta el tope de 1 MB", () => {
    expect(excedeTamano("hola")).toBe(false);
    expect(excedeTamano("x".repeat(1024 * 1024 + 1))).toBe(true);
  });
  it("hayDatos exige al menos una clase o tarea", () => {
    expect(hayDatos([], [])).toBe(false);
    expect(hayDatos([claseBase], [])).toBe(true);
    expect(hayDatos([], [tareaBase])).toBe(true);
  });
});

describe("panel de hoy (RF-1)", () => {
  it("mapea getDay a español Lun–Vie y fin de semana", () => {
    expect(obtenerDiaHoy(new Date(2026, 9, 9))).toBe("Viernes");
    expect(obtenerDiaHoy(new Date(2026, 9, 10))).toBe("Sábado");
    expect(obtenerDiaHoy(new Date(2026, 9, 11))).toBe("Domingo");
    expect(obtenerDiaHoy(new Date(2026, 9, 12))).toBe("Lunes");
  });
  it("cuenta solo las clases del día e ignora días inválidos", () => {
    const clases = [claseBase, { ...claseBase, id: "a2", dia: "Lunes" }, { ...claseBase, id: "a3", dia: "Martes" }, { id: "a4", dia: "Sábado" }];
    expect(contarClasesHoy(clases, "Lunes")).toBe(2);
    expect(contarClasesHoy(clases, "Sábado")).toBe(0);
  });
  it("cuenta pendientes sin importar vencidas", () => {
    const tareas = [tareaBase, { ...tareaBase, id: "t2", entregada: true }];
    expect(contarPendientes(tareas)).toBe(1);
  });
});

describe("vía de compartir (paridad legacy)", () => {
  it("elige archivos, portapapeles, clásico o nada en orden", () => {
    expect(elegirVia(true, true, true)).toBe("archivos");
    expect(elegirVia(false, true, true)).toBe("portapapeles");
    expect(elegirVia(false, false, true)).toBe("clasico");
    expect(elegirVia(false, false, false)).toBe("nada");
  });
});
