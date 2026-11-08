# React + Vite

## Page camera settings

Each page in `src/pageConfig.js` defines a camera `orientation` (pitch, yaw,
and roll in radians), `zoom`, and `transitionSpeed`. Zoom must be positive:
`1` is the default view, values greater than `1` zoom in, and values below
`1` zoom out. Zoom and orientation both transition at the page's configured
speed.

Each camera also has `mouseRotation` settings: `pitch`, `yawNarrow`, and
`yawWide` are maximum rotation offsets in radians. Yaw interpolates between
the narrow (480px) and wide (1920px) limits. Set all three to `0` to disable
mouse rotation. `damping` controls how quickly the camera follows the mouse:
larger positive values follow faster, and smaller values produce more smoothing.
The existing scroll-based fade-in of mouse rotation still applies.

`TerminalText` accepts `visible` (default `true`) to hide the text and disable
its click target. `revealed` independently controls its scroll-triggered reveal
animation; both must be true for the text to be interactive.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
