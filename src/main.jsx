import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// Rompe iframes de terceros (Pages no permite headers anti-clickjacking).
if (window.top !== window.self) window.top.location = window.self.location;

// Arranca la app en el nodo raíz.
const nodo = document.getElementById("raiz");
createRoot(nodo).render(<App />);
