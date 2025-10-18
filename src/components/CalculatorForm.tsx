import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { Slider } from './ui/Slider';
import { Toggle } from './ui/Toggle';
import { Button } from './ui/Button';
import { BoostLevel, PurchaseMode, RevenueMode, RobuxPriceData } from '../types';

// Helper function to format number to IDR string with dots
const formatNumberInput = (num: number): string => {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
};

// Helper function to parse formatted IDR string back to a number
const parseFormattedNumberInput = (str: string): number => {
  if (!str) return 0;
  // Remove all non-digit characters
  const cleaned = str.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};


interface CalculatorFormProps {
  priceData: RobuxPriceData | null;
  boostLevel: BoostLevel;
  setBoostLevel: (l: BoostLevel) => void;
  sessions: number;
  setSessions: (n: number) => void;
  durationPerSession: number;
  setDurationPerSession: (n: number) => void;
  revenueMode: RevenueMode;
  setRevenueMode: (m: RevenueMode) => void;
  pricePerUser: number;
  setPricePerUser: (p: number) => void;
  userCount: number;
  setUserCount: (c: number) => void;
  totalRevenue: number;
  setTotalRevenue: (r: number) => void;
  purchaseMode: PurchaseMode;
  setPurchaseMode: (m: PurchaseMode) => void;
  autoTierAmount: number;
  setAutoTierAmount: (a: number) => void;
  manualQuantities: Record<number, number>;
  setManualQuantities: (q: Record<number, number>) => void;
  stockToUse: number;
  setStockToUse: (u: number) => void;
  currentStock: number;
  isFormValid: boolean;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = (props) => {
  const { priceData, boostLevel, setBoostLevel, sessions, setSessions, durationPerSession, setDurationPerSession, revenueMode, setRevenueMode, pricePerUser, setPricePerUser, userCount, setUserCount, totalRevenue, setTotalRevenue, purchaseMode, setPurchaseMode, autoTierAmount, setAutoTierAmount, manualQuantities, setManualQuantities, stockToUse, setStockToUse, currentStock, isFormValid } = props;

  const handleStockToUseChange = (value: string) => {
    const numericValue = parseInt(value, 10) || 0;
    setStockToUse(Math.max(0, Math.min(currentStock, numericValue)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kalkulator HPP</CardTitle>
        <CardDescription>Masukkan detail order untuk menghitung HPP dan profit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="boost-level">Level Boost</Label>
            <Select id="boost-level" value={boostLevel} onChange={(e) => setBoostLevel(e.target.value as BoostLevel)} className="mt-2">
              <option value="x2">x2 Boost</option>
              <option value="x4">x4 Boost</option>
              <option value="x8">x8 Boost (Full Stack)</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
            <div>
                <Label htmlFor="duration">Durasi/Sesi (Jam)</Label>
                <Input id="duration" type="number" min="1" value={durationPerSession} onChange={(e) => setDurationPerSession(Math.max(1, parseInt(e.target.value, 10)) || 1)} className="mt-2" />
            </div>
            <div>
                <Label htmlFor="sessions">Jumlah Sesi</Label>
                <Input id="sessions" type="number" min="1" value={sessions} onChange={(e) => setSessions(Math.max(1, parseInt(e.target.value, 10)) || 1)} className="mt-2" />
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-700 rounded-md space-y-4 bg-gray-900/50">
            <div className="flex items-center justify-between">
                <Label>Mode Input Omset</Label>
                <div className="flex items-center gap-2 text-sm">
                    <span className={revenueMode === 'perUser' ? 'text-cyan-400' : 'text-gray-400'}>Per User</span>
                    <Toggle id="revenue-mode" checked={revenueMode === 'total'} onChange={(c) => setRevenueMode(c ? 'total' : 'perUser')} />
                    <span className={revenueMode === 'total' ? 'text-cyan-400' : 'text-gray-400'}>Total</span>
                </div>
            </div>
          {revenueMode === 'perUser' ? (
            <>
              <div>
                <Label htmlFor="price-per-user">Harga per User (IDR)</Label>
                <Input 
                  id="price-per-user" 
                  type="text" 
                  value={formatNumberInput(pricePerUser)} 
                  onChange={(e) => setPricePerUser(parseFormattedNumberInput(e.target.value))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="user-count">Jumlah User ({userCount})</Label>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                  <Slider id="user-count" min="1" max="20" step="1" value={userCount} onChange={(e) => setUserCount(Number(e.target.value))} className="w-full" />
                  <Input type="number" className="w-full sm:w-20" value={userCount} onChange={(e) => setUserCount(Number(e.target.value))} min="1" max="20" />
                </div>
              </div>
            </>
          ) : (
            <div>
              <Label htmlFor="total-revenue">Omset Total (IDR)</Label>
              <Input 
                id="total-revenue" 
                type="text" 
                value={formatNumberInput(totalRevenue)} 
                onChange={(e) => setTotalRevenue(parseFormattedNumberInput(e.target.value))}
                className="mt-2"
              />
            </div>
          )}
        </div>
        
        <div className="p-4 border border-gray-700 rounded-md bg-gray-900/50">
            <div className="flex items-center justify-between">
                <Label>Mode Pembelian Paket</Label>
                <div className="flex items-center gap-2 text-sm">
                    <span className={purchaseMode === 'auto' ? 'text-cyan-400' : 'text-gray-400'}>Auto</span>
                    <Toggle id="purchase-mode" checked={purchaseMode === 'manual'} onChange={(c) => setPurchaseMode(c ? 'manual' : 'auto')} />
                    <span className={purchaseMode === 'manual' ? 'text-cyan-400' : 'text-gray-400'}>Manual</span>
                </div>
            </div>

            {purchaseMode === 'auto' ? (
                <div className="mt-6">
                    <Label htmlFor="auto-tier">Pilih Satu Tier Utama</Label>
                    <Select id="auto-tier" value={autoTierAmount} onChange={e => setAutoTierAmount(Number(e.target.value))} disabled={!isFormValid} className="mt-2">
                        {priceData?.tiers.map(tier => (
                            <option key={tier.amount} value={tier.amount}>{tier.amount} RBX</option>
                        ))}
                    </Select>
                </div>
            ) : (
                <div className="space-y-2 mt-6">
                    <Label>Kuantitas per Tier</Label>
                    {priceData?.tiers.map(tier => (
                        <div key={tier.amount} className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">{tier.amount} RBX</span>
                            <Input 
                                type="number"
                                min="0"
                                className="w-24"
                                value={manualQuantities[tier.amount] || 0}
                                onChange={e => setManualQuantities({ ...manualQuantities, [tier.amount]: Math.max(0, parseInt(e.target.value) || 0) })}
                                disabled={!isFormValid}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {currentStock > 0 && (
             <div className="p-3 bg-gray-800 rounded-md space-y-2">
                <Label htmlFor="use-stock" className="flex flex-col">
                    <span>Pakai Stok Robux?</span>
                    <span className="text-xs text-gray-400">Stok Saat Ini: {currentStock.toLocaleString('id-ID')} RBX</span>
                </Label>
                <div className="flex items-center gap-2">
                    <Input 
                        id="use-stock"
                        type="number"
                        value={stockToUse}
                        onChange={(e) => handleStockToUseChange(e.target.value)}
                        max={currentStock}
                        min="0"
                    />
                    <Button variant="secondary" onClick={() => setStockToUse(currentStock)}>Gunakan Semua</Button>
                </div>
             </div>
        )}
      </CardContent>
    </Card>
  );
};