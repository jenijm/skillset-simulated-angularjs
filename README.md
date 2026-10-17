# Simulated AngularJS Assessment: Inventory Manager

## Task brief

Build an AngularJS inventory manager that allows a small business to track products and stock levels.

### Requirements

- Add a product with name, category, quantity, and unit price.
- Validate all fields with AngularJS form validation.
- Edit and save existing products.
- Delete products after confirmation.
- Search products by name or category.
- Filter products by category.
- Display total products, units, inventory value, and low-stock count.
- Highlight out-of-stock and low-stock items.
- Save inventory data between browser sessions.
- Provide responsive desktop and mobile layouts.

## Implementation

The completed application uses AngularJS 1.8 controllers, directives, form state, filters, and browser `localStorage`. Vite provides the local development server and production build.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install dependencies

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Open the URL displayed in the terminal, normally `http://localhost:5173`.

## Create a production build

```bash
npm run build
```

## Preview the production build

```bash
npm run preview
```

## AngularJS notice

AngularJS 1.x is officially end-of-life. It is used here only because the assessment specifically targets AngularJS. New production applications should use a supported framework version.
