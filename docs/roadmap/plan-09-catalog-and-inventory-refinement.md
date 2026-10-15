# 📋 Plan & Traceability: Módulo Products vs Inventory (Alta de Catálogo, Kardex y Ajustes de Stock)

> **Epic:** Modernización Funcional & Módulos Clave  
> **Feature:** `src/features/catalog` & `src/features/inventory`  
> **Branch:** `feat/08-feature-catalog-and-inventory-refinement` (basada en `development`)  
> **Target:** `development`  
> **Status:** Completado ✅  

---

## 🎯 Objetivo y Criterios de Éxito

Resolver la duplicación conceptual y funcional entre **Products** (Catálogo Maestro) e **Inventory** (Kardex Contable/Operativo), dotando a cada módulo de sus herramientas distintivas:

- [x] **En Products (Catálogo Maestro):**
  - [x] Reemplazar la acción superior "Receive stock" por **`+ Nuevo Producto`**.
  - [x] Implementar `CreateProductModal.tsx` para dar de alta nuevos SKUs completos (identificación, precios, stock mínimo y ubicación inicial).
  - [x] Incorporar filtros rápidos por categoría comercial y estado de existencias en el catálogo.
- [x] **En Inventory (Kardex & Control Operativo):**
  - [x] Formalizar la vista como **Kardex Diario de Existencias** con auditoría estricta de saldo.
  - [x] Implementar la acción y modal de **`Ajuste de Stock`** (`StockAdjustmentModal.tsx`) para mermas, roturas y discrepancias de conteo físico (tipo `ADJUSTMENT`).
  - [x] Filtro por tipo de movimiento (`Todos`, `Compras`, `Ventas`, `Ajustes`, `Devoluciones`).
  - [x] Exportación del libro Kardex completo a archivo **CSV**.
- [x] **En el Estado Global (`useInventoryState.ts`):**
  - [x] Acción `createProduct(productData)`.
  - [x] Acción `adjustStock({ productId, delta, reason })`.
- [x] **Cero Errores:** `tsc -b && npm run build` y `cargo check` limpios.

---

## 🧩 Tareas y Checklist de Implementación

### 1. Extensión del Estado Global (`src/hooks/useInventoryState.ts`)
- [x] **Tarea 1.1:** Implementar `createProduct(newProduct)` con generación automática de ID y notificación toast.
- [x] **Tarea 1.2:** Implementar `adjustStock({ productId, delta, reason })` que actualiza `product.stock`, inserta un movimiento `ADJUSTMENT` en el Kardex y notifica al usuario.

### 2. Catálogo Maestro (`src/features/catalog/`)
- [x] **Tarea 2.1:** Crear `CreateProductModal.tsx` (formulario para alta de SKU con validación).
- [x] **Tarea 2.2:** Actualizar `ProductsView.tsx` con el botón principal `+ Nuevo Producto` y filtros de categoría.
- [x] **Tarea 2.3:** Exportar los nuevos componentes en `src/features/catalog/components/index.ts` e `index.ts`.

### 3. Kardex y Movimientos (`src/features/inventory/`)
- [x] **Tarea 3.1:** Crear `StockAdjustmentModal.tsx` (formulario para mermas/roturas/sobrantes con motivo obligatorio).
- [x] **Tarea 3.2:** Crear `KardexFiltersBar.tsx` (filtro por tipo de transacción y botón de exportar CSV).
- [x] **Tarea 3.3:** Actualizar `InventoryView.tsx` incorporando la acción de ajuste de stock y exportador.
- [x] **Tarea 3.4:** Exportar componentes en `src/features/inventory/components/index.ts` e `index.ts`.

### 4. Integración y App.tsx
- [x] **Tarea 4.1:** Pasar `createProduct` y `adjustStock` desde `useInventoryState` hacia `ProductsView` e `InventoryView`.

### 5. Verificación de Calidad y Gitflow
- [x] **Tarea 5.1:** Ejecutar `tsc -b` y `npm run build`.
- [ ] **Tarea 5.2:** Fusionar `feat/08-feature-catalog-and-inventory-refinement` en `development` y verificar CI.

