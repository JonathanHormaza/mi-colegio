import React, { useState } from "react";
import { textoCantidad, calcularEstado } from "../lib/validacion.js";
import { ordenarTareas, materiasUnicas } from "../lib/listas.js";

// Muestra una tarea con su estado y acciones.
function TarjetaTarea({ tarea, alEntregar, alEditar, alBorrar }) {
  const estado = calcularEstado(tarea);
  return (
    <div className="tarea">
      <div className="tarea-cabeza">
        <b>{tarea.materia} — {tarea.titulo}</b>
        <span className={"estado " + estado.toLowerCase()}>{estado}</span>
      </div>
      <div>{tarea.descripcion || "Sin descripción"}</div>
      <small className="muted">Entrega: {tarea.fechaEntrega}</small>
      <div>
        {!tarea.entregada && <button type="button" className="btn-pequeno btn-entregar" onClick={() => alEntregar(tarea.id)}>Marcar entregada</button>}
        <button type="button" className="btn-pequeno btn-editar" onClick={() => alEditar(tarea.id)}>Editar</button>
        <button type="button" className="btn-pequeno btn-borrar" onClick={() => alBorrar(tarea.id)}>Eliminar</button>
      </div>
    </div>
  );
}

// Formulario de alta y edición de tareas.
function FormularioTarea({ valores, alCambiar, aviso, editando, alGuardar }) {
  return (
    <form onSubmit={alGuardar} noValidate>
      <div className="fila">
        <div><label htmlFor="tareaMateria">Materia</label>
          <input id="tareaMateria" maxLength="60" placeholder="Ej: Ciencias" required autoComplete="off" value={valores.materia} onChange={(e) => alCambiar("materia", e.target.value)} /></div>
        <div><label htmlFor="tareaFecha">Fecha de entrega</label>
          <input id="tareaFecha" type="date" required value={valores.fechaEntrega} onChange={(e) => alCambiar("fechaEntrega", e.target.value)} /></div>
      </div>
      <div><label htmlFor="tareaTitulo">Título</label>
        <input id="tareaTitulo" maxLength="80" placeholder="Ej: Taller página 45" required autoComplete="off" value={valores.titulo} onChange={(e) => alCambiar("titulo", e.target.value)} /></div>
      <div><label htmlFor="tareaDescripcion">Descripción</label>
        <textarea id="tareaDescripcion" rows="2" maxLength="500" placeholder="Detalles de la tarea..." value={valores.descripcion} onChange={(e) => alCambiar("descripcion", e.target.value)} /></div>
      <p className={"error" + (aviso ? " visible" : "")} role="alert">{aviso}</p>
      <button className="btn-principal" type="submit">{editando === null ? "Agregar tarea" : "Guardar cambios"}</button>
    </form>
  );
}

// Valores iniciales del formulario de tareas.
const VACIA = { materia: "", titulo: "", descripcion: "", fechaEntrega: "" };

// Gestiona las tareas con filtro por materia.
export function Tareas({ tareas, alAgregar, alActualizar, alEntregar, alBorrar }) {
  const [valores, setValores] = useState(VACIA);
  const [aviso, setAviso] = useState("");
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const visibles = filtrarTareas(tareas, filtro);
  // Guarda alta o edición y muestra el aviso cuando falla.
  function guardar(evento) {
    evento.preventDefault();
    const error = editando === null ? alAgregar(valores) : alActualizar(editando, valores);
    setAviso(error);
    if (!error) setValores(VACIA);
    if (!error) setEditando(null);
  }
  // Carga una tarea en el formulario para editarla.
  function editar(id) {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;
    setValores({ materia: tarea.materia, titulo: tarea.titulo, descripcion: tarea.descripcion, fechaEntrega: tarea.fechaEntrega });
    setEditando(id);
    setAviso("");
  }
  return (
    <section id="tareas" aria-labelledby="tituloTareas">
      <p className="eyebrow">02 — Tareas</p>
      <div className="sec-head">
        <div><h2 id="tituloTareas">Tareas</h2><p>El estado se calcula solo con la fecha de entrega</p></div>
        <p className="muted">{textoCantidad(tareas.length, "tarea", "tareas")} en total</p>
      </div>
      <FormularioTarea valores={valores} alCambiar={(k, v) => setValores({ ...valores, [k]: v })} aviso={aviso} editando={editando} alGuardar={guardar} />
      <br />
      <div className="filtros">
        <label htmlFor="filtroMateria">Materia</label>
        <select id="filtroMateria" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todas">Todas las materias</option>
          {materiasUnicas(tareas).map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="lista-tareas" aria-live="polite">
        {visibles.length === 0 && <div className="vacio">Sin tareas. Agrega la primera.</div>}
        {visibles.map((tarea) => <TarjetaTarea key={tarea.id} tarea={tarea} alEntregar={alEntregar} alEditar={editar} alBorrar={alBorrar} />)}
      </div>
    </section>
  );
}

// Filtra y ordena las tareas visibles por fecha.
function filtrarTareas(tareas, filtro) {
  const ordenadas = ordenarTareas(tareas);
  if (filtro === "todas") return ordenadas;
  return ordenadas.filter((t) => t.materia === filtro);
}
