# 📋 Plan & Traceability: Módulo Alerts (Centro de Quiebres, Alertas y Reabastecimiento)

> **Epic:** Modernización Funcional & Módulos Clave  
> **Feature:** `src/features/alerts`  
> **Branch:** `feat/06-feature-alerts` (basada en `development`)  
> **Target:** `development`  
> **Status:** En Planificación ⏳  

---

## 🎯 Objetivo y Criterios de Éxito

Reemplazar la vista vacía (`Placeholder`) de la sección **Alerts** por un **Centro de Gestión de Alertas y Asistente de Reabastecimiento** modular, reactivo y de alta estética:

- [ ] **Motor de Reglas de Stock:** Detección de Quiebres de Stock (`stock = 0`), Puntos de Pedido (`0 < stock <= minStock`) y Sobrestock (`stock > minStock * 4`).
- [ ] **Estimador Financiero de Reposición:** Valuación monetaria automática del déficit para saneamiento del almacén.
- [ ] **Bandeja de Gestión con Filtros:** Búsqueda en vivo por texto, filtro de severidad (`Todas`, `Críticas`, `Advertencias`, `Sobrestock`) y por Categoría.
- [ ] **Asistente de Pedidos:** Selección múltiple mediante checkboxes para confeccionar borradores de compra y exportar a CSV o texto plano.
- [ ] **Acciones Inmediatas:** Botón directo de recepción de stock para resolver alertas en un clic.
- [ ] **Cero Errores:** `tsc -b && npm run build` y `cargo check` limpios.

---

## 🧩 Tareas y Checklist de Implementación

### 1. Modelos e Interfaces (`src/features/alerts/types.ts`)
- [ ] **Tarea 1.1:** Definir `AlertSeverity`, `InventoryAlert`, `AlertFilter`, y props de componentes.

### 2. Hook de Análisis y Selección (`src/features/alerts/hooks/`)
- [ ] **Tarea 2.1:** Implementar `useAlertsState(products)` con motor de reglas, cálculo de déficit financiero, filtrado y selección múltiple.
- [ ] **Tarea 2.2:** Crear barrel export `src/features/alerts/hooks/index.ts`.

### 3. Componentes del Módulo (`src/features/alerts/components/`)
- [ ] **Tarea 3.1:** Implementar `AlertsSummaryCards.tsx` (KPIs de críticas, advertencias, sobrestock y costo total de reposición).
- [ ] **Tarea 3.2:** Implementar `AlertsFiltersBar.tsx` (pills de severidad, búsqueda y filtro de categoría).
- [ ] **Tarea 3.3:** Implementar `AlertsTable.tsx` (tabla interactiva con selección múltiple, badges cromáticos y acciones "Recibir" y "Ver Ficha").
- [ ] **Tarea 3.4:** Implementar `PurchaseOrderModal.tsx` (asistente de orden de compra con exportador CSV y copia rápida).
- [ ] **Tarea 3.5:** Crear barrel export `src/features/alerts/components/index.ts`.

### 4. Orquestación y Vista Principal (`src/features/alerts/`)
- [ ] **Tarea 4.1:** Implementar `AlertsView.tsx` ensamblando los componentes y el modal de órdenes.
- [ ] **Tarea 4.2:** Crear barrel export público en `src/features/alerts/index.ts`.

### 5. Integración en la Aplicación
- [ ] **Tarea 5.1:** Actualizar `src/components/ui/display/Placeholder.tsx` para excluir `"alerts"`.
- [ ] **Tarea 5.2:** Conectar `AlertsView` en `src/app/App.tsx`.

### 6. Verificación de Calidad y Gitflow
- [ ] **Tarea 6.1:** Ejecutar `tsc -b` y `npm run build`.
- [ ] **Tarea 6.2:** Fusionar `feat/06-feature-alerts` en `development` y verificar CI.
