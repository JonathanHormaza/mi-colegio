import { CLAVE_HORARIO, CLAVE_TAREAS } from "./constantes.js";
import { normalizarClase, normalizarTarea } from "./validacion.js";

// Memoria de respaldo cuando no hay almacenamiento disponible.
let memoriaInterna = {};

// Resuelve el almacén a usar (inyectable para probar sin DOM).
function resolverAlmacen(externo) {
  if (externo) return externo;
  if (typeof localStorage !== "undefined") return envolturaLocal();
  return envolturaMemoria();
}

// Adapta localStorage a la interfaz leer/escribir/borrar.
function envolturaLocal() {
  return {
    leer: (clave) => localStorage.getItem(clave),
    escribir: (clave, valor) => localStorage.setItem(clave, valor),
    borrar: (clave) => localStorage.removeItem(clave),
  };
}

// Almacén en memoria para entornos sin localStorage.
function envolturaMemoria() {
  return {
    leer: (clave) => memoriaInterna[clave] ?? null,
    escribir: (clave, valor) => { memoriaInterna[clave] = valor; },
    borrar: (clave) => { delete memoriaInterna[clave]; },
  };
}

// Persiste horario y tareas en el almacén.
export function guardarDatos(horario, tareas, almacen) {
  const destino = resolverAlmacen(almacen);
  destino.escribir(CLAVE_HORARIO, JSON.stringify(horario));
  destino.escribir(CLAVE_TAREAS, JSON.stringify(tareas));
}

// Carga datos con tolerancia: lo inválido se ignora, lo válido se conserva.
export function cargarDatos(almacen) {
  const origen = resolverAlmacen(almacen);
  return { horario: leerClases(origen), tareas: leerTareas(origen) };
}

// Lee clases tolerando JSON corrupto y entradas inválidas.
function leerClases(origen) {
  const crudo = leerArreglo(origen, CLAVE_HORARIO);
  return crudo.map(normalizarClase).filter(Boolean);
}

// Lee tareas tolerando JSON corrupto y entradas inválidas.
function leerTareas(origen) {
  const crudo = leerArreglo(origen, CLAVE_TAREAS);
  return crudo.map(normalizarTarea).filter(Boolean);
}

// Parsea un arreglo del almacén o devuelve vacío si falla.
function leerArreglo(origen, clave) {
  try {
    const valor = JSON.parse(origen.leer(clave));
    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
}

// Borra horario y tareas del almacén.
export function borrarDatos(almacen) {
  const destino = resolverAlmacen(almacen);
  destino.borrar(CLAVE_HORARIO);
  destino.borrar(CLAVE_TAREAS);
}
