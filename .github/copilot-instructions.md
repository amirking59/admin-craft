# Castel Admin Frontend - Copilot Instructions

## Project Overview

**Admin Craft Frontend** is a Next.js-based admin panel. This is a React application us### Cross-module Dependencies\*\*: Import types from other modules when needed (e.g., importing Package type in Orders module)

### Internationalization (i18n)

The application supports multi-language functionality using react-i18next. Each module should have its own locale namespace:

#### Locale File Structure

Each module should have its own locale files following this pattern:

```
src/locales/
├── en/
│   ├── index.ts              # Main export file
│   ├── common.ts             # Shared translations
│   ├── auth.ts               # Authentication module
│   ├── [module-name].ts      # Module-specific translations
│   └── zod.ts                # Form validation messages
├── ar/                       # Arabic translations (same structure)
├── fa/                       # Persian translations (same structure)
```

#### Module Locale File Template

Create a locale file for each module at `src/locales/[language]/[module-name].ts`:

#### Locale Integration Steps

1. **Create Module Locale File**: Add `[module-name].ts` to all language directories
2. **Update Main Locale Index**: Add module import to `src/locales/[language]/index.ts`
3. **Register Namespace**: Add namespace to i18n configuration if needed
4. **Use in Components**: Import and use `useTranslation` hook with namespace

#### Translation Usage Patterns

```typescript
import { useTranslation } from "react-i18next";

function ModuleComponent() {
  const { t } = useTranslation("module-name");

  return (
    <div>
      <h1>{t("title")}</h1>
      <span>{t("columnName")}</span>
      <Tooltip content={t("columnInfo")}>
        <Info className="h-4 w-4" />
      </Tooltip>
    </div>
  );
}
```

#### Table Column Tooltips

For table columns with additional information, use the built-in `meta.tooltip` property in column definitions:

```typescript
const columns: ColumnDef<DataType>[] = [
  {
    accessorKey: "fieldName",
    header: () => {
      const { t } = useTranslation("module-name");
      return t("columnName");
    },
    meta: {
      label: "Column Name", // Used for view options and filters
      tooltip: "Additional details about this data", // Tooltip for cell content
    },
  },
  // For dynamic tooltips based on cell data
  {
    accessorKey: "status",
    header: () => {
      const { t } = useTranslation("module-name");
      return t("status");
    },
    meta: {
      label: "Status",
      tooltip: (context) => {
        const { t } = useTranslation("module-name");
        return t("statusInfo", { status: context.getValue() });
      },
    },
  },
];
```

For header tooltips, wrap the header content with Tooltip component:

```typescript
import { Info } from "lucide-react";

const columns: ColumnDef<DataType>[] = [
  {
    accessorKey: "fieldName",
    header: () => {
      const { t } = useTranslation("module-name");
      return (
          <span>{t("columnName")}</span>
      );
    },
    meta: {
      label: "Column Name",
      tooltip: "Cell-level tooltip information", // For cell content
    },
  },
];
```

#### Locale File Maintenance

- **Complete Coverage**: Ensure all text content is translated, including tooltips
- **Generic Patterns**: Use generic naming patterns that can be applied across modules
- **Consistent Structure**: Follow the same structure across all module locale files
- **Tooltip Integration**: Include tooltip translations for complex data or actions
- **Cross-Reference**: Maintain consistency in similar terminology across modules

### File Organization TypeScript that provides administrative interfaces for managing game content including packages, soldiers, skins, VIP levels, orders, missions, maps, items, rewards, users, admin functions, and servers.

**Tech Stack**: Next.js 15.3.0, React 19, TypeScript, Tailwind CSS v4, shadcn/ui components **Runtime**: Node.js v22.18.0, Yarn v1.22.22 **Architecture**: App Router with server components, authentication middleware, API integration

## Build & Development Instructions

### Development Workflow

