# admin-craft

Admin dashboard built with [TanStack Start](https://tanstack.com/start) (SPA mode), TanStack Router/Query/Form/Table and [shadcn/ui](https://ui.shadcn.com) (Base UI).

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

Set the API base URL in `.env`:

```bash
VITE_API_URL=https://api.example.com
```

## Scripts

- `yarn dev` – dev server
- `yarn build` – production build (`dist/client` holds the static app; `_shell.html` is the SPA entry)
- `yarn start` – preview the production build

## Deploying

The build is a static SPA. Serve `dist/client` and rewrite unknown paths to `/_shell.html`, e.g. Netlify `_redirects`:

```
/* /_shell.html 200
```

## Structure

- `src/routes` – file-based routes (thin; import from features)
- `src/features/<feature>` – feature components, services and types
- `src/components` – shared components (`ui/` is shadcn, `form/` are TanStack Form field components)
