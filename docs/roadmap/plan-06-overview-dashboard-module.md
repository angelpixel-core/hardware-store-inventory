# 📋 Plan & Traceability: Módulo Overview (Executive Dashboard & Business Metrics)

> **Epic:** Modernización Funcional & Módulos Clave  
> **Feature:** `src/features/overview`  
> **Branch:** `feat/05-feature-overview` (basada en `development`)  
> **Target:** `development`  
> **Status:** En Planificación ⏳  

---

## 🎯 Objetivo y Criterios de Éxito

Reemplazar la vista vacía (`Placeholder`) de la sección **Overview** por un **Dashboard Ejecutivo** modular, reactivo y de alta estética visual:

- [ ] **Métricas Financieras y de Volumen:** Valuación monetaria (`Σ stock * cost`), proyección de venta (`Σ stock * price`), margen comercial proyectado y unidades físicas totales.
- [ ] **Desglose de Salud por Categoría:** Visualización de la distribución del inventario y participación porcentual por categoría comercial.
- [ ] **Widget de Reposición Urgente:** Listado de los productos con quiebre (`stock = 0`) o bajo stock (`stock <= minStock`) con botón de recepción directa.
- [ ] **Feed de Transacciones Recientes:** Últimos movimientos del Kardex con badges de estado y enlace de salto a `Inventory`.
- [ ] **Cero Errores de Tipos y Build:** Compilación limpia con `tsc -b && vite build`.

---

## 🧩 Tareas y Checklist de Implementación

### 1. Modelos e Interfaces (`src/features/overview/types.ts`)
- [ ] **Tarea 1.1:** Definir interfaces `OverviewKPIs`, `CategoryMetric`, y props de componentes.

### 2. Hook de Análisis y Derivación (`src/features/overview/hooks/`)
- [ ] **Tarea 2.1:** Implementar `useOverviewMetrics(products, movements)` con memorización eficiente (`useMemo`).
- [ ] **Tarea 2.2:** Crear barrel export `src/features/overview/hooks/index.ts`.

### 3. Componentes del Dashboard (`src/features/overview/components/`)
- [ ] **Tarea 3.1:** Implementar `OverviewMetrics.tsx` (tarjetas KPI de valuación, volumen, SKUs y alertas).
- [ ] **Tarea 3.2:** Implementar `CategoryBreakdown.tsx` (barras de distribución y desglose por rubro comercial).
- [ ] **Tarea 3.3:** Implementar `UrgentReorderList.tsx` (lista interactiva de productos críticos con acción `onReceive`).
- [ ] **Tarea 3.4:** Implementar `RecentActivityFeed.tsx` (feed de auditoría de transacciones con salto a `inventory`).
- [ ] **Tarea 3.5:** Crear barrel export `src/features/overview/components/index.ts`.

### 4. Orquestación y Vista Principal (`src/features/overview/`)
- [ ] **Tarea 4.1:** Implementar `OverviewView.tsx` ensamblando los widgets en un layout responsivo.
- [ ] **Tarea 4.2:** Crear barrel export público en `src/features/overview/index.ts`.

### 5. Integración en la Aplicación
- [ ] **Tarea 5.1:** Actualizar `src/components/ui/display/Placeholder.tsx` para excluir `"overview"`.
- [ ] **Tarea 5.2:** Conectar `OverviewView` en `src/app/App.tsx`.

### 6. Verificación de Calidad y Gitflow
- [ ] **Tarea 6.1:** Ejecutar `tsc -b` y `npm run build`.
- [ ] **Tarea 6.2:** Fusionar `feat/05-feature-overview` en `development` y verificar CI.
