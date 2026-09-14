# Hardware Store Inventory

Tauri 2 + React + TypeScript + Tailwind CSS v4 starter for the inventory desktop application.

## Current slice

- Products screen
- Search across product name, brand, category, SKU and barcode
- Product detail
- Stock status
- Physical location
- Mock data loaded from `src/data/products.json`
- Placeholder navigation for Overview, Inventory, Locations and Alerts

The 15 sample products are intentionally stored as JSON and rendered by React components rather than hard-coded in the UI.

## Requirements

- Node.js
- npm
- Rust toolchain
- Tauri desktop prerequisites for your operating system

## Run the web UI

```bash
npm install
npm run dev
```

## Run the Tauri desktop app

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run build
npm run tauri build
```

## Data

Edit `src/data/products.json` to change the mock inventory. The UI consumes it through:

`src/data/index.ts` → `mockProducts` → React components.

## Next slice

The intended next implementation is the inventory movement workflow:

`barcode → product → quantity → cost → location → receive stock → movement history`
