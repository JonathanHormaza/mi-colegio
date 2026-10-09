import { diasSemana, NOMBRE_APP, VERSION, TAM_MAXIMO_BYTES } from "./constantes.js";

// Formato de hora HH:MM exigido al importar.
const FORMATO_HORA = /^\d{2}:\d{2}$/;
// Formato de fecha AAAA-MM-DD exigido al importar.
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Valida una clase importada y la normaliza (null si inválida).
export function normalizarClase(c) {
  if (!c || typeof c !== "object") return null;
  if (typeof c.id !== "string" || !diasSemana.includes(c.dia)) return null;
  if (!FORMATO_HORA.test(c.inicio || "") || !FORMATO_HORA.test(c.fin || "")) return null;
  if (c.fin <= c.inicio) return null;
  return { id: c.id.slice(0, 40), dia: c.dia, materia: String(c.materia || "").slice(0, 60), inicio: c.inicio, fin: c.fin };
}

// Valida una tarea importada y la normaliza (null si inválida).
export function normalizarTarea(t) {
  if (!t || typeof t !== "object") return null;
  if (typeof t.id !== "string" || !FORMATO_FECHA.test(t.fechaEntrega || "")) return null;
  return { id: t.id.slice(0, 40), materia: String(t.materia || "").slice(0, 60), titulo: String(t.titulo || "").slice(0, 80), descripcion: String(t.descripcion || "").slice(0, 500), fechaEntrega: t.fechaEntrega, entregada: t.entregada === true };
}

// Determina Pendiente / Entregada / Vencida (solo fecha nativa).
export function calcularEstado(tarea, hoy = new Date()) {
  if (tarea.entregada) return "Entregada";
  const inicioHoy = new Date(hoy);
  inicioHoy.setHours(0, 0, 0, 0);
  const entrega = new Date(tarea.fechaEntrega + "T00:00:00");
  if (entrega < inicioHoy) return "Vencida";
  return "Pendiente";
}

// Arma "1 clase" o "0 clases" según el conteo.
export function textoCantidad(cantidad, singular, plural) {
  return cantidad + " " + (cantidad === 1 ? singular : plural);
}

// Dice si el bloque choca con otra clase del mismo día.
export function haySolape(lista, dia, inicio, fin, ignorarId) {
  return lista.some((c) => c.dia === dia && c.id !== ignorarId && inicio < c.fin && c.inicio < fin);
}

// Valida alta o edición de clase ("" = válida, texto = aviso).
export function validarClase(lista, dia, inicio, fin, ignorarId) {
  if (!dia || !inicio || !fin) return "Completa día, inicio y fin.";
  if (fin <= inicio) return "La hora de fin debe ser mayor que la de inicio.";
  const choque = lista.some((c) => c.dia === dia && c.inicio === inicio && c.fin === fin && c.id !== ignorarId);
  if (choque) return "Ya existe una clase en ese día y horario.";
  if (haySolape(lista, dia, inicio, fin, ignorarId)) return "Ese horario se cruza con otra clase del mismo día.";
  return "";
}

// Arma el objeto de respaldo con fecha inyectada (pura y testeable).
export function construirRespaldo(horario, tareas, hoyISO) {
  return { app: NOMBRE_APP, version: VERSION, exportado: hoyISO, horario, tareas };
}

// Dice si hay al menos un dato para enviar.
export function hayDatos(horario, tareas) {
  return horario.length > 0 || tareas.length > 0;
}

// Valida un respaldo importado sin tocar lo guardado.
export function analizarRespaldo(datos) {
  if (!datos || typeof datos !== "object") return { ok: false, error: "Archivo inválido. No se importó nada." };
  if (!Array.isArray(datos.horario) || !Array.isArray(datos.tareas)) return { ok: false, error: "Archivo inválido. No se importó nada." };
  return { ok: true, horario: datos.horario.map(normalizarClase).filter(Boolean), tareas: datos.tareas.map(normalizarTarea).filter(Boolean) };
}

// Dice si el texto supera el tope de 1 MB.
export function excedeTamano(texto) {
  return new Blob([texto]).size > TAM_MAXIMO_BYTES;
}

// Nombre del día actual en español (fecha inyectable para probar).
export function obtenerDiaHoy(fecha = new Date()) {
  const nombres = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return nombres[fecha.getDay()];
}

// Cuenta las clases válidas del día dado.
export function contarClasesHoy(clases, diaHoy) {
  return clases.filter((c) => c && diasSemana.includes(c.dia) && c.dia === diaHoy).length;
}

// Cuenta las tareas sin entregar.
export function contarPendientes(tareas) {
  return tareas.filter((t) => !t.entregada).length;
}

// Elige vía de envío según capacidades del navegador.
export function elegirVia(puedeArchivos, hayPortapapeles, hayClasico) {
  if (puedeArchivos) return "archivos";
  if (hayPortapapeles) return "portapapeles";
  if (hayClasico) return "clasico";
  return "nada";
}
