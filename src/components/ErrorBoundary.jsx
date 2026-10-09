import React from "react";

// Aísla el fallo de un módulo sin tumbar el resto (equivale a mostrarTodo).
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fallo: false };
  }
  // Activa la vista de fallo en el próximo render.
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  // Registra el error sin mostrar detalles al usuario.
  componentDidCatch() {}
  render() {
    if (this.state.fallo) return <p className="error visible" role="alert">{this.props.mensaje}</p>;
    return this.props.children;
  }
}
