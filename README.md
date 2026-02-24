# SplitSmart 🍽️

> Bagi tagihan restoran tanpa ribet — *Split restaurant bills without the hassle*

SplitSmart is a web app that makes splitting restaurant bills easy. Upload a photo of your receipt, let the AI read the items automatically, assign each item to the right person, and get an instant per-person breakdown including tax and service charge.

## Features

- 📸 **Receipt Upload** — Drag & drop or tap to upload a receipt photo; AI parses items and prices automatically
- ✏️ **Manual Editing** — Add, edit, or delete items as needed
- 👥 **People Manager** — Add everyone's name with a chip-based UI
- 🍽️ **Item Assignment** — Assign each item to one or more people (shared items split equally)
- 🧾 **Tax & Service Charge** — Configurable PPN and service charge percentages, split evenly
- 📊 **Per-Person Summary** — Clear breakdown of what each person owes
- 📋 **Copy to Clipboard** — Share the summary instantly

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- Pure CSS with CSS custom properties (no UI library)
- Indonesian Rupiah (IDR) currency formatting
