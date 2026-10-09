import React from "react";
import { useHorario } from "./hooks/useHorario.js";
import { useTareas } from "./hooks/useTareas.js";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { Encabezado } from "./components/Encabezado.jsx";
import { PanelHoy } from "./components/PanelHoy.jsx";
import { Horario } from "./components/Horario.jsx";
import { Tareas } from "./components/Tareas.jsx";
import { Respaldo } from "./components/Respaldo.jsx";
import { Legal } from "./components/Legal.jsx";
import { Pie } from "./components/Pie.jsx";

// Ensambla los módulos, cada uno aislado con su ErrorBoundary.
function App() {
  const horario = useHorario();
  const tareas = useTareas();
  // Reemplaza todo con un respaldo importado.
  function importar(horarioNuevo, tareasNuevas) {
    horario.reemplazarClases(horarioNuevo);
    tareas.reemplazarTareas(tareasNuevas);
  }
  // Vacía la app tras borrar los datos locales.
  function vaciar() {
    horario.reemplazarClases([]);
    tareas.reemplazarTareas([]);
  }
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Encabezado />
      <main id="contenido">
        <ErrorBoundary mensaje="El resumen no se pudo mostrar.">
          <PanelHoy clases={horario.clases} tareas={tareas.tareas} />
        </ErrorBoundary>
        <ErrorBoundary mensaje="El horario no se pudo mostrar. Tus tareas siguen disponibles.">
          <Horario clases={horario.clases} alAgregar={horario.agregarClase} alActualizar={horario.actualizarClase} alBorrar={horario.eliminarClase} />
        </ErrorBoundary>
        <ErrorBoundary mensaje="Las tareas no se pudieron mostrar. Tu horario sigue disponible.">
          <Tareas tareas={tareas.tareas} alAgregar={tareas.agregarTarea} alActualizar={tareas.actualizarTarea} alEntregar={tareas.entregarTarea} alBorrar={tareas.eliminarTarea} />
        </ErrorBoundary>
        <ErrorBoundary mensaje="El respaldo no se pudo mostrar.">
          <Respaldo clases={horario.clases} tareas={tareas.tareas} alImportar={importar} alVaciar={vaciar} />
        </ErrorBoundary>
        <Legal />
      </main>
      <Pie />
    </>
  );
}

export default App;
