import puppeteer from "puppeteer-core";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, "../docs/screenshots");

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function run() {
  console.log("Launching Chrome at:", chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    defaultViewport: {
      width: 1280,
      height: 820,
      deviceScaleFactor: 2,
    },
  });

  const page = await browser.newPage();

  async function clickButtonWithText(textSnippet) {
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.innerText, btn);
      if (text && text.includes(textSnippet)) {
        await btn.click();
        return true;
      }
    }
    return false;
  }

  const tasks = [
    {
      name: "06-overview-dashboard.png",
      url: "http://localhost:1420?section=overview",
      async action() {
        await new Promise((r) => setTimeout(r, 1500)); // wait for Recharts animations
      },
    },
    {
      name: "01-products-catalog.png",
      url: "http://localhost:1420?section=products",
      async action() {
        await new Promise((r) => setTimeout(r, 800));
      },
    },
    {
      name: "02-product-detail.png",
      url: "http://localhost:1420?section=products&product=prod-1",
      async action() {
        await new Promise((r) => setTimeout(r, 800));
      },
    },
    {
      name: "05-product-search-filter.png",
      url: "http://localhost:1420?section=products&search=taladro",
      async action() {
        await new Promise((r) => setTimeout(r, 800));
      },
    },
    {
      name: "09-create-product-modal.png",
      url: "http://localhost:1420?section=products",
      async action() {
        await new Promise((r) => setTimeout(r, 600));
        const clicked = await clickButtonWithText("Nuevo Producto");
        console.log("  Clicked Nuevo Producto:", clicked);
        await new Promise((r) => setTimeout(r, 600));
      },
    },
    {
      name: "03-inventory-movements.png",
      url: "http://localhost:1420?section=inventory",
      async action() {
        await new Promise((r) => setTimeout(r, 800));
      },
    },
    {
      name: "10-stock-adjustment-modal.png",
      url: "http://localhost:1420?section=inventory",
      async action() {
        await new Promise((r) => setTimeout(r, 600));
        const clicked = await clickButtonWithText("Ajustar Stock");
        console.log("  Clicked Ajustar Stock:", clicked);
        await new Promise((r) => setTimeout(r, 600));
      },
    },
    {
      name: "07-storage-locations.png",
      url: "http://localhost:1420?section=locations",
      async action() {
        await new Promise((r) => setTimeout(r, 800));
      },
    },
    {
      name: "11-relocate-product-modal.png",
      url: "http://localhost:1420?section=locations",
      async action() {
        await new Promise((r) => setTimeout(r, 600));
        const clicked = await clickButtonWithText("Reubicar");
        console.log("  Clicked Reubicar:", clicked);
        await new Promise((r) => setTimeout(r, 600));
      },
    },
    {
      name: "08-low-stock-alerts.png",
      url: "http://localhost:1420?section=alerts",
      async action() {
        await new Promise((r) => setTimeout(r, 800));
      },
    },
    {
      name: "12-purchase-order-modal.png",
      url: "http://localhost:1420?section=alerts",
      async action() {
        await new Promise((r) => setTimeout(r, 600));
        const clicked = await clickButtonWithText("Generar Orden de Compra");
        console.log("  Clicked Generar Orden de Compra:", clicked);
        await new Promise((r) => setTimeout(r, 600));
      },
    },
    {
      name: "04-receive-stock-modal.png",
      url: "http://localhost:1420?section=products&receive=true",
      async action() {
        await new Promise((r) => setTimeout(r, 800));
      },
    },
  ];

  for (const task of tasks) {
    console.log(`Capturing: ${task.name} from ${task.url}...`);
    await page.goto(task.url, { waitUntil: "networkidle0" });
    if (task.action) {
      await task.action();
    }
    const outputPath = path.join(screenshotsDir, task.name);
    await page.screenshot({ path: outputPath, fullPage: false });
    const stats = fs.statSync(outputPath);
    console.log(`  Saved ${task.name} (${Math.round(stats.size / 1024)} KB)`);
  }

  await browser.close();
  console.log("All screenshots successfully captured!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
