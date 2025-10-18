export interface RobuxTier {
  amount: number;
  price: number;
}

export interface RobuxPriceData {
  currency: string;
  unit: string;
  tiers: RobuxTier[];
}

export type BoostLevel = 'x2' | 'x4' | 'x8';

export type PurchaseMode = 'auto' | 'manual';

export type RevenueMode = 'perUser' | 'total';

export interface CalculationInput {
  priceData: RobuxPriceData;
  boostLevel: BoostLevel;
  sessions: number;
  durationPerSession: number;
  revenueMode: RevenueMode;
  pricePerUser: number;
  userCount: number;
  totalRevenue: number;
  purchaseMode: PurchaseMode;
  autoTierAmount: number;
  manualQuantities: Record<number, number>;
  stockToUse: number;
  currentStock: number;
}

export interface CalculationResult {
  totalRobuxNeeded: number;
  robuxFromStock: number;
  robuxToBuy: number;
  revenue: number;
  hpp: number;
  profit: number;
  margin: number;
  purchasedPackages: { tier: RobuxTier; quantity: number }[];
  totalRobuxPurchased: number;
  leftoverRobux: number;
  newStock: number;
  error: string | null;
  infoMessage: string | null;
}