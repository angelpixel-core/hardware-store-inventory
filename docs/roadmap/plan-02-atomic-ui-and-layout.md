# 📋 Plan & Traceability: Phase 2 — Atomic UI & Layout Components

> **Epic:** Epic 1 — Architectural Refactoring & Test Automation  
> **Phase:** Phase 2 (Atomic UI & Layout Extraction)  
> **Branch:** `feat/02-atomic-ui-and-layout` (based on `development`)  
> **Target:** `development`  
> **Status:** Ready to Implement ⏳  

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
- [ ] **Task 1.1: Create `src/types/navigation.ts`**
  - [ ] Define and export `Section = "overview" | "products" | "inventory" | "locations" | "alerts"`.

---

### 2. Atomic UI Elements (`src/components/ui/`)
- [ ] **Task 2.1: Create `src/components/ui/StockBadge.tsx`**
  - [ ] Implement `StockBadgeProps`: `{ stock: number; minimum: number; unit: string }`.
  - [ ] Render pill badge with low-stock amber warning vs in-stock emerald styling.
- [ ] **Task 2.2: Create `src/components/ui/SummaryCard.tsx`**
  - [ ] Implement `SummaryCardProps`: `{ label: string; value: string; icon: ReactNode; warning?: boolean }`.
  - [ ] Render KPI metric card with container icon and prominent typography.
- [ ] **Task 2.3: Create `src/components/ui/Field.tsx`**
  - [ ] Implement `FieldProps`: `{ label: string; value: string; onChange: (value: string) => void; type?: string; min?: string }`.
  - [ ] Render accessible label and styled input element.
- [ ] **Task 2.4: Create `src/components/ui/Info.tsx`**
  - [ ] Implement `InfoProps`: `{ label: string; value: string }`.
  - [ ] Render uppercase muted label with bold key value.
- [ ] **Task 2.5: Create `src/components/ui/Placeholder.tsx`**
  - [ ] Implement `PlaceholderProps`: `{ section: Exclude<Section, "products" | "inventory"> }`.
  - [ ] Render centered empty state card with `BarChart3` icon and contextual copy.

---

### 3. Layout Components (`src/components/layout/`)
- [ ] **Task 3.1: Create `src/components/layout/Sidebar.tsx`**
  - [ ] Implement `SidebarProps`: `{ section: Section; onChange: (section: Section) => void }`.
  - [ ] Render brand header with icon (*Ferretería Central / Inventory*).
  - [ ] Render navigation buttons for all 5 sections with active tab styling.
  - [ ] Render footer settings button.

---

### 4. Integration into App.tsx
- [ ] **Task 4.1: Update `src/app/App.tsx`**
  - [ ] Import `Section` from `../types/navigation`.
  - [ ] Import `StockBadge`, `SummaryCard`, `Field`, `Info`, `Placeholder` from `../components/ui/*`.
  - [ ] Import `Sidebar` from `../components/layout/Sidebar`.
  - [ ] Remove inline function declarations for extracted components.
  - [ ] Clean up unused imports from `lucide-react` in `App.tsx`.

---

### 5. Verification & Quality Gates
- [ ] **Task 5.1: Static Typecheck**
  - [ ] Run `tsc -b` with zero errors.
- [ ] **Task 5.2: Production Build**
  - [ ] Run `npm run build` and verify bundle generation in `dist/`.
- [ ] **Task 5.3: Manual UI Verification**
  - [ ] Test sidebar section switching.
  - [ ] Test stock badges on products table.
  - [ ] Test summary cards on inventory view.
  - [ ] Test form fields on receive stock modal.
  - [ ] Test placeholder views on overview, locations, alerts.

---

### 6. Git Flow & PR
- [ ] Commit all extracted components on `feat/02-atomic-ui-and-layout`.
- [ ] Push to `origin/feat/02-atomic-ui-and-layout`.
- [ ] Create Pull Request into `development`.
- [ ] Merge into `development` without deleting branches.
- [ ] Create Pull Request from `development` into `main` and merge without deleting branches.
