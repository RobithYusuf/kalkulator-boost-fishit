import { RobuxPriceData } from './types';

export const DEFAULT_ROBUX_PRICE_JSON: RobuxPriceData = {
  currency: "IDR",
  unit: "RBX",
  tiers: [
    { amount: 500, price: 68000 },
    { amount: 1000, price: 136000 },
    { amount: 1500, price: 204000 },
    { amount: 2000, price: 272000 },
    { amount: 2500, price: 340000 },
    { amount: 3000, price: 408000 },
    { amount: 3500, price: 476000 },
    { amount: 4000, price: 544000 },
    { amount: 4500, price: 612000 },
    { amount: 5000, price: 680000 },
  ],
};

// Biaya ini adalah untuk sesi boost berdurasi 3 jam
export const BOOST_COSTS: Record<string, number> = {
  x2: 99,
  x4: 396,
  x8: 1287, // 99 + 396 + 792
};