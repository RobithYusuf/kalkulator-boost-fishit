import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { JsonEditor } from './components/JsonEditor';
import { PriceTable } from './components/PriceTable';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsSummary } from './components/ResultsSummary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_ROBUX_PRICE_JSON, BOOST_COSTS } from './constants';
import type { RobuxPriceData, BoostLevel, PurchaseMode, RevenueMode, CalculationResult, CalculationInput, RobuxTier } from './types';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';

const validatePriceData = (data: any): { valid: boolean; data: RobuxPriceData | null; error: string | null } => {
    if (typeof data !== 'object' || data === null) return { valid: false, data: null, error: 'JSON harus berupa objek.' };
    if (typeof data.currency !== 'string' || !data.currency) return { valid: false, data: null, error: 'Properti "currency" wajib ada dan berupa string.' };
    if (typeof data.unit !== 'string' || !data.unit) return { valid: false, data: null, error: 'Properti "unit" wajib ada dan berupa string.' };
    if (!Array.isArray(data.tiers)) return { valid: false, data: null, error: 'Properti "tiers" wajib ada dan berupa array.' };
    for (const tier of data.tiers) {
        if (typeof tier.amount !== 'number' || tier.amount <= 0) return { valid: false, data: null, error: 'Setiap tier harus punya "amount" berupa angka positif.' };
        if (typeof tier.price !== 'number' || tier.price < 0) return { valid: false, data: null, error: 'Setiap tier harus punya "price" berupa angka.' };
    }
    return { valid: true, data: data as RobuxPriceData, error: null };
};

const calculateHpp = (input: CalculationInput): CalculationResult => {
    const costPerThreeHours = BOOST_COSTS[input.boostLevel];
    const costPerHour = costPerThreeHours / 3;
    const totalRobuxNeeded = Math.ceil(costPerHour * input.durationPerSession * input.sessions);

    const robuxFromStock = Math.min(input.currentStock, input.stockToUse, totalRobuxNeeded);
    const robuxToBuy = totalRobuxNeeded - robuxFromStock;

    let purchasedPackages: { tier: RobuxTier; quantity: number }[] = [];
    let hpp = 0;
    let totalRobuxPurchased = 0;
    let error: string | null = null;
    let infoMessage: string | null = null;
    
    if (robuxToBuy > 0) {
        if (input.purchaseMode === 'auto') {
            const selectedTier = input.priceData.tiers.find(t => t.amount === input.autoTierAmount);
            if (selectedTier) {
                const quantity = Math.ceil(robuxToBuy / selectedTier.amount);
                hpp = quantity * selectedTier.price;
                totalRobuxPurchased = quantity * selectedTier.amount;
                purchasedPackages.push({ tier: selectedTier, quantity });

                // Deteksi kasus khusus di mana penggunaan stok tidak mengubah HPP
                if (robuxFromStock > 0) {
                    const quantityWithoutStock = Math.ceil(totalRobuxNeeded / selectedTier.amount);
                    if (quantity === quantityWithoutStock) {
                        infoMessage = `Meskipun stok digunakan, jumlah paket yang perlu dibeli tetap sama (${quantity} paket), sehingga HPP tidak berubah. Keuntungannya adalah sisa Robux Anda setelah transaksi menjadi lebih besar.`;
                    }
                }
            } else {
                 error = "Tier yang dipilih untuk mode Auto tidak valid. Silakan pilih kembali.";
            }
        } else { // manual
            let robuxFromManualPurchase = 0;
            for (const tier of input.priceData.tiers) {
                const quantity = input.manualQuantities[tier.amount] || 0;
                if (quantity > 0) {
                    hpp += quantity * tier.price;
                    robuxFromManualPurchase += quantity * tier.amount;
                    purchasedPackages.push({ tier, quantity });
                }
            }
            totalRobuxPurchased = robuxFromManualPurchase;
            if(totalRobuxPurchased < robuxToBuy) {
                error = `Pembelian manual (${totalRobuxPurchased.toLocaleString('id-ID')} RBX) tidak mencukupi kebutuhan (${robuxToBuy.toLocaleString('id-ID')} RBX).`;
            }
        }
    }

    const leftoverRobux = totalRobuxPurchased - robuxToBuy;
    const newStock = (input.currentStock - robuxFromStock) + leftoverRobux;

    const revenue = input.revenueMode === 'perUser' 
        ? input.pricePerUser * input.userCount 
        : input.totalRevenue;
    
    const profit = revenue - hpp;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { totalRobuxNeeded, robuxFromStock, robuxToBuy, revenue, hpp, profit, margin, purchasedPackages, totalRobuxPurchased, leftoverRobux, newStock, error, infoMessage };
};