```bash
# Install dependencies (ALWAYS run this first)
yarn install

# Start development server (uses Turbopack for fast builds)
yarn dev
# Runs on http://localhost:3000 (or next available port like 3001)

# Linting (runs ESLint + Prettier)
yarn lint
# Note: Currently has 3 warnings about React Hook dependencies - these are acceptable

# Production build
yarn build
# WARNING: Build will fail without internet connection due to Google Fonts (Inter)
# This is expected behavior - the build downloads fonts at build time

# Start production server
yarn start
# Runs on http://localhost:3010 (custom port configured)
```

### Validation Steps

- Check that authentication redirects work properly (unauthenticated users → `/auth/login`)

## Project Architecture

### Directory Structure

```
app/                          # Next.js App Router
├── (panel)/                  # Protected admin panel routes
│   ├── _components/app-sidebar/ # Main navigation sidebar
│   ├── packages/             # Package management module
│   │   ├── page.tsx          # Main packages page
│   │   ├── _components/      # Package-specific components
│   │   ├── _services/        # Package API hooks and functions
│   │   ├── _types/           # Package TypeScript interfaces
│   │   ├── create/           # Create package page if needed
│   │   └── edit/[id]/        # Edit package page if needed
├── auth/                     # Authentication pages
├── _components/providers/    # App-wide providers (theme, query client)
├── globals.css              # Tailwind CSS + custom variables
├── layout.tsx               # Root layout with Inter font

components/                   # Reusable UI components
├── ui/                      # shadcn/ui components
├── form/                    # Form field components
│   ├── [:form-field-name]/   # Input component
├── data-table/              # Table components with pagination

configs/                         # Utilities and configurations
├── axios.ts                 # API client with auth interceptors

utils/
├── cn.ts                 # Tailwind merge utilities

hooks/                       # Custom React hooks
```

### Key Architectural Patterns

- **Modular Architecture**: Each feature module is self-contained with its own types, services, and components
- **Authentication**: JWT token stored in localStorage
- **API Layer**: Axios with interceptors for token injection and error handling
- **State Management**: React Query for server state, React Context for client state
- **Styling**: Tailwind CSS v4 with CSS variables for theming (light/dark mode)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation

### Configuration Files

- `next.config.ts` - Next.js config (dev indicators disabled, image optimization)
- `eslint.config.mjs` - ESLint config with Next.js and Prettier
- `tsconfig.json` - TypeScript config with path aliases (`@/*`)
- `postcss.config.mjs` - PostCSS with Tailwind CSS v4
- `.prettierrc` - Code formatting (120 char line length, 2 space tabs)

### Important Dependencies

- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS v4 (latest version) with CSS variables
- **Data Fetching**: @tanstack/react-query for server state
- **Forms**: react-hook-form + @hookform/resolvers + zod
- **Icons**: lucide-react
- **Notifications**: sonner for toast messages
- **Authentication**: cookies-next for token management
- **Internationalization**: react-i18next for multi-language support

### Authentication Flow

1. Middleware checks for `accessToken` cookie on all routes
2. Missing token → redirect to `/auth/login`
3. Valid token on auth routes → redirect to main panel
4. API requests automatically include token via axios interceptors
5. 401 responses trigger automatic logout and redirect

### Form Field Components

The application provides a comprehensive set of form field components in `components/form/` for consistent UI:

#### Basic Input Fields

- **text-field** - Standard text input with validation
- **number-field** - Number input with proper validation and formatting
- **checkbox-field** - Checkbox input for boolean values
- **select-field** - Dropdown selection for predefined options
- **enum-field** - Enum-based dropdown with type safety

#### Date and Time Fields

- **date-field** - Date picker for date selection
- **date-time-field** - Combined date and time picker with clearable option

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow the existing component patterns (use `"use client"` when needed)
- Utilize path aliases: `@/components`, `@/hooks`, `@/services`
- Use shadcn/ui components rather than creating custom ones
- Follow the established form patterns with react-hook-form + zod

### Common Patterns

