# 📋 Plan 12: Internacionalización (i18n) & Vista de Configuración (Settings)

> **Epic:** Experiencia de Usuario, Accesibilidad & Configuración de Terminal  
> **Feature:** `src/i18n/`, `src/features/settings/` & `useTranslation`  
> **Branch Objetivo:** `feat/12-feature-i18n-and-settings` (basada en `development`)  
> **Target:** `development`  
> **Status:** Completado (Listo para PR & Merge) ✅  

---

## 🎯 Objetivo y Criterios de Éxito

Implementar un sistema de internacionalización (**i18n**) nativo, tipado y sin dependencias pesadas, soportando **Español (`es`)** e **Inglés (`en`)**, con selector dedicado en una nueva vista de **Settings (Configuración)** en el sidebar:

- [x] **Filosofía de Diseño Operativo:** Ubicar el selector de idioma en la solapa de configuración (Settings), manteniendo la barra de navegación y header limpios y enfocados en las tareas críticas de mostrador.
- [x] **Motor i18n con Tipado Estricto (Zero-Dependency):**
  - [x] Esquema de traducciones (`TranslationSchema`) tipado a nivel de TypeScript para detectar claves faltantes en tiempo de compilación.
  - [x] Diccionario completo en español (`src/i18n/locales/es.ts`).
  - [x] Diccionario completo en inglés (`src/i18n/locales/en.ts`).
  - [x] Contexto React (`I18nProvider`) y hook `useTranslation()` con interpolación dinámica de variables y formateo regional adaptativo.
- [x] **Persistencia Local:** Preferencia guardada en `localStorage` (`app_locale`) con reactividad instantánea en todo el árbol de componentes.
- [x] **Nueva Vista `SettingsView`:**
  - [x] Selector interactivo de idioma (`LanguageSelector`) con tarjetas visuales para Español e Inglés.
  - [x] Previsualización en vivo de formatos regionales de moneda y fecha (`RegionalPreview`).
  - [x] Tarjeta de información de sistema y diagnóstico (`SystemInfoCard`: versión, motor SQLite WAL, migraciones y botón de respaldo).
- [x] **Traducción Exhaustiva de Todos los Módulos del Sistema:**
  - [x] Navegación y Sidebar.
  - [x] Overview Dashboard (KPIs, gráficos Recharts, actividad y reorden).
  - [x] Catálogo de Productos (`ProductsView`, `CreateProductModal`, `ProductDrawer`).
  - [x] Kardex e Inventario (`InventoryView`, `StockAdjustmentModal`, exportación CSV).
  - [x] Mapeo de Pasillos y Ubicaciones (`LocationsView`, `RelocateProductModal`).
  - [x] Centro de Alertas y Reposición (`AlertsView`, `PurchaseOrderModal`).
  - [x] Recepción de Stock (`ReceiveStockModal`, cámara WebRTC).
- [x] **Quality Gates:** `npm run build` y `cargo check` pasando al 100% sin advertencias.

---

## 🗺️ Fases de Ejecución

### Fase 1: Arquitectura Base de i18n & Tipado Estricto
- [x] Extender `Section` en `src/types/navigation.ts` con `"settings"`.
- [x] Crear `src/i18n/types.ts` con el esquema de traducciones estructurado.
- [x] Crear diccionarios `src/i18n/locales/es.ts` y `src/i18n/locales/en.ts`.
- [x] Crear `src/i18n/I18nContext.tsx` y `src/i18n/useTranslation.ts` con formateadores regionales adaptativos.
- [x] Crear barril `src/i18n/index.ts`.

### Fase 2: Vista de Configuración (`src/features/settings/`)
- [x] Implementar `LanguageSelector.tsx` con selección ES/EN y retroalimentación visual.
- [x] Implementar `RegionalPreview.tsx` con demostración de precios y fechas en tiempo real.
- [x] Implementar `SystemInfoCard.tsx` con versión, estado de base de datos SQLite y exportación de backup.
- [x] Implementar `SettingsView.tsx` y orquestador del módulo en `src/features/settings/index.ts`.

### Fase 3: Integración en Layout & Navegación
- [x] Actualizar `Sidebar.tsx` con el ítem de Settings (icono `Settings`), etiquetas traducidas dinámicamente y botón de backup traducido.
- [x] Envolver `App.tsx` con `<I18nProvider>` e integrar renderizado de `SettingsView`.

### Fase 4: Migración de Módulos al Motor i18n
- [x] Conectar `OverviewView` y sus componentes a `useTranslation`.
- [x] Conectar `ProductsView`, `CreateProductModal` y `ProductDrawer` a `useTranslation`.
- [x] Conectar `InventoryView`, `StockAdjustmentModal` y `KardexFiltersBar` a `useTranslation`.
- [x] Conectar `LocationsView` y `RelocateProductModal` a `useTranslation`.
- [x] Conectar `AlertsView` y `PurchaseOrderModal` a `useTranslation`.
- [x] Conectar `ReceiveStockModal` a `useTranslation`.

### Fase 5: Verificación de Calidad, PR & Fusión
- [x] Ejecutar `npm run build` para verificar cero errores de tipos y empaquetado de producción.
- [x] Ejecutar `cargo check` en `src-tauri` para garantizar estabilidad nativa.
- [x] Probar alternancia de idiomas en caliente y persistencia tras recarga.
- [ ] Crear PR hacia `development`, verificar CI Quality Gates y fusionar.
