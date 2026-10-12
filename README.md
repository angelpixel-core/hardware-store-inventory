# 🛠️ Hardware Store Inventory — Desktop App (Tauri + React)

A modern, cross-platform desktop inventory management system tailored for retail and hardware stores (*ferreterías / corralones*). Built with **Tauri v2**, **React 19**, **TypeScript**, and **Tailwind CSS**.

> **Note for Delivery & Product Managers:** This document provides a complete visual walkthrough and architectural overview so you can review functionality, UI workflows, and technical scope without needing to install or run the code locally.

---

## 📌 Executive Summary

This prototype (Iteration 2) demonstrates a native desktop solution designed to streamline daily store operations:
- **Product Catalog & Physical Store Mapping**: Real-time visibility into stock levels, pricing, cost, SKU, barcode, and physical warehouse coordinates (*Store · Aisle · Rack · Shelf*).
- **Stock Movement Traceability**: Full audit trail tracking inventory changes with categorized movements (`PURCHASE`, `SALE`, `RETURN`, `ADJUSTMENT`).
- **Receive Stock Workflow**: Guided operational modal for receiving incoming supplier shipments, updating stock quantities immediately, setting storage locations, and attaching product photos via file upload or **desktop camera capture**.
- **Low-Stock Alerting**: Instant badge indicators and summary cards identifying products below their minimum safety threshold.

---

## 📸 Visual Walkthrough & Features

### 1. Products Catalog & Storage Locations
View and search the entire catalog. Each entry displays category, brand, SKU, retail price, current stock badge (with automatic "Low stock" indicators), and exact physical store placement.

![Products Catalog](docs/screenshots/01-products-catalog.png)

---

### 2. Product Detail Drawer & Movement History
Clicking any item slides out a comprehensive inspector showing SKU, barcode, retail price, purchase cost, current stock vs. threshold, location, direct **Receive Stock** action, and the specific movement history for that SKU.

![Product Details Drawer](docs/screenshots/02-product-detail.png)

---

### 3. Inventory Dashboard & Stock Movements Audit
The **Inventory** view provides operational KPI summary cards (*Total units in store*, *Active products*, *Low stock items requiring reorder*) along with a chronological movements table displaying timestamp, product, movement type badge, quantity delta (`+` / `−`), location, and delivery/adjustment notes.

![Inventory Movements](docs/screenshots/03-inventory-movements.png)

---

### 4. Receive Stock Modal (with Camera & Photo Attachment)
When receiving new supplier shipments, warehouse staff can select the product, specify incoming quantity and unit cost, reassign or verify shelf storage location, add supplier notes, and attach a verification photo via file upload or integrated desktop webcam capture (`navigator.mediaDevices.getUserMedia()`).

![Receive Stock Modal](docs/screenshots/04-receive-stock-modal.png)

---

### 5. Fast Search & Quick Filtering
Instant live search by product name, brand, SKU, category, or barcode across all inventory items.

![Product Search Filter](docs/screenshots/05-product-search-filter.png)

---

## 🧱 Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Desktop Shell** | [Tauri v2](https://tauri.app/) (Rust) | Lightweight, memory-efficient native wrapper (1280×820 minimum responsive canvas) |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Component-driven UI with strict typing |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first design system |
| **Bundler / Tooling** | [Vite 8](https://vite.dev/) | Sub-second HMR and optimized production bundling |
| **Iconography** | [Lucide React](https://lucide.dev/) | Clean, consistent icons |
| **Hardware Access** | WebRTC / `getUserMedia()` | Camera capture permissions requested on-demand |

---

## 📂 Project Structure

```text
hardware-store-inventory/
├── docs/
│   └── screenshots/         # High-resolution screenshots for review
│       ├── 01-products-catalog.png
│       ├── 02-product-detail.png
│       ├── 03-inventory-movements.png
│       ├── 04-receive-stock-modal.png
│       └── 05-product-search-filter.png
├── src/
│   ├── app/
│   │   └── App.tsx          # Main layout, sidebar, catalog, drawer & modals
│   ├── data/
│   │   ├── index.ts         # Mock seed dataset & initial movements
│   │   └── products.json    # Sample hardware inventory catalog
│   ├── types/
│   │   └── inventory.ts     # Domain models (Product, StockMovement, Location)
│   ├── main.tsx             # React entry point
│   └── styles.css           # Global typography & Tailwind styles
├── src-tauri/               # Tauri v2 native configuration and Rust harness
│   ├── Cargo.toml
│   └── tauri.conf.json      # Window sizes, permissions, build hooks
├── package.json
├── tsconfig.json
└── vite.config.ts           # Vite + Tailwind configuration
```

---

## 🚀 Getting Started & Local Run

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Rust & Cargo](https://www.rust-lang.org/) *(only required if compiling the native Tauri desktop binary)*

### 1. Web Preview Mode (Quickest)
You can run and test the full application directly in any browser:

```bash
# Install dependencies
npm install

# Start Vite dev server on http://localhost:1420
npm run dev
```

### 2. Native Desktop Mode (Tauri)
To launch the native desktop application window:

```bash
npm run tauri dev
```

### 3. Production Build
```bash
# Build frontend bundle
npm run build

# Package desktop installer/binary (DMG/MSI/deb depending on OS)
npm run tauri build
```

### ⚙️ Optional Environment Variables
- `ALLOWED_HOSTS`: Comma-separated list of additional allowed hosts in Vite (useful if exposing via tunnels like ngrok for remote client testing).

---

## 🗺️ Scope & Roadmap (Delivery Plan)

- [x] **Iteration 1**: Initial catalog view, product data models, and basic layout.
- [x] **Iteration 2 (Current)**:
  - Inventory movements log (`PURCHASE`, `SALE`, `RETURN`, `ADJUSTMENT`).
  - Receive Stock workflow with immediate state updates.
  - Product details drawer with movement audit trail.
  - Physical warehouse coordinate tracking (*Store · Aisle · Rack · Shelf*).
  - Desktop camera capture and image upload support.
- [ ] **Iteration 3 (Next Steps / Backend Integration)**:
  - Connect to backend API (e.g. Ruby on Rails / PostgreSQL) replacing in-memory state with persistent database transactions.
  - Barcode scanner integration (USB HID and camera-based barcode decoding).
  - Multi-store inventory transfers.
  - User roles & authentication (Cashier, Store Manager, Warehouse Clerk).
