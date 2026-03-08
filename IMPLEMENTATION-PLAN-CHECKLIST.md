# Plan de Implementacion - Checklist de Avance

Fecha: 2026-03-06
Estado general: En progreso (PR1, PR2, PR3, PR4 y PR5 completados; cierre de release pendiente)

## Registro de avances

- 2026-03-06: Inicio del plan en rama `feature/responsive-states-annotations`.
- 2026-03-06: PR1 completado.
  - Actualizados tipos base en `src/types.ts` (`ComponentState`, `ResponsiveMetadata`, `AnnotationMetadata`, `showAnnotations` en `RenderOptions`).
  - Reescrito parser de atributos en `src/parser/transformer.ts` con soporte para comillas, `=`, `:`, estados multiples y clases responsive (`.md:grid-2`).
  - Extendida validacion en `src/parser/index.ts` para estados y metadatos responsive.
  - Anadidos tests de parser y validacion para atributos avanzados, estados y responsive metadata.
  - Verificacion: `npm run typecheck` y `npm run test` en verde.
- 2026-03-06: PR2 completado.
  - Soportado `::: state=...` en parser (estado aplicado a contenedor y propagado a hijos sin sobrescribir estado explicito).
  - Renderers HTML/React/Tailwind actualizados para `props.states` + `props.state`.
  - Renderers actualizan `disabled` cuando viene por estado.
  - CSS compartido de estados anadido en `src/renderer/styles.ts`.
  - Tests nuevos para parser y renderers (inline state + state blocks).
  - Verificacion: `npm run typecheck` y `npm run test` en verde.
- 2026-03-06: PR3 completado.
  - Soporte de viewport blocks `::: mobile` y `::: desktop` en AST como contenedores de seccion con `responsive.visibleIn`.
  - Grid responsive soportado en renderers HTML/React mediante clases por breakpoint (`wmd-grid-sm-1`, `wmd-grid-md-2`, etc.).
  - Tailwind renderer actualizado para generar `sm:grid-cols-*`, `md:grid-cols-*`, etc. cuando hay metadata responsive explicita.
  - CSS compartido responsive agregado para visibilidad por viewport y utilidades de grid por breakpoint.
  - Tests nuevos de parser/validation/renderers para viewport blocks y breakpoints.
  - Verificacion: `npm run typecheck` y `npm run test` en verde.
- 2026-03-07: PR4 completado.
  - Parser actualizado para capturar comentarios HTML (`<!-- ... -->`) como anotaciones en metadata de nodo y en `document.meta.annotations` para comentarios standalone.
  - Soporte funcional de `::: note ... :::` como contenedor de anotacion (oculto por defecto, visible con flag de anotaciones).
  - Normalizacion de metadata de anotaciones en parser (`annotation`, `todo`, `version-note`) hacia `props.annotations`.
  - Renderers HTML/React/Tailwind actualizados para ocultar anotaciones por defecto y mostrarlas con `showAnnotations`.
  - `src/renderer/index.ts` propaga `showAnnotations` a todos los contextos de render.
  - CLI actualizada con `--show-annotations` y passthrough al render HTML.
  - Validacion AST ampliada para `props.annotations` y `meta.annotations`.
  - Cobertura de tests ampliada en parser/renderers/validation/CLI unit.
  - Verificacion: `npm run typecheck` y `npm run test` (suite completa) en verde.
- 2026-03-07: PR5 completado.
  - README actualizado con sintaxis responsive (`.md:grid-*`, viewport blocks), estados (`{:hover}`, `::: state=...`) y anotaciones (`<!-- -->`, `.annotation`, `::: note`), incluyendo uso de `--show-annotations`.
  - Guia de sintaxis en `docs/guide/syntax.md` extendida con secciones completas para responsive/states/annotations y comandos CLI corregidos (`wiremd`).
  - QUICK-REFERENCE actualizado como cheat sheet de nuevas sintaxis (`.md:grid-*`, `{:hover}`, `::: note`) y comando de anotaciones.
  - SYNTAX-SPEC-v0.1 actualizado para reflejar extensiones implementadas y ejemplos AST/JSON de responsive + annotations.
  - CHANGELOG actualizado en `Unreleased` con entradas de responsive/state/annotations y notas de compatibilidad.

## PR 1 - Base tecnica (AST + parser robusto de atributos)

- [x] [src/types.ts](/home/inigo_novoa/wiremd/wiremd/src/types.ts): anadir tipos para `states` ampliados, `responsive` (breakpoints), `annotations`, y `RenderOptions.showAnnotations`.
  Criterio de aceptacion: compila sin `any` nuevos y el AST resultante soporta los 3 issues sin campos ad-hoc.
