# 📋 Plan & Traceability: Phase 2 — Atomic UI & Layout Components

> **Epic:** Epic 1 — Architectural Refactoring & Test Automation  
> **Phase:** Phase 2 (Atomic UI & Layout Extraction)  
> **Branch:** `feat/02-atomic-ui-and-layout` (based on `development`)  
> **Target:** `development`  
> **Status:** Completed ✅  

---

## 🎯 Objective & Success Criteria

Extract reusable atomic UI elements (`StockBadge`, `SummaryCard`, `Field`, `Info`, `Placeholder`) and layout navigation (`Sidebar`) currently declared inline in `src/app/App.tsx` into clean, single-responsibility components under `src/components/ui/` and `src/components/layout/`.

- [ ] Create `src/types/navigation.ts` for unified `Section` navigation types.
- [ ] Extract all 5 atomic UI components into `src/components/ui/`.
- [ ] Extract `Sidebar` layout component into `src/components/layout/`.
- [ ] Refactor `src/app/App.tsx` to consume the extracted components, reducing line count by ~170 lines.
- [ ] `tsc -b && vite build` passes with 0 errors and 0 warnings.
- [ ] Zero visual or functional regressions in UI navigation, badges, cards, or inputs.

---

## 🧩 Tasks & Step-by-Step Checklist

### 1. Navigation Types
- [x] **Task 1.1: Create `src/types/navigation.ts`**
  - [x] Define and export `Section = "overview" | "products" | "inventory" | "locations" | "alerts"`.

---

### 2. Atomic UI Elements (`src/components/ui/`)
- [x] **Task 2.1: Create `src/components/ui/StockBadge.tsx`**
  - [x] Implement `StockBadgeProps`: `{ stock: number; minimum: number; unit: string }`.
  - [x] Render pill badge with low-stock amber warning vs in-stock emerald styling.
- [x] **Task 2.2: Create `src/components/ui/SummaryCard.tsx`**
  - [x] Implement `SummaryCardProps`: `{ label: string; value: string; icon: ReactNode; warning?: boolean }`.
  - [x] Render KPI metric card with container icon and prominent typography.
- [x] **Task 2.3: Create `src/components/ui/Field.tsx`**
  - [x] Implement `FieldProps`: `{ label: string; value: string; onChange: (value: string) => void; type?: string; min?: string }`.
  - [x] Render accessible label and styled input element.
- [x] **Task 2.4: Create `src/components/ui/Info.tsx`**
  - [x] Implement `InfoProps`: `{ label: string; value: string }`.
  - [x] Render uppercase muted label with bold key value.
- [x] **Task 2.5: Create `src/components/ui/Placeholder.tsx`**
  - [x] Implement `PlaceholderProps`: `{ section: Exclude<Section, "products" | "inventory"> }`.
  - [x] Render centered empty state card with `BarChart3` icon and contextual copy.

---

### 3. Layout Components (`src/components/layout/`)
- [x] **Task 3.1: Create `src/components/layout/Sidebar.tsx`**
  - [x] Implement `SidebarProps`: `{ section: Section; onChange: (section: Section) => void }`.
  - [x] Render brand header with icon (*Ferretería Central / Inventory*).
  - [x] Render navigation buttons for all 5 sections with active tab styling.
  - [x] Render footer settings button.

---

### 4. Integration into App.tsx
- [x] **Task 4.1: Update `src/app/App.tsx`**
  - [x] Import `Section` from `../types/navigation`.
  - [x] Import `StockBadge`, `SummaryCard`, `Field`, `Info`, `Placeholder` from `../components/ui/*`.
  - [x] Import `Sidebar` from `../components/layout/Sidebar`.
  - [x] Remove inline function declarations for extracted components.
  - [x] Clean up unused imports from `lucide-react` in `App.tsx`.

---

### 5. Verification & Quality Gates
- [x] **Task 5.1: Static Typecheck**
  - [x] Run `tsc -b` with zero errors.
- [x] **Task 5.2: Production Build**
  - [x] Run `npm run build` and verify bundle generation in `dist/`.
- [x] **Task 5.3: Manual UI Verification**
  - [x] Test sidebar section switching.
  - [x] Test stock badges on products table.
  - [x] Test summary cards on inventory view.
  - [x] Test form fields on receive stock modal.
  - [x] Test placeholder views on overview, locations, alerts.

---

### 6. Git Flow & PR
- [x] Commit all extracted components on `feat/02-atomic-ui-and-layout`.
- [x] Push to `origin/feat/02-atomic-ui-and-layout`.
- [x] Create Pull Request into `development`.
- [x] Merge into `development` without deleting branches.
- [x] Create Pull Request from `development` into `main` and merge without deleting branches.
