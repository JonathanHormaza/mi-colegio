import { describe, it, expect } from "vitest";
import {
  crearId, agregarClaseA, actualizarClaseEn, eliminarDe,
  agregarTareaA, actualizarTareaEn, marcarEntregadaEn, ordenarClases, ordenarTareas, materiasUnicas,
} from "./listas.js";

const clase = { id: "a1", dia: "Lunes", materia: "Mate", inicio: "07:00", fin: "08:00" };
const tarea = { id: "t1", materia: "Ciencias", titulo: "Taller", descripcion: "", fechaEntrega: "2026-12-01", entregada: false };

describe("operaciones puras de horario", () => {
  it("crearId genera identificadores únicos de texto", () => {
    const primero = crearId();
    expect(typeof primero).toBe("string");
    expect(crearId()).not.toBe(primero);
  });
  it("agrega clase válida y rechaza materia vacía o solape", () => {
    const r1 = agregarClaseA([], { dia: "Lunes", materia: "Mate", inicio: "07:00", fin: "08:00" });
    expect(r1.ok).toBe(true);
    expect(r1.lista).toHaveLength(1);
    expect(agregarClaseA([], { dia: "Lunes", materia: "  ", inicio: "07:00", fin: "08:00" }).error).toBe("Escribe la materia.");
    const r2 = agregarClaseA([clase], { dia: "Lunes", materia: "Arte", inicio: "07:30", fin: "08:30" });
    expect(r2.ok).toBe(false);
    expect(r2.lista).toEqual([clase]);
  });
  it("actualiza sin chocar consigo misma y elimina por id", () => {
    const r = actualizarClaseEn([clase], "a1", { dia: "Lunes", materia: "Física", inicio: "07:00", fin: "08:00" });
    expect(r.ok).toBe(true);
    expect(r.lista[0].materia).toBe("Física");
    expect(eliminarDe([clase], "a1")).toEqual([]);
    expect(eliminarDe([clase], "otro")).toEqual([clase]);
  });
  it("ordena clases por inicio", () => {
    const tarde = { ...clase, id: "a2", inicio: "09:00", fin: "10:00" };
    expect(ordenarClases([tarde, clase]).map((c) => c.id)).toEqual(["a1", "a2"]);
  });
});

describe("operaciones puras de tareas", () => {
  it("agrega tarea válida y exige materia, título y fecha", () => {
    const r = agregarTareaA([], { materia: "Ciencias", titulo: "Taller", descripcion: "x", fechaEntrega: "2026-12-01" });
    expect(r.ok).toBe(true);
    expect(r.lista[0]).toMatchObject({ materia: "Ciencias", entregada: false });
    expect(agregarTareaA([], { materia: "", titulo: "T", descripcion: "", fechaEntrega: "2026-12-01" }).error)
      .toBe("Materia, título y fecha son obligatorios.");
  });
  it("marca entregada y ordena por fecha", () => {
    const r = marcarEntregadaEn([tarea], "t1");
    expect(r[0].entregada).toBe(true);
    const vieja = { ...tarea, id: "t0", fechaEntrega: "2026-01-01" };
    expect(ordenarTareas([tarea, vieja]).map((t) => t.id)).toEqual(["t0", "t1"]);
  });
  it("edita título y fecha manteniendo la entrega", () => {
    const r = actualizarTareaEn([tarea], "t1", { materia: "Ciencias", titulo: "Nuevo", descripcion: "", fechaEntrega: "2026-12-02" });
    expect(r.ok).toBe(true);
    expect(r.lista[0]).toMatchObject({ titulo: "Nuevo", fechaEntrega: "2026-12-02", entregada: false });
    expect(actualizarTareaEn([tarea], "t1", { materia: "", titulo: "", descripcion: "", fechaEntrega: "" }).ok).toBe(false);
  });
  it("lista materias únicas ordenadas", () => {
    const tareas = [tarea, { ...tarea, id: "t2", materia: "Arte" }, { ...tarea, id: "t3", materia: "Arte" }];
    expect(materiasUnicas(tareas)).toEqual(["Arte", "Ciencias"]);
  });
});
