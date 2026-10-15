# 📐 Plan 04: Architectural Audit & Directory Structure Modernization

> **Document Classification:** Engineering Execution Roadmap  
> **System:** Hardware Store Inventory — Native Desktop Application (Tauri v2 + React 19)  
> **Feature Naming Decision:** Renamed `receive-stock` -> `stock-intake` (Domain Process Pattern)  
> **Structural Granularity Decision:** Full sub-structuring (`components/`, `hooks/`, `types/`) across all domain features.  
> **Status:** In Progress (Phase 1 Underway)

---

## 🎯 Architectural Objectives

1. **Clean Feature Separation**: Migrate all features to vertical slices with internal `components/`, `hooks/`, and typed barrel exports.
2. **Logic Decoupling**: Extract imperative hardware/browser logic (`getUserMedia`, `FileReader`) and domain state orchestration out of visual components into dedicated hooks.
3. **Domain Vocabulary**: Standardize feature naming to domain-driven terms (`catalog`, `inventory`, `product-detail`, `stock-intake`).
4. **Rust Core Scaffolding**: Organize `src-tauri` with modular commands and data models ready for SQLite persistence.
5. **Zero-Regression Guarantee**: Ensure `tsc -b` and `npm run build` pass cleanly at every incremental step.

---

## 📋 Comprehensive Execution Checklist

### 🚀 Phase 1: Core Domain Hooks & Media Hardware Decoupling
- [x] **Task 1.1: WebRTC Camera Stream Hook Extraction**
  - [x] Create `src/components/media/CameraCapture/useCameraStream.ts` encapsulating stream initialization, permissions, constraints, canvas snapshotting, and track teardown.
  - [x] Create `src/components/media/CameraCapture/CameraCapture.tsx` as a clean presentation modal consuming `useCameraStream`.
  - [x] Create `src/components/media/CameraCapture/index.ts` and `src/components/media/index.ts` barrel exports.
- [x] **Task 1.2: Domain State Hook Extraction (`useInventoryState`)**
  - [x] Create `src/hooks/useInventoryState.ts` isolating `products`, `movements`, stock intake mutations (`receiveStock`), filtered products, and notification feedback.
  - [x] Create `src/hooks/index.ts` barrel export.
- [x] **Task 1.3: Decouple `App.tsx` Orchestrator**
  - [x] Refactor `src/app/App.tsx` to consume `useInventoryState`, reducing it to a pure layout, navigation, and modal orchestrator.
- [x] **Task 1.4: Phase 1 Build Verification**
  - [x] Run `npx tsc --noEmit` and `npm run build` to confirm zero regressions.

---

### 📦 Phase 2: Domain Feature Sub-structuring & Renaming (`stock-intake`)
- [x] **Task 2.1: Migrate `receive-stock` -> `stock-intake`**
  - [x] Create `src/features/stock-intake/types.ts` for form definitions (`ReceiveStockFormData`).
  - [x] Create `src/features/stock-intake/hooks/useStockIntakeForm.ts` for intake form state, validation, and photo handling.
  - [x] Create `src/features/stock-intake/components/PlacementFields.tsx` for warehouse coordinate inputs.
  - [x] Create `src/features/stock-intake/components/PhotoAttachment.tsx` for photo preview & upload triggers.
  - [x] Refactor `src/features/stock-intake/ReceiveStockModal.tsx` into a clean orchestrator using the sub-components and hook.
  - [x] Update `src/features/stock-intake/index.ts` and remove old `receive-stock` directory.
- [x] **Task 2.2: Sub-structure `catalog` Feature**
  - [x] Create `src/features/catalog/components/ProductTable.tsx`.
  - [x] Create `src/features/catalog/components/CatalogSearchBar.tsx`.
  - [x] Refactor `src/features/catalog/ProductsView.tsx` and update `src/features/catalog/index.ts`.
- [x] **Task 2.3: Sub-structure `inventory` Feature**
  - [x] Rename / standardize directory to `src/features/inventory/` (or preserve `inventory-movements` alias with internal `components/`).
  - [x] Create `src/features/inventory/components/MovementLedger.tsx`.
  - [x] Create `src/features/inventory/components/MetricsCards.tsx`.
  - [x] Refactor `src/features/inventory/InventoryView.tsx` and update `index.ts`.
- [x] **Task 2.4: Sub-structure `product-detail` Feature**
  - [x] Create `src/features/product-detail/components/ProductInfoGrid.tsx`.
  - [x] Create `src/features/product-detail/components/MovementTimeline.tsx`.
  - [x] Refactor `src/features/product-detail/ProductDrawer.tsx` and update `index.ts`.
- [x] **Task 2.5: Phase 2 Build Verification**
  - [x] Run `npx tsc --noEmit` and `npm run build`.

---

### 🧱 Phase 3: UI Primitives & Design System Organization
- [x] **Task 3.1: Reorganize `src/components/ui/`**
  - [x] Categorize primitives: `src/components/ui/primitives/` (`Field`, buttons, dialog shells) vs. `src/components/ui/display/` (`StockBadge`, `SummaryCard`, `Info`, `Placeholder`).
  - [x] Update barrel exports in `src/components/ui/index.ts` with backward-compatible named exports.
- [x] **Task 3.2: Phase 3 Build Verification**
  - [x] Run `npx tsc --noEmit` and `npm run build`.

---

### 🦀 Phase 4: Tauri / Rust Layer Scaffolding
- [x] **Task 4.1: Rust Module Architecture**
  - [x] Create `src-tauri/src/commands/mod.rs` and `src-tauri/src/commands/inventory.rs`.
  - [x] Create `src-tauri/src/models/mod.rs` and `src-tauri/src/models/product.rs`.
  - [x] Create `src-tauri/src/error.rs` for unified error handling.
  - [x] Register modular commands in `src-tauri/src/lib.rs`.
- [x] **Task 4.2: Rust Build Verification**
  - [x] Run `cargo check` in `src-tauri/` to verify zero Rust compilation errors.

---

### 📝 Phase 5: Documentation & Traceability Updates
- [x] **Task 5.1: Update `README.md`** with the new directory tree and architectural pattern description.
- [x] **Task 5.2: Update `docs/ARCHITECTURE_AND_DELIVERY_PLAN.md`** with completed tasks and Sprint 1 progress.
