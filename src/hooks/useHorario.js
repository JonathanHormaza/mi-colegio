import { useState, useEffect } from "react";
import { guardarDatos, cargarDatos } from "../lib/storage.js";
import { agregarClaseA, actualizarClaseEn, eliminarDe } from "../lib/listas.js";

// Maneja las clases del horario con persistencia local.
export function useHorario() {
  const [clases, setClases] = useState(() => cargarDatos().horario);
  useEffect(() => guardarClases(clases), [clases]);
  // Agrega una clase y devuelve el aviso ("" cuando guarda bien).
  function agregarClase(datos) {
    const resultado = agregarClaseA(clases, datos);
    if (resultado.ok) setClases(resultado.lista);
    return resultado.error;
  }
  // Guarda cambios de una clase y devuelve el aviso.
  function actualizarClase(id, datos) {
    const resultado = actualizarClaseEn(clases, id, datos);
    if (resultado.ok) setClases(resultado.lista);
    return resultado.error;
  }
  // Elimina una clase por id.
  function eliminarClase(id) {
    setClases(eliminarDe(clases, id));
  }
  // Reemplaza todo (lo usa importar respaldo).
  function reemplazarClases(nuevas) {
    setClases(nuevas);
  }
  return { clases, agregarClase, actualizarClase, eliminarClase, reemplazarClases };
}

// Persiste clases conservando las tareas ya guardadas.
function guardarClases(clases) {
  guardarDatos(clases, cargarDatos().tareas);
}
