# admin-craft

Admin dashboard built with [TanStack Start](https://tanstack.com/start) (SPA mode), TanStack Router/Query/Form/Table and [shadcn/ui](https://ui.shadcn.com) (Base UI). Texts use [Paraglide JS](https://paraglidejs.com), in English, Arabic and Persian.

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

Set the API base URL in `.env` (copy `.env.example`). It points at [DummyJSON](https://dummyjson.com/docs), a public test API:

```bash
VITE_API_URL=https://dummyjson.com
```

With DummyJSON, log in as `emilys` / `emilyspass` (any of its [users](https://dummyjson.com/users) works). Login, the
profile, products and orders (its carts, with their customers from its users) all come from it. It answers adds, edits and
deletes as if it saved them, but keeps nothing.

## Scripts

- `yarn dev` – dev server
- `yarn build` – production build (`dist/client` holds the static app; `_shell.html` is the SPA entry)
- `yarn start` – preview the production build
- `yarn typecheck`, `yarn lint` (oxlint), `yarn format` / `yarn format:check` (oxfmt)

## Deploying

The build is a static SPA. Serve `dist/client` and rewrite unknown paths to `/_shell.html`, e.g. Netlify `_redirects`:

```
/* /_shell.html 200
```

## Structure

- `src/routes` – file-based routes (thin; import from features)
- `src/features/<feature>` – feature components, services and types
- `src/components` – shared components (`ui/` is shadcn, `form/` are TanStack Form field components)
- `messages/{en,ar,fa}.json` and `project.inlang/` – the texts, compiled into `src/paraglide` (generated, not committed)

## Languages

- Use a text with `m.some_key()` from `@/paraglide/messages.js`. Keys are snake_case; feature texts start with the feature's name (`orders_title`).
- English is the default. The language picked in the user menu is stored in `localStorage`, and switching reloads the page: Paraglide's messages aren't reactive, so a reload is what updates every text and the page direction together.
- Arabic and Persian are right-to-left. `<html dir>` and the sidebar's side follow `getTextDirection()`, and styles use logical classes (`ms-*`, `pe-*`, `start-*`), never `ml-*`/`right-*`.
- Zod's validation messages follow the language too (`z.config` in `src/routes/__root.tsx`).
- To add a language, add its code to `project.inlang/settings.json`, add `messages/<code>.json`, and give it a label in `src/components/app-sidebar/nav-user/locale-select.tsx`.

## Data tables

`DataTable` keeps the page, sort and filters in the URL, so a filtered, sorted page can be shared as a link. Its route validates them:

```ts
export const Route = createFileRoute("/_main/orders")({
  validateSearch: dataTableSearchSchema,
  component: OrderTable,
});
```

Columns must be stable (module scope or `useMemo`), since cells render as components.

### Filters

Pass `filters` and the table shows a filter bar above the rows:

- **Pinned filters** (`pinned: true`) sit inline and apply as you type, e.g. a search box.
- **The rest** are added from «+ Filter», a searchable list, so a table with many filters stays easy to use. Each set filter shows as a chip, e.g. «Status: Pending, Shipped». Clicking a chip edits that filter alone in a popover, and its × removes it.
- **Changes apply at once**, as in Linear: there's no Apply button. Picking an option applies right away; typing applies after a short pause.

Every filter has a `name` (its URL key), a `label` (a message function) and a `type`; the bar draws the editor for the type:

| `type`                   | Extra field | Editor                                                                                                                                                                      |
| ------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `select` / `multiselect` | `options`   | A list with a search line: a check mark for one pick, checkboxes for several. In «+ Filter» the values open in a submenu.                                                   |
| `date`                   |             | A calendar. «+ Filter» offers «1 day ago» … «1 year ago», and «Custom…» opens a dialog to pick a day.                                                                      |
| `text`                   |             | A text box, e.g. «Product contains: pro». Pinned, it's the table's search box, with the label as its placeholder.                                                         |
| `number`                 |             | A range: a «from» and a «to» box, either of which may be empty. The value is `"min..max"` (`"100.."`, `"..500"`); `parseRange` splits it for the API.                     |
| `custom`                 | `input`     | Your own field, reading its name and value from the form's field context.                                                                                                   |

Any filter can also be `pinned`, set `formatValue` (how the chip reads the value; for a `number`, each end) and `onValueChange`.

```tsx
const filters: FilterDef[] = [
  { name: "q", label: m.orders_search, type: "text", pinned: true },
  {
    name: "status",
    label: m.orders_status,
    type: "multiselect", // the chip reads the picked labels, e.g. «Status: Pending, Shipped»
    options: () => Object.values(OrderStatus).map((status) => ({ value: status, label: statusLabel[status]() })),
  },
  { name: "created_at_from", label: m.orders_created_from, type: "date" },
  {
    name: "total",
    label: m.orders_total,
    type: "number", // «Total: $100 – $500», «from $100», «to $500»
    formatValue: (value) => `$${formatNumber(Number(value))}`,
  },
  { name: "product", label: m.orders_product_contains, type: "text" },
];
```

Filter values reach the API as strings (or string arrays), the same as from a pasted URL.

## API calls

`api()` in `src/configs/api.ts` adds the base URL, the Bearer token and a 30s timeout. On an error it:

- shows a toast with the body's `error`, unless the call passes `silent: true`
- logs out on a 401: the token and the query cache are cleared and the app goes to `/auth`, without a reload
- reads per-field messages from `{ "errors": { "name": "…" } }`. In a form's `onSubmit`, `applyApiFieldErrors(formApi, error)` shows them under the fields (see the product form).
