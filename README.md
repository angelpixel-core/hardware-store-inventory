# Hardware Store Inventory — Inventory Movements + Receive Stock

Iteration 2 of the desktop inventory prototype.

## Included

- Inventory section with stock summary cards.
- Recent stock movements table.
- `PURCHASE`, `SALE`, `RETURN`, and `ADJUSTMENT` movement types.
- Receive Stock workflow with product, quantity, unit cost, location and note.
- Stock is updated immediately in local React state when receiving inventory.
- Product detail drawer shows recent movements and a Receive Stock action.
- Optional product image upload.
- Optional desktop camera capture using `navigator.mediaDevices.getUserMedia()`.
- TypeScript fix for section metadata indexing.

## Run

```bash
npm install
npm run dev
```

For Tauri:

```bash
npm run tauri dev
```

The camera requests permission only after clicking **Take photo**. Browser/webview camera support and platform permissions should be tested on the target OS before treating it as production-ready.

## Scope

This iteration intentionally keeps persistence in React state. The next backend step can replace the mock state with Rails API calls and persist `StockMovement` as the source of truth.