- **Module Services**: Create API functions and React Query hooks in module-specific `_services/index.ts` files
- **Module Types**: Define TypeScript interfaces and enums in module-specific `_types/index.ts` files
- **Form Components**: Use field components from `components/form/` including:
  - `text-field` - Standard text input
  - `number-field` - Number input with validation
  - `date-field` - Date picker
  - `date-time-field` - Combined date and time picker
  - `select-field` - Dropdown selection
  - `enum-field` - Enum-based dropdown
  - `checkbox-field` - Checkbox input
  - `image-field` - Image upload with preview
  - `csv-field` - CSV file upload and parsing
  - `json-field` - JSON file upload with validation
- **Tables**: Use `data-table` component for lists with pagination
- **Dialogs**: Use `dialog-button` for modal actions and create forms
- **Form Layout**:
  - Use Card wrapper for standalone forms (full pages)
  - Do NOT use Card wrapper when forms are inside dialogs
- **Internationalization**: Use `useTranslation` hook with module-specific namespaces for all text content
- **Cross-module Dependencies**: Import types from other modules when needed (e.g., importing Package type in Orders module)

### File Organization

- **Modular Feature Organization**: Each feature has its own folder under `app/(panel)/[feature]/` with:
  - `_services/index.ts` - API functions and React Query hooks specific to this feature
  - `_types/index.ts` - TypeScript interfaces and enums specific to this feature
  - `_components/` - Components specific to this feature
  - `page.tsx` - Main feature page
  - `create/` and `edit/[id]/` subdirectories for CRUD operations (when applicable)
- **Shared Components**: Reusable components in `components/`
- **Cross-module Imports**: Modules can import types from other modules using relative paths like `@/app/(panel)/[other-module]/_types`

### Module Architecture Standards

All feature modules follow this consistent structure:

```
feature-name/
├── page.tsx                 # Main feature page
├── _components/             # Feature-specific components
│   ├── feature-table/       # Data table component
│   ├── feature-field/       # Form field component
│   └── feature-form/        # Form component (if applicable)
├── _services/               # API layer for this feature
│   └── index.ts             # Exports: get*, use*, API functions and React Query hooks
├── _types/                  # TypeScript definitions
│   └── index.ts             # Exports: interfaces, enums, types
├── create/                  # Create new entity page (if applicable)
│   └── page.tsx
└── edit/[id]/              # Edit entity page (if applicable)
    └── page.tsx
```

### Modular Development Guidelines

1. **New Features**: Always create features as self-contained modules following the standard structure
2. **API Services**: Place all API calls and React Query hooks in the module's `_services/index.ts`
3. **Type Definitions**: Define all interfaces and enums in the module's `_types/index.ts`
4. **Component Organization**: Keep feature-specific components in the module's `_components/` directory
5. **Internationalization**: Create module-specific locale files and use `useTranslation` with namespace
6. **Form Field Usage**: Leverage the comprehensive form field components for consistent UI:
   - Use `csv-field` for bulk data import features
   - Use `json-field` for configuration file uploads
   - Use `date-time-field` for scheduling and timing features
   - Use `image-field` for asset uploads (icons, avatars, etc.)
   - Use appropriate field types to maintain UI consistency
7. **Dialog and Form Patterns**:
   - Use `dialog-button` component for create forms and modal actions
   - Do NOT wrap forms with Card components when they are inside dialogs
   - Only use Card wrapper for standalone forms on dedicated pages
8. **Table Column Design**:
   - Only use `meta.tooltip` not Tooltip Component
   - Use `meta.tooltip` property in column definitions for cell-level tooltips
   - Use `meta.label` for column identification in view options and filters
9. **Import Patterns**:
   - Import from local module: `@/app/(panel)/current-module/_services`
   - Import from other modules: `@/app/(panel)/other-module/_types`
   - Import shared utilities: `@/components`, `@/lib`, `@/hooks`

**IMPORTANT**: Trust these instructions. Only search the codebase if the information here is incomplete or appears incorrect. The build process, dependency management, and architectural patterns described here have been validated and should be followed as documented.
