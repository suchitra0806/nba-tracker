# NBA Match Tracker Dashboard

Wanted to build something clean with TypeScript and Tailwind, so I put together this NBA tracker. It hits the balldontlie API for game data and renders everything through Recharts. It’s basically a high-performance React playground for keeping tabs on the league.

Here's an interactive, visually polished dashboard for exploring recent NBA games. Built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Recharts** and powered by the public **balldontlie** NBA data API.

## Features

- **Responsive, modern UI** with gradient background, glassy cards, and subtle shadows.
- **Season & date-window filters** to focus on recent games.
- **Optional team search** across team name, city, and abbreviation.
- **Game table** showing scores, total points, and win margins with visual cues.
- **Summary tiles** for averages and outliers (avg total points, close games, blowouts, etc.).
- **Trend chart** visualizing combined points and margins over the selected window.

> Note: This project uses the free [balldontlie](https://www.balldontlie.io/) API. In production you should obtain an API key and configure rate limits/caching.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure (optional) API key

If you have a `balldontlie` API key, create a `.env` file in the project root:

```bash
VITE_NBA_API_KEY=your_api_key_here
```

The app also works without a key (for public/demo usage), subject to any anonymous rate limits.

### 3. Run the dev server

```bash
npm run dev
```

Open the printed local URL in your browser (usually `http://localhost:5173`).

## Project structure

- `src/App.tsx` — main dashboard logic: filters, data loading, layout.
- `src/api/nbaApi.ts` — typed API client for fetching games.
- `src/components/Layout.tsx` — top-level shell with header/footer.
- `src/components/Filters.tsx` — season/date/team controls.
- `src/components/StatsSummary.tsx` — key metrics tiles.
- `src/components/GameTrendsChart.tsx` — scoring & margin trend chart using Recharts.
- `src/components/GameTable.tsx` — scrollable table of individual games.

## Customizing the analysis

- Tweak summary metrics in `StatsSummary.tsx` (e.g. adjust what counts as a blowout).
- Change the trend chart in `GameTrendsChart.tsx` to visualize different stats.
- Extend `nbaApi.ts` to pull player stats, advanced box scores, or season aggregates for deeper analysis.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
