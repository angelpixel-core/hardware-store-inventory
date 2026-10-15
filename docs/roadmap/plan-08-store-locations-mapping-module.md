# 📋 Plan & Traceability: Módulo Locations (Mapeo Físico de Tienda, Pasillos y Modo Picking)

> **Epic:** Modernización Funcional & Módulos Clave  
> **Feature:** `src/features/locations`  
> **Branch:** `feat/07-feature-locations` (basada en `development`)  
> **Target:** `development`  
> **Status:** En Planificación ⏳  

---

## 🎯 Objetivo y Criterios de Éxito

Reemplazar el último `Placeholder` del sistema (`Locations`) por un **Módulo de Mapeo Físico de Tienda, Pasillos y Modo Picking de Mostrador** interactivo y reactivo:

- [x] **Modo Picking / Localizador Rápido de Mostrador:** Búsqueda instantánea de cualquier artículo que resalta su pasillo, rack y estante exactos en el plano.
- [x] **Mapa Visual de Pasillos (Store Layout):** Representación gráfica e interactiva de los pasillos de la ferretería (A1 a A7), indicando rubro comercial, volumen de unidades y SKUs custodiados.
- [x] **Explorador Jerárquico de Espacios:** Navegación fluida por `Pasillo` ➔ `Rack` ➔ `Estante (Shelf)` con inventario detallado de cada posición.
- [x] **Reubicación Física de Productos:** Capacidad de transferir un producto a una nueva coordenada física (`relocateProduct`).
- [x] **Integración Completa:** Conectar en `src/app/App.tsx`, eliminar el componente `Placeholder.tsx` (ya no quedan vistas vacías).
- [x] **Cero Errores:** `tsc -b && npm run build` y `cargo check` limpios.

---

## 🧩 Tareas y Checklist de Implementación

### 1. Modelos e Interfaces (`src/features/locations/types.ts`)
- [x] **Tarea 1.1:** Definir interfaces `AisleNode`, `RackNode`, `ShelfNode`, `LocationStats`, y props de componentes.

### 2. Hook de Análisis Espacial y Picking (`src/features/locations/hooks/`)
- [x] **Tarea 2.1:** Implementar `useLocationsState(products, onRelocate)`: indexación de pasillos, racks, estantes, buscador de mostrador y selección de zona.
- [x] **Tarea 2.2:** Crear barrel export `src/features/locations/hooks/index.ts`.

### 3. Componentes del Módulo (`src/features/locations/components/`)
- [x] **Tarea 3.1:** Implementar `LocationsSummaryCards.tsx` (KPIs de pasillos activos, estantes ocupados, SKUs asignados).
- [x] **Tarea 3.2:** Implementar `PickingSearchBar.tsx` (buscador rápido de mostrador con indicador de ubicación en vivo).
- [x] **Tarea 3.3:** Implementar `StoreLayoutMap.tsx` (grilla interactiva de pasillos con indicadores de ocupación y selección).
- [x] **Tarea 3.4:** Implementar `LocationInventoryDrawer.tsx` o `ShelfContentsList.tsx` (lista de productos en la posición seleccionada, con botón "Recibir" y "Reubicar").
- [x] **Tarea 3.5:** Implementar `RelocateModal.tsx` (modal para cambiar pasillo, rack y estante de un artículo).
- [x] **Tarea 3.6:** Crear barrel export `src/features/locations/components/index.ts`.

### 4. Orquestación y Vista Principal (`src/features/locations/`)
- [x] **Tarea 4.1:** Implementar `LocationsView.tsx` orquestando el plano visual, buscador y contenido de estantes.
- [x] **Tarea 4.2:** Crear barrel export público en `src/features/locations/index.ts`.

### 5. Actualización del Estado Global e Integración
- [x] **Tarea 5.1:** Agregar `relocateProduct` en `src/hooks/useInventoryState.ts`.
- [x] **Tarea 5.2:** Conectar `LocationsView` en `src/app/App.tsx`.
- [x] **Tarea 5.3:** Eliminar el componente obsoleto `src/components/ui/display/Placeholder.tsx` o dejarlo para rutas no encontradas.

### 6. Verificación de Calidad y Gitflow
- [x] **Tarea 6.1:** Ejecutar `tsc -b` y `npm run build`.
- [ ] **Tarea 6.2:** Fusionar `feat/07-feature-locations` en `development` y verificar CI.
