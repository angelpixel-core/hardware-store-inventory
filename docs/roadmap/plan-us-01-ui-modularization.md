# 📋 Plan & Traceability: US-01 — UI Modularization & Component Decoupling

> **Epic:** Epic 1 — Architectural Refactoring & Test Automation  
> **Story ID:** US-01  
> **Estimation:** 5 Story Points  
> **Branch:** `feat/us-01-ui-modularization` (based on `development`)  
> **Target:** `development`  
> **Status:** Completed ✅  

---

## 🎯 Objective & Success Criteria

Deconstruct the monolithic `src/app/App.tsx` (+1,100 lines) into modular, single-responsibility feature packages and atomic UI components, reducing `App.tsx` to **under 90 lines of code** with zero behavioral regressions, passing strict type checks and production builds.

- [x] Target `App.tsx` contains fewer than 90 lines of code.
- [x] TypeScript strict compilation (`tsc -b && vite build`) passes with exit code 0.
- [x] All 5 core visual workflows (Catalog, Search, Product Drawer, Inventory Audit, Stock Intake with Camera) remain 100% operational.

---

## 📦 Phase 1: Utilities & Domain Formatters

Extract all pure helper functions and styling dictionaries out of `App.tsx`.

- [x] **Task 1.1: Create `src/utils/formatters.ts`**
  - [x] Implement `formatCurrency(value: number): string` (ARS currency format).
  - [x] Implement `formatDate(value: string): string` (locale-aware date-time formatter).
  - [x] Implement `locationLabel(location: ProductLocation): string` (`Store · Aisle · Rack · Shelf`).
  - [x] Implement `movementDelta(type: StockMovementType, quantity: number): number`.
  - [x] Export `movementLabels: Record<StockMovementType, string>`.
  - [x] Export `movementClasses: Record<StockMovementType, string>` (Tailwind badge styles).

---

## 🧩 Phase 2: Atomic UI & Layout Components

Extract reusable UI elements into `src/components/ui/` and layout navigation into `src/components/layout/`.

- [x] **Task 2.1: Create `src/components/ui/StockBadge.tsx`**
  - [x] Render visual badge for stock status (`Low stock` vs `In stock`).
  - [x] Implement color states (amber/red alert vs emerald).
- [x] **Task 2.2: Create `src/components/ui/SummaryCard.tsx`**
  - [x] Render KPI metric card with icon container, title, prominent value, and optional meta hint.
- [x] **Task 2.3: Create `src/components/ui/Field.tsx`**
  - [x] Form field label wrapper with standard typography and error placement.
- [x] **Task 2.4: Create `src/components/ui/Info.tsx`**
  - [x] Key-value inspector row with muted label and bold readable value.
- [x] **Task 2.5: Create `src/components/ui/Placeholder.tsx`**
  - [x] Reusable under-construction / coming-soon empty state for inactive sections.
- [x] **Task 2.6: Create `src/components/layout/Sidebar.tsx`**
  - [x] Sidebar navigation layout with brand header (*Ferretería Central*).
  - [x] Active section highlighting (`overview`, `products`, `inventory`, `locations`, `alerts`).
  - [x] Quick action trigger for "Receive stock".
  - [x] Footer user profile mock.

---

## 🚀 Phase 3: Domain Feature Modules

Organize domain views under `src/features/`.

- [x] **Task 3.1: Create `src/features/catalog/ProductsView.tsx`**
  - [x] Search input with instant filter support and icon.
  - [x] Products table displaying Category, Name, SKU, Barcode, Price, Stock Badge, and Physical Location.
  - [x] Row click handler triggering `onSelectProduct(id)`.
  - [x] Quick "Receive" row action button.
- [x] **Task 3.2: Create `src/features/product-detail/ProductDrawer.tsx`**
  - [x] Slide-over drawer with backdrop blur.
  - [x] Header with product name, brand, SKU, and close button (`X`).
  - [x] Key metrics section (Stock level, Threshold, Unit Cost, Retail Price, Profit Margin).
  - [x] Physical location inspector (*Aisle · Rack · Shelf*).
  - [x] Direct "Receive Stock" action button.
  - [x] Chronological movement history filtered for the current product.
- [x] **Task 3.3: Create `src/features/inventory-movements/InventoryView.tsx`**
  - [x] KPI Summary Cards (*Total units in store*, *Active products*, *Low stock items*).
  - [x] Movements audit table with movement type badge (`PURCHASE`, `SALE`, `RETURN`, `ADJUSTMENT`).
  - [x] Quantity delta indicator with color-coded `+` and `−`.
  - [x] Note, timestamp, and location columns.
- [x] **Task 3.4: Create `src/features/receive-stock/CameraCapture.tsx`**
  - [x] WebRTC camera stream initialization (`navigator.mediaDevices.getUserMedia`).
  - [x] Video feed preview canvas with mirror effect.
  - [x] Shutter button capturing video frame to image snapshot.
  - [x] Permission denied / device not found error handling and fallback messages.
  - [x] Close and retake handlers.
- [x] **Task 3.5: Create `src/features/receive-stock/ReceiveStockModal.tsx`**
  - [x] Product selector dropdown pre-filling cost and current location.
  - [x] Quantity and unit cost numerical inputs.
  - [x] Physical coordinates override inputs (*Aisle · Rack · Shelf*).
  - [x] Supplier reference / delivery note input.
  - [x] Image file upload picker.
  - [x] Trigger for `CameraCapture` modal with snapshot preview.
  - [x] Submit validation and instant stock balance increment.

---

## 🏗️ Phase 4: App Root Orchestrator Refactor

- [x] **Task 4.1: Refactor `src/app/App.tsx`**
  - [x] Import modular feature views and layout components.
  - [x] Retain top-level URL query synchronization (`section`, `search`, `product`, `receive`).
  - [x] Reduce total lines in `App.tsx` to **< 90 lines**.
  - [x] Remove unused Lucide icon imports and orphaned inline components.

---

## ✅ Phase 5: Verification & Quality Assurance

- [x] **Task 5.1: Static Analysis & TypeScript Check**
  - [x] Execute `tsc -b` with zero compilation errors.
  - [x] Verify no implicit `any` types introduced.
- [x] **Task 5.2: Production Build Test**
  - [x] Execute `npm run build` and ensure bundle generation in `dist/`.
  - [x] Confirm no chunk size anomalies or missing CSS imports.
- [x] **Task 5.3: End-to-End Workflow Validation**
  - [x] Verify **Product Catalog** loads and displays products.
  - [x] Verify **Live Search** filters items dynamically.
  - [x] Verify **Product Drawer** opens on row click and shows movement logs.
  - [x] Verify **Inventory Tab** displays metrics and all movements.
  - [x] Verify **Receive Stock Modal** updates stock balance immediately upon submission.
  - [x] Verify **Camera Modal** opens and handles stream lifecycle properly.

---

## 🚢 Phase 6: Git Flow & Pull Request

- [x] Commit all modularized components on `feat/us-01-ui-modularization`.
- [x] Push branch to remote `origin/feat/us-01-ui-modularization`.
- [x] Open Pull Request targeting `development`.
- [x] Review PR diff to ensure clean code isolation.
