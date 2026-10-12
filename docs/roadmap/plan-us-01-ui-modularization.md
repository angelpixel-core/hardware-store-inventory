# 📋 Plan & Traceability: US-01 — UI Modularization & Component Decoupling

> **Epic:** Epic 1 — Architectural Refactoring & Test Automation  
> **Story ID:** US-01  
> **Estimation:** 5 Story Points  
> **Branch:** `feat/us-01-ui-modularization` (based on `development`)  
> **Target:** `development`  
> **Status:** In Progress ⏳  

---

## 🎯 Objective & Success Criteria

Deconstruct the monolithic `src/app/App.tsx` (+1,100 lines) into modular, single-responsibility feature packages and atomic UI components, reducing `App.tsx` to **under 90 lines of code** with zero behavioral regressions, passing strict type checks and production builds.

- [ ] Target `App.tsx` contains fewer than 90 lines of code.
- [ ] TypeScript strict compilation (`tsc -b && vite build`) passes with exit code 0.
- [ ] All 5 core visual workflows (Catalog, Search, Product Drawer, Inventory Audit, Stock Intake with Camera) remain 100% operational.

---

## 📦 Phase 1: Utilities & Domain Formatters

Extract all pure helper functions and styling dictionaries out of `App.tsx`.

- [ ] **Task 1.1: Create `src/utils/formatters.ts`**
  - [ ] Implement `formatCurrency(value: number): string` (ARS currency format).
  - [ ] Implement `formatDate(value: string): string` (locale-aware date-time formatter).
  - [ ] Implement `locationLabel(location: ProductLocation): string` (`Store · Aisle · Rack · Shelf`).
  - [ ] Implement `movementDelta(type: StockMovementType, quantity: number): number`.
  - [ ] Export `movementLabels: Record<StockMovementType, string>`.
  - [ ] Export `movementClasses: Record<StockMovementType, string>` (Tailwind badge styles).

---

## 🧩 Phase 2: Atomic UI & Layout Components

Extract reusable UI elements into `src/components/ui/` and layout navigation into `src/components/layout/`.

- [ ] **Task 2.1: Create `src/components/ui/StockBadge.tsx`**
  - [ ] Render visual badge for stock status (`Low stock` vs `In stock`).
  - [ ] Implement color states (amber/red alert vs emerald).
- [ ] **Task 2.2: Create `src/components/ui/SummaryCard.tsx`**
  - [ ] Render KPI metric card with icon container, title, prominent value, and optional meta hint.
- [ ] **Task 2.3: Create `src/components/ui/Field.tsx`**
  - [ ] Form field label wrapper with standard typography and error placement.
- [ ] **Task 2.4: Create `src/components/ui/Info.tsx`**
  - [ ] Key-value inspector row with muted label and bold readable value.
- [ ] **Task 2.5: Create `src/components/ui/Placeholder.tsx`**
  - [ ] Reusable under-construction / coming-soon empty state for inactive sections.
- [ ] **Task 2.6: Create `src/components/layout/Sidebar.tsx`**
  - [ ] Sidebar navigation layout with brand header (*Ferretería Central*).
  - [ ] Active section highlighting (`overview`, `products`, `inventory`, `locations`, `alerts`).
  - [ ] Quick action trigger for "Receive stock".
  - [ ] Footer user profile mock.

---

## 🚀 Phase 3: Domain Feature Modules

Organize domain views under `src/features/`.

- [ ] **Task 3.1: Create `src/features/catalog/ProductsView.tsx`**
  - [ ] Search input with instant filter support and icon.
  - [ ] Products table displaying Category, Name, SKU, Barcode, Price, Stock Badge, and Physical Location.
  - [ ] Row click handler triggering `onSelectProduct(id)`.
  - [ ] Quick "Receive" row action button.
- [ ] **Task 3.2: Create `src/features/product-detail/ProductDrawer.tsx`**
  - [ ] Slide-over drawer with backdrop blur.
  - [ ] Header with product name, brand, SKU, and close button (`X`).
  - [ ] Key metrics section (Stock level, Threshold, Unit Cost, Retail Price, Profit Margin).
  - [ ] Physical location inspector (*Aisle · Rack · Shelf*).
  - [ ] Direct "Receive Stock" action button.
  - [ ] Chronological movement history filtered for the current product.
- [ ] **Task 3.3: Create `src/features/inventory-movements/InventoryView.tsx`**
  - [ ] KPI Summary Cards (*Total units in store*, *Active products*, *Low stock items*).
  - [ ] Movements audit table with movement type badge (`PURCHASE`, `SALE`, `RETURN`, `ADJUSTMENT`).
  - [ ] Quantity delta indicator with color-coded `+` and `−`.
  - [ ] Note, timestamp, and location columns.
- [ ] **Task 3.4: Create `src/features/receive-stock/CameraCapture.tsx`**
  - [ ] WebRTC camera stream initialization (`navigator.mediaDevices.getUserMedia`).
  - [ ] Video feed preview canvas with mirror effect.
  - [ ] Shutter button capturing video frame to image snapshot.
  - [ ] Permission denied / device not found error handling and fallback messages.
  - [ ] Close and retake handlers.
- [ ] **Task 3.5: Create `src/features/receive-stock/ReceiveStockModal.tsx`**
  - [ ] Product selector dropdown pre-filling cost and current location.
  - [ ] Quantity and unit cost numerical inputs.
  - [ ] Physical coordinates override inputs (*Aisle · Rack · Shelf*).
  - [ ] Supplier reference / delivery note input.
  - [ ] Image file upload picker.
  - [ ] Trigger for `CameraCapture` modal with snapshot preview.
  - [ ] Submit validation and instant stock balance increment.

---

## 🏗️ Phase 4: App Root Orchestrator Refactor

- [ ] **Task 4.1: Refactor `src/app/App.tsx`**
  - [ ] Import modular feature views and layout components.
  - [ ] Retain top-level URL query synchronization (`section`, `search`, `product`, `receive`).
  - [ ] Reduce total lines in `App.tsx` to **< 90 lines**.
  - [ ] Remove unused Lucide icon imports and orphaned inline components.

---

## ✅ Phase 5: Verification & Quality Assurance

- [ ] **Task 5.1: Static Analysis & TypeScript Check**
  - [ ] Execute `tsc -b` with zero compilation errors.
  - [ ] Verify no implicit `any` types introduced.
- [ ] **Task 5.2: Production Build Test**
  - [ ] Execute `npm run build` and ensure bundle generation in `dist/`.
  - [ ] Confirm no chunk size anomalies or missing CSS imports.
- [ ] **Task 5.3: End-to-End Workflow Validation**
  - [ ] Verify **Product Catalog** loads and displays products.
  - [ ] Verify **Live Search** filters items dynamically.
  - [ ] Verify **Product Drawer** opens on row click and shows movement logs.
  - [ ] Verify **Inventory Tab** displays metrics and all movements.
  - [ ] Verify **Receive Stock Modal** updates stock balance immediately upon submission.
  - [ ] Verify **Camera Modal** opens and handles stream lifecycle properly.

---

## 🚢 Phase 6: Git Flow & Pull Request

- [ ] Commit all modularized components on `feat/us-01-ui-modularization`.
- [ ] Push branch to remote `origin/feat/us-01-ui-modularization`.
- [ ] Open Pull Request targeting `development`.
- [ ] Review PR diff to ensure clean code isolation.
