import { useState, useEffect } from "react";
import { guardarDatos, cargarDatos } from "../lib/storage.js";
import { agregarTareaA, actualizarTareaEn, marcarEntregadaEn, eliminarDe } from "../lib/listas.js";

// Maneja las tareas con persistencia local.
export function useTareas() {
  const [tareas, setTareas] = useState(() => cargarDatos().tareas);
  useEffect(() => guardarTareas(tareas), [tareas]);
  // Agrega una tarea y devuelve el aviso ("" cuando guarda bien).
  function agregarTarea(datos) {
    const resultado = agregarTareaA(tareas, datos);
    if (resultado.ok) setTareas(resultado.lista);
    return resultado.error;
  }
  // Guarda cambios de una tarea y devuelve el aviso.
  function actualizarTarea(id, datos) {
    const resultado = actualizarTareaEn(tareas, id, datos);
    if (resultado.ok) setTareas(resultado.lista);
    return resultado.error;
  }
  // Marca una tarea como entregada.
  function entregarTarea(id) {
    setTareas(marcarEntregadaEn(tareas, id));
  }
  // Elimina una tarea por id.
  function eliminarTarea(id) {
    setTareas(eliminarDe(tareas, id));
  }
  // Reemplaza todo (lo usa importar respaldo).
  function reemplazarTareas(nuevas) {
    setTareas(nuevas);
  }
  return { tareas, agregarTarea, actualizarTarea, entregarTarea, eliminarTarea, reemplazarTareas };
}

// Persiste tareas conservando el horario ya guardado.
function guardarTareas(tareas) {
  guardarDatos(cargarDatos().horario, tareas);
}
