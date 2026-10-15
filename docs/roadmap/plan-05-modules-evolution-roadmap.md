# 🗺️ Roadmap de Evolución de Módulos: Overview, Inventario, Ubicaciones y Alertas

> **Estado:** En discusión / Planificación  
> **Fecha:** 2026-10-15  
> **Referencia de Arquitectura:** `docs/roadmap/plan-04-architecture-and-directory-structure.md`

---

## 🎯 Objetivo General
Estructurar el roadmap de evolución funcional del sistema para transformar las vistas vacías/placeholders (`Overview`, `Locations`, `Alerts`) y resolver la ambigüedad conceptual entre **Products** (Catálogo Maestro) e **Inventory** (Kardex / Movimientos y Existencias).

---

## 🧭 Clarificación Conceptual: Products vs. Inventory

Actualmente, tanto en `Products` como en `Inventory` existe el botón **"Receive stock"**, y en las filas de `Products` existe una acción directa **"Receive"**. Esto genera una superposición visual y conceptual:

- **Products (Catálogo Maestro / "Qué vendemos"):**
  - Es el maestro de datos de productos (MDM).
  - Administra qué productos existen, sus nombres, códigos de barra, categorías, precios de venta al público y stock mínimo sugerido.
  - **Acción principal:** `+ Nuevo Producto` (Crear ficha) y `Editar Ficha`. La acción de `Receive stock` aquí es un atajo contextual: *"Recibir unidades específicamente para este SKU seleccionado"*.

- **Inventory (Gestión Operativa / "Cuánto y dónde lo tenemos"):**
  - Es el control logístico y contable (Kardex).
  - No define el producto, sino que audita el flujo de unidades (entradas por compra, salidas por venta, mermas, diferencias de inventario físico vs. sistema).
  - **Acción principal:** `Ajuste de Stock / Recuento Físico` (para corregir discrepancias) y `Registrar Entrada / Recepción` (ingreso general de mercadería con remito/factura).

---

## 📦 Desglose de los 4 Frentes a Atacar

### 1. `Overview` (Executive Dashboard & Business Metrics) - [COMPLETADO ✅]
- [x] **Métricas y KPIs Ejecutivos:**
  - [x] Valor monetario total del inventario (`Σ stock * cost` y `Σ stock * price`).
  - [x] Volumen total de unidades físicas en custodia.
  - [x] Estado de SKUs activos vs. agotados vs. en stock óptimo.
  - [x] Índice de rotación o salud de stock.
- [x] **Gráficos y Tendencias:**
  - [x] Flujo de movimientos en los últimos 7/30 días (Entradas vs Salidas vs Ajustes).
  - [x] Distribución de inventario por Categoría comercial.
- [x] **Widgets de Acción Rápida:**
  - [x] Top productos con stock crítico con botón directo de reposición.
  - [x] Últimas transacciones registradas (feed de actividad reciente).
  - [x] Atajos de navegación operativa.

---

### 2. `Locations` (Mapeo Físico de Tienda y Depósito) - [COMPLETADO ✅]
- [x] **Explorador Jerárquico de Espacios:**
  - [x] Navegación por `Sucursal` ➔ `Pasillo` ➔ `Rack/Gondola` ➔ `Estante/Gavetero`.
- [x] **Mapa / Layout de la Ferretería:**
  - [x] Representación visual/interactiva de los pasillos físicos del local.
  - [x] Desglose de artículos almacenados al hacer clic en un estante o pasillo.
- [x] **Gestión de Capacidad y Asignación:**
  - [x] Reubicación rápida de productos de una posición a otra (`relocateProduct`).
  - [x] Detección de huecos disponibles o sobreocupación.
- [x] **Modo "Picking / Búsqueda en Mostrador":**
  - [x] Localizador visual rápido para el vendedor de mostrador ("¿Dónde está este tornillo o caño?").

---

### 3. `Alerts` (Centro de Alertas, Roturas y Reabastecimiento) - [COMPLETADO ✅]
- [x] **Motor de Detección de Anomalías:**
  - [x] Quiebres de stock (Stock = 0).
  - [x] Puntos de pedido alcanzados (Stock $\le$ Mínimo).
  - [x] Detección de productos inmovilizados / sin movimiento.
- [x] **Bandeja de Entrada de Alertas Operativas:**
  - [x] Filtro por severidad (Crítica, Advertencia, Informativa) y por Categoría.
  - [x] Selección múltiple y gestión de alertas.
- [x] **Generador de Sugerencias de Reorden:**
  - [x] Cálculo automático de unidades faltantes hasta el stock ideal.
  - [x] Botón para generar borrador de orden de compra con exportación CSV y copiado de texto para el proveedor.

---

### 4. `Products` vs `Inventory` (Refinamiento y Separación de Responsabilidades)
- [ ] **En `Products`:**
  - [ ] Botón de acción principal: `+ Nuevo Producto` (modal de alta de ficha).
  - [ ] Filtros avanzados de catálogo (Categoría, Rango de Precios, Marca).
- [ ] **En `Inventory`:**
  - [ ] Acción de `Ajuste de Inventario` (para mermas, roturas o sobrantes de conteo).
  - [ ] Filtros avanzados de movimientos (por tipo de movimiento, por fecha, por usuario/nota).
  - [ ] Exportación de reporte de movimientos.

---

## 🎯 Rutas de Implementación

1. **Ruta A (Visualización & Métricas Ejecutivas - Recomendada):**
   1. `Overview` ➔ 2. `Alerts` ➔ 3. `Locations` ➔ 4. `Products vs Inventory`
2. **Ruta B (Control Operativo de Existencias):**
   1. `Products vs Inventory` ➔ 2. `Alerts` ➔ 3. `Overview` ➔ 4. `Locations`