- [x] [src/parser/transformer.ts](/home/inigo_novoa/wiremd/wiremd/src/parser/transformer.ts): reemplazar `parseAttributes` por parser de tokens con soporte de comillas, `=`, `:` y clases con prefijo breakpoint (`.md:grid-2`).
  Criterio de aceptacion: parsea correctamente `.class`, `key:value`, `key="value con espacios"`, `:state`, `state=hover`, `.sm:grid-1`.
- [x] [tests/parser.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/parser.test.ts): anadir casos de regresion para atributos legacy y nuevos.
  Criterio de aceptacion: todos los casos legacy siguen pasando y nuevos casos validan AST esperado.
- [x] [tests/validation.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/validation.test.ts): validar estados soportados y shape de metadata responsive/annotations.
  Criterio de aceptacion: estados invalidos fallan validacion de forma explicita.
- [x] [tests/type-guards.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/type-guards.test.ts): ajustar guards si cambia union de tipos o nodos.
  Criterio de aceptacion: sin regresiones de narrowing en TypeScript.

Criterio de aceptacion del PR:
- [x] `npm run typecheck`
- [x] `npm run test`

## PR 2 - Issue #50 (State syntax)

- [x] [src/parser/remark-containers.ts](/home/inigo_novoa/wiremd/wiremd/src/parser/remark-containers.ts): soportar `::: state=hover` como bloque semantico de estado.
  Criterio de aceptacion: el contenedor conserva el estado para aplicacion a hijos.
- [x] [src/parser/transformer.ts](/home/inigo_novoa/wiremd/wiremd/src/parser/transformer.ts): mapear inline `{:hover}` y bloque `state=...` al AST uniforme (`props.state` o `props.states`).
  Criterio de aceptacion: `[Submit]{:disabled}` y `::: state=hover` generan metadata consistente.
- [x] [src/renderer/html-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/html-renderer.ts): aplicar clase y atributo de estado por componente (`button`, `input`, `container`).
  Criterio de aceptacion: HTML refleja estados y `disabled/loading` siguen funcionando.
- [x] [src/renderer/react-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/react-renderer.ts): mismo mapeo de estado para JSX.
  Criterio de aceptacion: JSX contiene clases y props coherentes con HTML renderer.
- [x] [src/renderer/tailwind-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/tailwind-renderer.ts): mapear estados a utilities (`opacity`, `cursor`, clases de color/error/success).
  Criterio de aceptacion: output tailwind cambia visualmente segun estado.
- [x] [src/renderer/styles.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/styles.ts): reglas CSS para estados en estilos no-tailwind.
  Criterio de aceptacion: `hover/active/focus/error/success` visibles sin romper temas existentes.
- [x] [tests/parser.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/parser.test.ts), [tests/renderer.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/renderer.test.ts), [tests/react-renderer.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/react-renderer.test.ts), [tests/tailwind-renderer.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/tailwind-renderer.test.ts): cobertura completa de inline + block states.
  Criterio de aceptacion: casos nuevos pasan en los 3 renderers.

Criterio de aceptacion del PR:
- [x] Soporte completo de estados listados en issue #50
- [x] Sin breaking changes

## PR 3 - Issue #49 (Responsive breakpoints)

- [x] [src/parser/transformer.ts](/home/inigo_novoa/wiremd/wiremd/src/parser/transformer.ts): extraer breakpoints en grid headings (`.grid-3 .md:grid-2 .sm:grid-1`) y guardarlos en metadata de nodo `grid`.
  Criterio de aceptacion: AST del grid contiene configuracion por breakpoint.
- [x] [src/parser/remark-containers.ts](/home/inigo_novoa/wiremd/wiremd/src/parser/remark-containers.ts): soportar `::: mobile` y `::: desktop` como viewport blocks.
  Criterio de aceptacion: se conserva `viewport` en el nodo contenedor.
- [x] [src/renderer/html-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/html-renderer.ts): emitir clases responsive para grid + visibilidad de viewport blocks.
  Criterio de aceptacion: HTML final aplica layout distinto en `sm/md/lg`.
- [x] [src/renderer/react-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/react-renderer.ts): equivalente JSX de clases responsive.
  Criterio de aceptacion: React output conserva los mismos breakpoints que HTML.
- [x] [src/renderer/tailwind-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/tailwind-renderer.ts): convertir metadata a `sm:grid-cols-*`, `md:grid-cols-*`, `lg:grid-cols-*`.
  Criterio de aceptacion: tailwind output respeta exactamente los breakpoints declarados.
