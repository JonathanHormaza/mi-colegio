import { validarClase } from "./validacion.js";

// Genera id único de texto.
export function crearId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Agrega una clase validada (no muta la lista).
export function agregarClaseA(lista, datos) {
  const materia = (datos.materia || "").trim();
  if (!materia) return { ok: false, lista, error: "Escribe la materia." };
  const error = validarClase(lista, datos.dia, datos.inicio, datos.fin, null);
  if (error) return { ok: false, lista, error };
  return { ok: true, lista: [...lista, { id: crearId(), dia: datos.dia, materia, inicio: datos.inicio, fin: datos.fin }], error: "" };
}

// Actualiza una clase sin que choque consigo misma.
export function actualizarClaseEn(lista, id, datos) {
  const materia = (datos.materia || "").trim();
  if (!materia) return { ok: false, lista, error: "Escribe la materia." };
  const error = validarClase(lista, datos.dia, datos.inicio, datos.fin, id);
  if (error) return { ok: false, lista, error };
  return { ok: true, lista: lista.map((c) => (c.id === id ? { ...c, dia: datos.dia, materia, inicio: datos.inicio, fin: datos.fin } : c)), error: "" };
}

// Elimina un elemento por id (no muta la lista).
export function eliminarDe(lista, id) {
  return lista.filter((e) => e.id !== id);
}

// Agrega una tarea validada (no muta la lista).
export function agregarTareaA(lista, datos) {
  const materia = (datos.materia || "").trim();
  const titulo = (datos.titulo || "").trim();
  if (!materia || !titulo || !datos.fechaEntrega) return { ok: false, lista, error: "Materia, título y fecha son obligatorios." };
  return { ok: true, lista: [...lista, { id: crearId(), materia, titulo, descripcion: (datos.descripcion || "").trim(), fechaEntrega: datos.fechaEntrega, entregada: false }], error: "" };
}

// Actualiza una tarea validando los obligatorios.
export function actualizarTareaEn(lista, id, datos) {
  const materia = (datos.materia || "").trim();
  const titulo = (datos.titulo || "").trim();
  if (!materia || !titulo || !datos.fechaEntrega) return { ok: false, lista, error: "Materia, título y fecha son obligatorios." };
  const cambiada = (t) => (t.id === id ? { ...t, materia, titulo, descripcion: (datos.descripcion || "").trim(), fechaEntrega: datos.fechaEntrega } : t);
  return { ok: true, lista: lista.map(cambiada), error: "" };
}

// Marca una tarea como entregada.
export function marcarEntregadaEn(lista, id) {
  return lista.map((t) => (t.id === id ? { ...t, entregada: true } : t));
}

// Ordena clases por hora de inicio.
export function ordenarClases(lista) {
  return [...lista].sort((a, b) => a.inicio.localeCompare(b.inicio));
}

// Ordena tareas por fecha de entrega.
export function ordenarTareas(lista) {
  return [...lista].sort((a, b) => a.fechaEntrega.localeCompare(b.fechaEntrega));
}

// Lista materias únicas ordenadas para el filtro.
export function materiasUnicas(tareas) {
  return [...new Set(tareas.map((t) => t.materia))].sort();
}
