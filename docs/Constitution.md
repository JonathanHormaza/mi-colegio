# Constitution.md — Agenda Escolar

> Norma madre del proyecto. Precedencia: `Constitution.md` > `AGENTS.md` > `MEMORY.md`.
> Si hay conflicto, manda este documento. Enmiendas solo con versión y fecha.

## 1. Principios del código (innegociables)
1. **Simplicidad radical:** app React + Vite, dependencias mínimas (`react`, `react-dom`, `vite`; solo `vitest` como devDep de test). Nada más sin justificar en el spec. Cero CDNs, cero librerías de fechas/estado.
2. **Legibilidad sobre astucia:** español, camelCase, funciones y componentes cortos (<20 líneas), un comentario breve por función. Cualquiera debe entenderlo sin explicación.
3. **Seguridad por construcción:** jamás `dangerouslySetInnerHTML` con input de usuario ni handlers como strings; render con `{}` (escape automático) + handlers como funciones; todo import pasa por `normalizarClase()` / `normalizarTarea()`.
4. **Local primero:** sin cuentas, sin tracking, sin conexiones externas. Los datos viven en `localStorage` y viajan solo vía Exportar/Importar del usuario.
5. **Diseño con sistema:** tokens Factory, dark-only `#101010`, acentos `#ee6018`/`#a0ca92` solo para datos, cero sombras. Nada decorativo fuera del sistema.

## 2. Metodología (spec manda)
1. `spec.md` es la **única fuente de verdad**: ningún código se escribe sin especificación previa aprobada.
2. Orden de trabajo inviolable: **plan → build → verificar → push**. En plan solo se discute; el código empieza en build.
3. **Deuda vigente:** `spec.md` aún no existe (decisión del dueño). Hasta crearlo, `MEMORY.md > Próximos pasos` hace de spec mínima y cada cambio debe citarla.
4. Cada cambio termina publicado y verificado por hash (local = pública), no por “se ve bien”.

## 3. Testing y Calidad (política mínima)
1. **Obligatorio antes de cada push:** `npm run build` OK + tests de lógica pura (`normalizar*`, `calcularEstado`, resiliencia por módulo con ErrorBoundary). Cero FAIL.
2. **Integridad:** preview de `dist/` responde `200`, `VERSION` consistente en código + badges + legal.
3. **Prohibido pushear** con tests en rojo, con secretos en el árbol o con `TODO` sin issue asociado.
4. Accesibilidad base no regresa: skip-link, `label for`, `aria-live`, foco visible, táctil ≥44px.

## 4. Estructura y memoria
1. **Público (lo usa Pages):** `index.html` (entry Vite), `src/`, `vite.config.js`, `package.json`, `.nojekyll`, `.github/workflows/`, `docs/`. `dist/` lo genera el workflow, no se commitea.
2. **Privado (nunca se commitea):** `AGENTS.md`, `MEMORY.md`, `Desing.md`, llaves, tokens, `ai.sh`, `node_modules/`. Si algo secreto toca el repo, se revoca y se rota.
3. `MEMORY.md` <50 líneas y actualizado al cerrar cada tarea: estado, aprendizajes que costó conseguir, próximos pasos.
4. Versiones semánticas (`vX.Y.Z`) en código, badges, legal y `MEMORY.md`. Sin “versión final”: todo cambio lleva versión.

*Enmienda 2026-10-09 · v1.5.0: migración a React + Vite (adiós 1-archivo vanilla). Ratificada previa v1.4.0 del 2026-10-06.*
