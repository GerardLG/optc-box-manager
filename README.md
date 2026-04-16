# OPTC Box Manager

Aplicación web (React + Vite + TypeScript) para **gestionar tu caja** en *One Piece Treasure Cruise*: buscar personajes, marcar los que tienes, favoritos, exportar/importar datos y ajustes. Los datos del juego se cargan en el cliente desde los repositorios públicos de [optc-db](https://github.com/optc-db/optc-db.github.io) / forks mantenidos (ver [src/services/unitsLoader.ts](src/services/unitsLoader.ts)).

## Requisitos

- Node.js 18+ (el CI usa 22)

## Desarrollo

```bash
npm install
npm run dev
```

## Build y vista previa

```bash
npm run build
npm run preview
```

## Despliegue (GitHub Pages)

El `base` de Vite está fijado a **`/optc-box-manager/`** ([vite.config.ts](vite.config.ts)). La app asume esa ruta en producción; si cambias el nombre del repo o la URL de Pages, actualiza `base` y el `basename` del router en [src/main.tsx](src/main.tsx).

El workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) construye y publica la carpeta `dist` en GitHub Pages.

En producción, **`public/404.html`** redirige rutas desconocidas a `/?redirect=…`; [src/components/GithubPagesRedirect.tsx](src/components/GithubPagesRedirect.tsx) aplica esa ruta en React Router para que enlaces directos (p. ej. `/detail/123`) funcionen al recargar.

El build de producción registra un **service worker** (PWA) para cachear assets; manifest en `dist/manifest.webmanifest`.

## Scripts adicionales

- `npm run lint` — ESLint sobre `src`
- `npm run test` — Vitest (tests unitarios)

## Persistencia

La caja y ajustes se guardan en `localStorage` (con fallback en memoria si no hay almacenamiento). Ver [src/services/storage.ts](src/services/storage.ts).

## Fuentes de datos

La lista canónica de unidades en runtime es **`unitsLoader`**: descarga y parsea `units.js`, `cooldowns.js` y `details.js` desde GitHub raw. Las miniaturas combinan la API de optc-db y el mirror 2Shankz en [src/components/Image/UnitImage.tsx](src/components/Image/UnitImage.tsx).
