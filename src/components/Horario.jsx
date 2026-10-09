import React, { useState } from "react";
import { diasSemana } from "../lib/constantes.js";
import { textoCantidad } from "../lib/validacion.js";
import { ordenarClases } from "../lib/listas.js";

// Muestra una clase de PC con sus botones.
function CajaClase({ clase, hora, alEditar, alBorrar }) {
  return (
    <div className="clase">
      <span className="etiqueta-dia">{clase.dia} {hora}</span>
      <b>{clase.materia}</b>
      <br />
      <button type="button" className="btn-pequeno btn-editar" onClick={() => alEditar(clase.id)}>Editar</button>
      <button type="button" className="btn-pequeno btn-borrar" onClick={() => alBorrar(clase.id)}>X</button>
    </div>
  );
}

// Dibuja las filas por bloque horario (vista PC).
function FilasPc({ ordenadas, horas, alEditar, alBorrar }) {
  if (!horas.length) return <tr><td colSpan="6" className="vacio">Sin clases. Agrega tu primera materia.</td></tr>;
  return horas.map((hora) => (
    <tr key={hora}>
      <td><b>{hora}</b></td>
      {diasSemana.map((dia) => (
        <CeldaDia key={dia} dia={dia} hora={hora} ordenadas={ordenadas} alEditar={alEditar} alBorrar={alBorrar} />
      ))}
    </tr>
  ));
}

// Dibuja una celda de día (vacía o con su clase).
function CeldaDia({ dia, hora, ordenadas, alEditar, alBorrar }) {
  const clase = ordenadas.find((c) => c.dia === dia && (c.inicio + " - " + c.fin) === hora);
  if (!clase) return <td className="vacia">-</td>;
  return <td><CajaClase clase={clase} hora={hora} alEditar={alEditar} alBorrar={alBorrar} /></td>;
}

// Dibuja las clases de un día (vista móvil).
function FilaDia({ dia, delDia, alEditar, alBorrar }) {
  return (
    <tr className="lista-dia">
      <td>
        <b className="fila-dia-titulo">{dia}</b>
        {delDia.map((clase) => (
          <div className="clase" key={clase.id}>
            <b>{clase.materia}</b>
            <span className="hora-linea">{clase.inicio} - {clase.fin}</span>
            <div className="acciones">
              <button type="button" className="btn-pequeno btn-editar" onClick={() => alEditar(clase.id)}>Editar</button>
              <button type="button" className="btn-pequeno btn-borrar" onClick={() => alBorrar(clase.id)}>X</button>
            </div>
          </div>
        ))}
      </td>
    </tr>
  );
}

// Dibuja la lista agrupada por día (vista móvil).
function FilasMovil({ ordenadas, alEditar, alBorrar }) {
  if (!ordenadas.length) return <tr><td className="vacio">Sin clases. Agrega tu primera materia.</td></tr>;
  return diasSemana.map((dia) => {
    const delDia = ordenadas.filter((c) => c.dia === dia);
    if (!delDia.length) return null;
    return <FilaDia key={dia} dia={dia} delDia={delDia} alEditar={alEditar} alBorrar={alBorrar} />;
  });
}

// Formulario de alta y edición de clases.
function FormularioHorario({ valores, alCambiar, aviso, editando, alGuardar }) {
  return (
    <form onSubmit={alGuardar} noValidate>
      <div className="fila">
        <div><label htmlFor="horarioDia">Día</label>
          <select id="horarioDia" value={valores.dia} onChange={(e) => alCambiar("dia", e.target.value)}>
            {diasSemana.map((d) => <option key={d}>{d}</option>)}
          </select></div>
        <div><label htmlFor="horarioMateria">Materia</label>
          <input id="horarioMateria" maxLength="60" placeholder="Ej: Matemáticas" required autoComplete="off" value={valores.materia} onChange={(e) => alCambiar("materia", e.target.value)} /></div>
      </div>
      <div className="fila">
        <div><label htmlFor="horarioInicio">Hora inicio</label>
          <input id="horarioInicio" type="time" required value={valores.inicio} onChange={(e) => alCambiar("inicio", e.target.value)} /></div>
        <div><label htmlFor="horarioFin">Hora fin</label>
          <input id="horarioFin" type="time" required value={valores.fin} onChange={(e) => alCambiar("fin", e.target.value)} /></div>
      </div>
      <p className={"error" + (aviso ? " visible" : "")} role="alert">{aviso}</p>
      <button className="btn-principal" type="submit">{editando === null ? "Agregar clase" : "Guardar cambios"}</button>
    </form>
  );
}

// Valores iniciales del formulario de horario.
const VACIO = { dia: "Lunes", materia: "", inicio: "07:00", fin: "08:00" };

// Gestiona el horario semanal Lun–Vie con su formulario.
export function Horario({ clases, alAgregar, alActualizar, alBorrar }) {
  const [valores, setValores] = useState(VACIO);
  const [aviso, setAviso] = useState("");
  const [editando, setEditando] = useState(null);
  const ordenadas = ordenarClases(clases.filter((c) => c && diasSemana.includes(c.dia)));
  const horas = [...new Set(ordenadas.map((c) => c.inicio + " - " + c.fin))];
  // Guarda alta o edición y muestra el aviso cuando falla.
  function guardar(evento) {
    evento.preventDefault();
    const error = editando === null ? alAgregar(valores) : alActualizar(editando, valores);
    setAviso(error);
    if (!error) setValores(VACIO);
    if (!error) setEditando(null);
  }
  // Carga una clase en el formulario para editarla.
  function editar(id) {
    const clase = clases.find((c) => c.id === id);
    if (!clase) return;
    setValores({ dia: clase.dia, materia: clase.materia, inicio: clase.inicio, fin: clase.fin });
    setEditando(id);
    setAviso("");
  }
  return (
    <section id="horario" aria-labelledby="tituloHorario">
      <p className="eyebrow">01 — Horario semanal</p>
      <div className="sec-head">
        <div><h2 id="tituloHorario">Horario semanal</h2><p>Lunes a viernes · se guarda en este navegador</p></div>
        <p className="muted">{textoCantidad(clases.length, "clase", "clases")} en total</p>
      </div>
      <FormularioHorario valores={valores} alCambiar={(k, v) => setValores({ ...valores, [k]: v })} aviso={aviso} editando={editando} alGuardar={guardar} />
      <br />
      <div className="tabla-contenedor solo-pc">
        <table>
          <caption className="muted" style={{ captionSide: "bottom", padding: ".4rem" }}>La hora de fin debe ser mayor que la de inicio. No se permiten dos clases en el mismo día y horario.</caption>
          <thead><tr><th scope="col">Hora</th>{diasSemana.map((d) => <th scope="col" key={d}>{d}</th>)}</tr></thead>
          <tbody><FilasPc ordenadas={ordenadas} horas={horas} alEditar={editar} alBorrar={alBorrar} /></tbody>
        </table>
      </div>
      <div className="tabla-contenedor solo-movil">
        <table>
          <tbody><FilasMovil ordenadas={ordenadas} alEditar={editar} alBorrar={alBorrar} /></tbody>
        </table>
      </div>
    </section>
  );
}