function App() {
    const [jsonString, setJsonString] = useLocalStorage('rbx.priceTiers.v1', JSON.stringify(DEFAULT_ROBUX_PRICE_JSON, null, 2));
    const [currentStock, setCurrentStock] = useLocalStorage('rbx.stock.v1', 0);

    const [boostLevel, setBoostLevel] = useLocalStorage<BoostLevel>('rbx.settings.v1.boostLevel', 'x8');
    const [sessions, setSessions] = useLocalStorage<number>('rbx.settings.v1.sessions', 1);
    const [durationPerSession, setDurationPerSession] = useLocalStorage<number>('rbx.settings.v1.durationPerSession', 3);
    const [revenueMode, setRevenueMode] = useLocalStorage<RevenueMode>('rbx.settings.v1.revenueMode', 'perUser');
    const [pricePerUser, setPricePerUser] = useLocalStorage<number>('rbx.settings.v1.pricePerUser', 17000);
    const [userCount, setUserCount] = useLocalStorage<number>('rbx.session.v1.userCount', 19);
    const [totalRevenue, setTotalRevenue] = useLocalStorage<number>('rbx.settings.v1.totalRevenue', 323000);
    const [purchaseMode, setPurchaseMode] = useLocalStorage<PurchaseMode>('rbx.settings.v1.purchaseMode', 'auto');
    const [autoTierAmount, setAutoTierAmount] = useLocalStorage<number>('rbx.settings.v1.autoTierAmount', 1500);
    const [manualQuantities, setManualQuantities] = useLocalStorage<Record<number, number>>('rbx.session.v1.manualQty', {});
    const [stockToUse, setStockToUse] = useLocalStorage<number>('rbx.settings.v1.stockToUse', 0);

    // Modal states
    const [isClearStockModalOpen, setIsClearStockModalOpen] = useState(false);
    const [isResetAllModalOpen, setIsResetAllModalOpen] = useState(false);


    const { valid: isJsonValid, data: priceData, error: jsonError } = useMemo(() => {
        try {
            const parsed = JSON.parse(jsonString);
            return validatePriceData(parsed);
        } catch (e) {
            return { valid: false, data: null, error: 'Format JSON tidak valid.' };
        }
    }, [jsonString]);
    
    useEffect(() => {
      if (priceData && priceData.tiers.length > 0) {
        const tierAmounts = priceData.tiers.map(t => t.amount);
        if (!tierAmounts.includes(autoTierAmount)) {
          setAutoTierAmount(tierAmounts[0] || 0);
        }
      }
    }, [priceData, autoTierAmount, setAutoTierAmount]);
    
    // Ensure stockToUse does not exceed currentStock
    useEffect(() => {
        if (stockToUse > currentStock) {
            setStockToUse(currentStock);
        }
    }, [currentStock, stockToUse, setStockToUse]);


    const calculationInput = useMemo<CalculationInput | null>(() => {
        if (!isJsonValid || !priceData) return null;
        return {
            priceData, boostLevel, sessions, durationPerSession, revenueMode, pricePerUser, userCount, totalRevenue, purchaseMode,
            autoTierAmount, manualQuantities, stockToUse, currentStock,
        };
    }, [
        isJsonValid, priceData, boostLevel, sessions, durationPerSession, revenueMode, pricePerUser, 
        userCount, totalRevenue, purchaseMode, autoTierAmount, manualQuantities, 
        stockToUse, currentStock
    ]);
    
    const calculationResult = useMemo<CalculationResult | null>(() => {
        if (!calculationInput) return null;
        return calculateHpp(calculationInput);
    }, [calculationInput]);
    
    const handleCommitStock = useCallback((newStock: number) => {
        setCurrentStock(newStock);
        setStockToUse(0);
        setManualQuantities({});
    }, [setCurrentStock, setStockToUse, setManualQuantities]);

    const handleExport = () => {
        const data = {
            priceTiers: JSON.parse(jsonString),
            stock: currentStock,
            settings: {
                boostLevel, sessions, durationPerSession, revenueMode, pricePerUser, totalRevenue, purchaseMode, autoTierAmount, stockToUse
            },
            session: {
                userCount, manualQuantities
            }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rbx_hpp_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const data = JSON.parse(text);
                        // Rudimentary validation and setting state
                        if (data.priceTiers) setJsonString(JSON.stringify(data.priceTiers, null, 2));
                        if (typeof data.stock === 'number') setCurrentStock(data.stock);
                        if (data.settings) {
                            setBoostLevel(data.settings.boostLevel || 'x8');
                            setSessions(data.settings.sessions || 1);
                            setDurationPerSession(data.settings.durationPerSession || 3);
                            // ... set other settings
                        }
                        if (data.session) {
                            setUserCount(data.session.userCount || 1);
                            setManualQuantities(data.session.manualQuantities || {});
                        }
                        alert("Data berhasil diimpor!");
                    }
                } catch (error) {
                    alert("Gagal mengimpor data. File mungkin rusak atau formatnya salah.");
                }
            };
            reader.readAsText(file);
        }
    };
    
    const handleResetAllData = () => {
        localStorage.removeItem('rbx.priceTiers.v1');
        localStorage.removeItem('rbx.stock.v1');
        localStorage.removeItem('rbx.settings.v1.boostLevel');
        localStorage.removeItem('rbx.settings.v1.sessions');
        localStorage.removeItem('rbx.settings.v1.durationPerSession');
        localStorage.removeItem('rbx.settings.v1.revenueMode');
        localStorage.removeItem('rbx.settings.v1.pricePerUser');
        localStorage.removeItem('rbx.session.v1.userCount');
        localStorage.removeItem('rbx.settings.v1.totalRevenue');
        localStorage.removeItem('rbx.settings.v1.purchaseMode');
        localStorage.removeItem('rbx.settings.v1.autoTierAmount');
        localStorage.removeItem('rbx.session.v1.manualQty');
        localStorage.removeItem('rbx.settings.v1.stockToUse');
        window.location.reload();
    };

    const handleClearStock = () => {
        localStorage.removeItem('rbx.stock.v1');
        window.location.reload();
    };
    
    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-950">
            <header className="mb-6 sm:mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white">
                    Kalkulator HPP <span className="text-cyan-400">Boost Server Fish it</span>
                </h1>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-400 max-w-3xl mx-auto px-4">
                    Hitung HPP, profit, dan margin boost server Roblox map Fish it.
                </p>
            </header>

            <main className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
                <div className="space-y-6 sm:space-y-8">
                    <JsonEditor jsonString={jsonString} setJsonString={setJsonString} isValid={isJsonValid} error={jsonError} />
                    <PriceTable priceData={priceData} />
                    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg flex flex-wrap gap-2 justify-center">
                        <Button onClick={handleExport}>Export Data</Button>
                        <Button onClick={() => document.getElementById('import-file')?.click()}>Import Data</Button>
                        <input type="file" id="import-file" accept=".json" className="hidden" onChange={handleImport} />
                        <Button variant="secondary" onClick={() => setIsClearStockModalOpen(true)} disabled={currentStock === 0}>Clear Stok Robux</Button>
                        <Button
                            variant="secondary"
                            onClick={() => setIsResetAllModalOpen(true)}
                            className="bg-red-900/50 hover:bg-red-800/50 text-red-300 focus:ring-red-500 border border-red-800 hover:border-red-700"
                        >
                            Reset Semua Data
                        </Button>
                    </div>
                </div>
                <div className="space-y-6 sm:space-y-8">
                    <CalculatorForm
                        priceData={priceData}
                        boostLevel={boostLevel}
                        setBoostLevel={setBoostLevel}
                        sessions={sessions}
                        setSessions={setSessions}
                        durationPerSession={durationPerSession}
                        setDurationPerSession={setDurationPerSession}
                        revenueMode={revenueMode}
                        setRevenueMode={setRevenueMode}
                        pricePerUser={pricePerUser}
                        setPricePerUser={setPricePerUser}
                        userCount={userCount}
                        setUserCount={setUserCount}
                        totalRevenue={totalRevenue}
                        setTotalRevenue={setTotalRevenue}
                        purchaseMode={purchaseMode}
                        setPurchaseMode={setPurchaseMode}
                        autoTierAmount={autoTierAmount}
                        setAutoTierAmount={setAutoTierAmount}
                        // Fix: Corrected typo from `manualQuantologies` to `manualQuantities`.
                        manualQuantities={manualQuantities}
                        setManualQuantities={setManualQuantities}
                        stockToUse={stockToUse}
                        setStockToUse={setStockToUse}
                        currentStock={currentStock}
                        isFormValid={isJsonValid}
                    />
                    <ResultsSummary
                        result={calculationResult}
                        input={calculationInput}
                        currency={priceData?.currency || 'IDR'}
                        unit={priceData?.unit || 'RBX'}
                        onCommitStock={handleCommitStock}
                    />
                </div>
            </main>

            {/* Clear Stock Modal */}
            <Modal
                isOpen={isClearStockModalOpen}
                onClose={() => setIsClearStockModalOpen(false)}
                onConfirm={handleClearStock}
                title="Clear Stok Robux"
                message="Apakah Anda yakin ingin menghapus stok Robux? Aksi ini akan mengatur ulang stok menjadi 0 dan tidak dapat dibatalkan."
                confirmText="Ya, Hapus Stok"
                cancelText="Batal"
                variant="warning"
            />

            {/* Reset All Data Modal */}
            <Modal
                isOpen={isResetAllModalOpen}
                onClose={() => setIsResetAllModalOpen(false)}
                onConfirm={handleResetAllData}
                title="Reset Semua Data"
                message="Apakah Anda yakin ingin mereset semua data? Aksi ini akan menghapus semua pengaturan, stok, dan data yang tersimpan. Tindakan ini tidak dapat dibatalkan."
                confirmText="Ya, Reset Semua"
                cancelText="Batal"
                variant="danger"
            />
        </div>
    );
}

export default App;
