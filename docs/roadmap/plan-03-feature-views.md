# 📋 Plan & Traceability: Phase 3 — Feature View Modules & App Orchestration

> **Epic:** Epic 1 — Architectural Refactoring & Test Automation  
> **Phase:** Phase 3 (Feature Modules Extraction & App.tsx Refactor)  
> **Branch:** `feat/03-feature-views` (based on `development`)  
> **Target:** `development`  
> **Status:** Completed ✅  

---

## 🎯 Objective & Success Criteria

Extract all remaining domain feature views from `src/app/App.tsx` into modular packages under `src/features/*`:
- `src/features/catalog/ProductsView.tsx`
- `src/features/inventory-movements/InventoryView.tsx`
- `src/features/product-detail/ProductDrawer.tsx`
- `src/features/receive-stock/CameraCapture.tsx`
- `src/features/receive-stock/ReceiveStockModal.tsx`
And reduce `src/app/App.tsx` to **under 90 lines of code**, achieving full completion of US-01.

- [x] Extract `ProductsView` into `src/features/catalog/ProductsView.tsx`.
- [x] Extract `InventoryView` into `src/features/inventory-movements/InventoryView.tsx`.
- [x] Extract `ProductDrawer` into `src/features/product-detail/ProductDrawer.tsx`.
- [x] Extract `CameraCapture` into `src/features/receive-stock/CameraCapture.tsx`.
- [x] Extract `ReceiveStockModal` into `src/features/receive-stock/ReceiveStockModal.tsx`.
- [x] Refactor `src/app/App.tsx` to < 90 lines of code.
- [x] `tsc -b && vite build` passes cleanly with exit code 0.
- [x] Verify full UI functionality and all visual workflows.

---

## 🧩 Tasks & Step-by-Step Checklist

### 1. Catalog Feature (`src/features/catalog/`)
- [x] **Task 1.1: Create `src/features/catalog/ProductsView.tsx`**
  - [x] Implement `ProductsViewProps`: `{ products, search, onSearch, onSelectProduct, onReceive }`.
  - [x] Render search filter bar with instant query callback.
  - [x] Render products table with Category, SKU, Barcode, Price, `StockBadge`, and physical location coordinates.
  - [x] Row click triggers `onSelectProduct(product.id)`.
  - [x] Inline "Receive" action triggers `onReceive(product.id)`.
- [x] **Task 1.2: Create `src/features/catalog/index.ts`**
  - [x] Barrel export for `ProductsView`.

---

### 2. Product Detail Drawer Feature (`src/features/product-detail/`)
- [x] **Task 2.1: Create `src/features/product-detail/ProductDrawer.tsx`**
  - [x] Implement `ProductDrawerProps`: `{ product, movements, onClose, onReceive }`.
  - [x] Render slide-over drawer with backdrop blur.
  - [x] Render header, SKU, barcode, unit cost, retail price, and profit margin using `Info`.
  - [x] Render stock level and threshold status using `StockBadge`.
  - [x] Render direct "Receive stock" button.
  - [x] Render chronological movements table filtered for this product.
- [x] **Task 2.2: Create `src/features/product-detail/index.ts`**
  - [x] Barrel export for `ProductDrawer`.

---

### 3. Inventory Audit Movements Feature (`src/features/inventory-movements/`)
- [x] **Task 3.1: Create `src/features/inventory-movements/InventoryView.tsx`**
  - [x] Implement `InventoryViewProps`: `{ products, movements, onReceive }`.
  - [x] Compute summary statistics (Total units in store, Active products, Low-stock alerts requiring reorder).
  - [x] Render 3 KPI cards using `SummaryCard`.
  - [x] Render movements table with movement type badges (`PURCHASE`, `SALE`, `RETURN`, `ADJUSTMENT`) and quantity deltas (`+` / `−`).
- [x] **Task 3.2: Create `src/features/inventory-movements/index.ts`**
  - [x] Barrel export for `InventoryView`.

---

### 4. Receive Stock & Camera Intake Feature (`src/features/receive-stock/`)
- [x] **Task 4.1: Create `src/features/receive-stock/CameraCapture.tsx`**
  - [x] WebRTC stream initialization with `navigator.mediaDevices.getUserMedia`.
  - [x] Video preview canvas with mirror transform.
  - [x] Shutter button capturing frame to image data URL.
  - [x] Error handling and fallback messages.
- [x] **Task 4.2: Create `src/features/receive-stock/ReceiveStockModal.tsx`**
  - [x] Export `ReceiveForm` interface.
  - [x] Implement product dropdown, quantity, unit cost, coordinates (`Store · Aisle · Rack · Shelf`), and note inputs using `Field`.
  - [x] Photo file upload and `CameraCapture` modal trigger.
  - [x] Form submit handler validating inputs and updating product stock and movement log.
- [x] **Task 4.3: Create `src/features/receive-stock/index.ts`**
  - [x] Barrel export for `ReceiveStockModal` and `CameraCapture`.

---

### 5. App.tsx Root Layout Refactor
- [x] **Task 5.1: Refactor `src/app/App.tsx`**
  - [x] Import `Sidebar`, `Placeholder`, `ProductsView`, `InventoryView`, `ProductDrawer`, and `ReceiveStockModal`.
  - [x] Retain top-level URL state synchronization (`searchParams`).
  - [x] Keep root layout under **90 lines of code**.

---

### 6. Quality Gates & Verification
- [x] **Task 6.1: Run `tsc -b && vite build`**
- [x] **Task 6.2: Verify all 5 core UI workflows**
