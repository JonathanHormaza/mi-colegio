import { describe, it, expect } from "vitest";
import { guardarDatos, cargarDatos } from "./storage.js";
import { CLAVE_HORARIO, CLAVE_TAREAS } from "./constantes.js";

// Almacén falso en memoria (sin DOM).
function crearAlmacen(datos = {}) {
  return {
    leer(clave) { return datos[clave] ?? null; },
    escribir(clave, valor) { datos[clave] = valor; },
    borrar(clave) { delete datos[clave]; },
  };
}

const claseValida = { id: "a1", dia: "Lunes", materia: "Mate", inicio: "07:00", fin: "08:00" };
const tareaValida = { id: "t1", materia: "Ciencias", titulo: "Taller", descripcion: "", fechaEntrega: "2026-12-01", entregada: false };

describe("storage con las claves del legacy", () => {
  it("guarda y lee con las mismas claves y formato", () => {
    const almacen = crearAlmacen();
    guardarDatos([claseValida], [tareaValida], almacen);
    expect(JSON.parse(almacen.leer(CLAVE_HORARIO))).toEqual([claseValida]);
    expect(JSON.parse(almacen.leer(CLAVE_TAREAS))).toEqual([tareaValida]);
    expect(CLAVE_HORARIO).toBe("colegio_horario");
    expect(CLAVE_TAREAS).toBe("colegio_tareas");
  });

  it("lee intactos los datos guardados por el legacy", () => {
    const almacen = crearAlmacen({
      [CLAVE_HORARIO]: JSON.stringify([claseValida]),
      [CLAVE_TAREAS]: JSON.stringify([tareaValida]),
    });
    expect(cargarDatos(almacen)).toEqual({ horario: [claseValida], tareas: [tareaValida] });
  });

  it("arranca vacío sin errores cuando no hay nada guardado", () => {
    expect(cargarDatos(crearAlmacen())).toEqual({ horario: [], tareas: [] });
  });

  it("ignora JSON corrupto y devuelve vacío", () => {
    const almacen = crearAlmacen({ [CLAVE_HORARIO]: "{roto", [CLAVE_TAREAS]: "[mal" });
    expect(cargarDatos(almacen)).toEqual({ horario: [], tareas: [] });
  });

  it("ignora entradas inválidas y conserva las válidas", () => {
    const almacen = crearAlmacen({
      [CLAVE_HORARIO]: JSON.stringify([claseValida, { id: "x", dia: "Sábado" }, null, "hola"]),
      [CLAVE_TAREAS]: JSON.stringify([tareaValida, { id: "y" }, 42]),
    });
    const { horario, tareas } = cargarDatos(almacen);
    expect(horario).toEqual([claseValida]);
    expect(tareas).toEqual([tareaValida]);
  });

  it("convierte no-arreglos en vacío", () => {
    const almacen = crearAlmacen({ [CLAVE_HORARIO]: "5", [CLAVE_TAREAS]: "{}" });
    expect(cargarDatos(almacen)).toEqual({ horario: [], tareas: [] });
  });
});
