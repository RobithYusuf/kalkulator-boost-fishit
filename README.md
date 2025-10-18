# Kalkulator HPP Boost Server Roblox

Aplikasi kalkulator untuk menghitung biaya pokok penjualan (HPP), profit, dan margin untuk jasa boost server Roblox. Membantu penjual mengestimasi biaya, mengelola inventory Robux, dan menetapkan harga secara efektif berdasarkan paket Robux bertingkat.

## Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS v4** - Styling Framework

## Prerequisites

- Node.js (v18 atau lebih tinggi)
- npm atau yarn

## Instalasi

1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Jalankan development server:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Build Production

Build aplikasi untuk production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Fitur

- Kalkulasi HPP otomatis berdasarkan level boost (x2, x4, x8)
- Manajemen stok Robux
- Mode pembelian Auto dan Manual
- Perhitungan revenue per user atau total
- Export/Import data konfigurasi
- Penyimpanan otomatis ke localStorage

## Struktur Project

```
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # UI components
│   │   ├── CalculatorForm.tsx
│   │   ├── JsonEditor.tsx
│   │   ├── PriceTable.tsx
│   │   └── ResultsSummary.tsx
│   ├── hooks/           # Custom React hooks
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   ├── index.css        # Tailwind CSS imports
│   ├── types.ts         # TypeScript type definitions
│   └── constants.ts     # App constants
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies & scripts
```

## License

Private - All rights reserved