- [x] [src/renderer/styles.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/styles.ts): media queries para estilos no-tailwind.
  Criterio de aceptacion: `grid` responde segun metadata, no solo fallback global a 1 columna.
- [x] [tests/parser.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/parser.test.ts), [tests/renderer.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/renderer.test.ts), [tests/react-renderer.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/react-renderer.test.ts), [tests/tailwind-renderer.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/tailwind-renderer.test.ts): tests de sintaxis responsive y viewport blocks.
  Criterio de aceptacion: snapshots o asserts demuestran cambio por breakpoint.

Criterio de aceptacion del PR:
- [x] Sintaxis responsive del issue #49 soportada end-to-end

## PR 4 - Issue #51 (Annotations/comments)

- [x] [src/parser/transformer.ts](/home/inigo_novoa/wiremd/wiremd/src/parser/transformer.ts): capturar comentarios `<!-- ... -->` como metadata y evitar render por defecto.
  Criterio de aceptacion: comentarios no aparecen en HTML/React/Tailwind estandar.
- [x] [src/parser/remark-containers.ts](/home/inigo_novoa/wiremd/wiremd/src/parser/remark-containers.ts): soportar `::: note ... :::` como nodo de anotacion.
  Criterio de aceptacion: bloque `note` llega al AST con contenido estructurado.
- [x] [src/types.ts](/home/inigo_novoa/wiremd/wiremd/src/types.ts): definir shape de anotaciones (`annotation`, `note`, `todo`, `version-note`) en AST/props.
  Criterio de aceptacion: salida JSON incluye anotaciones de forma estable.
- [x] [src/renderer/index.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/index.ts): propagar `showAnnotations` a context de renderers.
  Criterio de aceptacion: flag global activa/desactiva render visual de anotaciones.
- [x] [src/renderer/html-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/html-renderer.ts), [src/renderer/react-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/react-renderer.ts), [src/renderer/tailwind-renderer.ts](/home/inigo_novoa/wiremd/wiremd/src/renderer/tailwind-renderer.ts): render condicional de anotaciones cuando `showAnnotations=true`.
  Criterio de aceptacion: con flag se ven notas; sin flag no.
- [x] [src/cli/index.ts](/home/inigo_novoa/wiremd/wiremd/src/cli/index.ts): anadir `--show-annotations`, help y passthrough a renderer.
  Criterio de aceptacion: CLI acepta flag y modifica salida sin romper opciones actuales.
- [x] [tests/parser.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/parser.test.ts), [tests/renderer.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/renderer.test.ts), [tests/cli.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/cli.test.ts), [tests/cli-unit.test.ts](/home/inigo_novoa/wiremd/wiremd/tests/cli-unit.test.ts): cobertura de comentarios inline, notas y flag CLI.
  Criterio de aceptacion: JSON siempre contiene anotaciones; render visual solo con flag.

Criterio de aceptacion del PR:
- [x] Issue #51 cubierto completo con modo oculto por defecto

## PR 5 - Documentacion y cierre

- [x] [README.md](/home/inigo_novoa/wiremd/wiremd/README.md): anadir nuevas sintaxis y ejemplos CLI con `--show-annotations`.
  Criterio de aceptacion: ejemplos ejecutables y consistentes con parser actual.
- [x] [docs/guide/syntax.md](/home/inigo_novoa/wiremd/wiremd/docs/guide/syntax.md): seccion de responsive, states y annotations.
  Criterio de aceptacion: guia incluye al menos 1 ejemplo por feature y variantes.
- [x] [QUICK-REFERENCE.md](/home/inigo_novoa/wiremd/wiremd/QUICK-REFERENCE.md): cheat sheet actualizado (`.md:grid-*`, `{:hover}`, `::: note`).
  Criterio de aceptacion: referencia rapida alineada con tests.
- [x] [SYNTAX-SPEC-v0.1.md](/home/inigo_novoa/wiremd/wiremd/SYNTAX-SPEC-v0.1.md): marcar extensiones implementadas y ejemplos AST.
  Criterio de aceptacion: spec describe comportamiento real de implementacion.
- [x] [CHANGELOG.md](/home/inigo_novoa/wiremd/wiremd/CHANGELOG.md): entradas por feature + notas de compatibilidad.
  Criterio de aceptacion: release notes claras para usuarios existentes.

Criterio de aceptacion del PR:
- [x] Documentacion y ejemplos sincronizados con comportamiento real del codigo

## Checklist final de release

- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] Probar manualmente 3 archivos demo: responsive, states, annotations con y sin `--show-annotations`
- [ ] Verificar que salida HTML, React, Tailwind y JSON reflejan los mismos metadatos clave
