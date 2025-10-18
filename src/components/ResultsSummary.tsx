import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { CalculationInput, CalculationResult } from '../types';

interface ResultsSummaryProps {
  result: CalculationResult | null;
  input: CalculationInput | null;
  currency: string;
  unit: string;
  onCommitStock: (newStock: number) => void;
}

const formatCurrency = (value: number, currency: string) => {
    if (isNaN(value)) return `0 ${currency}`;
    const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency, minimumFractionDigits: 0 }).format(value);
    return value < 0 ? `- ${formatted.replace('-', '')}` : formatted;
};

const MetricCard: React.FC<{ title: string; value: string; subvalue?: string; color?: string }> = ({ title, value, subvalue, color = 'text-gray-100' }) => (
    <div className="bg-gray-800 p-3 sm:p-4 rounded-lg text-center">
        <p className="text-xs sm:text-sm text-gray-400 mb-1">{title}</p>
        <p className={`text-sm sm:text-base lg:text-lg font-bold break-words ${color}`}>{value}</p>
        {subvalue && <p className="text-xs text-gray-500 mt-1">{subvalue}</p>}
    </div>
);

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result, input, currency, unit, onCommitStock }) => {
    if (!result || !input) {
        return (
            <Card>
                <CardHeader><CardTitle>Ringkasan Hasil</CardTitle></CardHeader>
                <CardContent><p className="text-gray-400">Hasil akan ditampilkan di sini setelah input diisi.</p></CardContent>
            </Card>
        );
    }
    
    if (result.error) {
         return (
            <Card>
                <CardHeader><CardTitle>Ringkasan Hasil</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <p>{result.error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    const profitColor = result.profit >= 0 ? 'text-green-400' : 'text-red-400';
    const marginColor = result.margin >= 0 ? 'text-green-400' : 'text-red-400';

    const copyToClipboard = () => {
        const totalDuration = input.durationPerSession * input.sessions;
        const sessionDetail = `${input.sessions} Sesi x ${input.durationPerSession} jam/sesi`;

        const inputSummaryLines = [
            `PENGATURAN INPUT`,
            `--------------------------------------------`,
            `Level Boost: ${input.boostLevel.toUpperCase()} Boost`,
            `Durasi Total: ${totalDuration} jam (${sessionDetail})`,
        ];

        if (input.revenueMode === 'perUser') {
            inputSummaryLines.push(`Harga per User: ${formatCurrency(input.pricePerUser, currency)}`);
            inputSummaryLines.push(`Jumlah User: ${input.userCount}`);
        } else {
            inputSummaryLines.push(`Omset Total: ${formatCurrency(input.totalRevenue, currency)}`);
        }

        if (input.purchaseMode === 'auto') {
            inputSummaryLines.push(`Tier Dipilih: ${input.autoTierAmount.toLocaleString('id-ID')} ${unit}`);
        }

        const inputSummary = inputSummaryLines.join('\n');


        const resultSummary = [
            `HASIL KALKULASI`,
            `--------------------------------------------`,
            `Omset: ${formatCurrency(result.revenue, currency)}`,
            `HPP: ${formatCurrency(result.hpp, currency)}`,
            `Profit Bersih: ${formatCurrency(result.profit, currency)}`,
            `Margin Bersih: ${result.margin.toFixed(2)}%`,
            `--------------------------------------------`,
            `Total Kebutuhan: ${result.totalRobuxNeeded.toLocaleString('id-ID')} ${unit}`,
            `Total Robux dari Paket: ${result.totalRobuxPurchased.toLocaleString('id-ID')} ${unit}`,
            `Total Stok Baru: ${result.newStock.toLocaleString('id-ID')} ${unit}`
        ].join('\n');

        const text = `${inputSummary}\n\n${resultSummary}`.trim();

        navigator.clipboard.writeText(text);
        alert('Hasil dan detail input disalin ke clipboard!');
    };


    const totalDuration = input.durationPerSession * input.sessions;
    const exampleDoubleDuration = totalDuration * 2;
    const exampleRobuxNeeded = result.totalRobuxNeeded * 2;


    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Ringkasan Hasil</CardTitle>
                    <Button variant="ghost" onClick={copyToClipboard} className="gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                        Salin Hasil
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <MetricCard title="Omset" value={formatCurrency(result.revenue, currency)} />
                    <MetricCard title="HPP" value={formatCurrency(result.hpp, currency)} />
                    <MetricCard title="Profit Bersih" value={formatCurrency(result.profit, currency)} color={profitColor} />
                    <MetricCard title="Margin Bersih" value={`${result.margin.toFixed(2)}%`} color={marginColor} />
                </div>

                {result.infoMessage && (
                    <div className="flex items-start gap-3 bg-cyan-900/50 border border-cyan-500/50 text-cyan-200 p-4 rounded-lg text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 w-5 h-5 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <p>{result.infoMessage}</p>
                    </div>
                )}

                <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Rincian Perhitungan</h3>
                    <div className="space-y-2 text-sm bg-gray-900 p-4 rounded-lg">
                        <div className="flex justify-between"><span className="text-gray-400">Total Kebutuhan {unit}</span><span>{result.totalRobuxNeeded.toLocaleString('id-ID')}</span></div>
                        {result.robuxFromStock > 0 && <div className="flex justify-between"><span className="text-gray-400">Digunakan dari Stok</span><span className="text-cyan-400">-{result.robuxFromStock.toLocaleString('id-ID')}</span></div>}
                        <hr className="border-gray-700 my-1" />
                        <div className="flex justify-between font-semibold"><span className="text-gray-400">{unit} yang Harus Dibeli</span><span>{result.robuxToBuy.toLocaleString('id-ID')}</span></div>
                        <hr className="border-gray-700 my-1" />
                        <div className="flex justify-between"><span className="text-gray-400">Total {unit} dari Paket Dibeli</span><span>{result.totalRobuxPurchased.toLocaleString('id-ID')}</span></div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Rincian Paket Dibeli</h3>
                     <div className="space-y-2 text-sm bg-gray-900 p-4 rounded-lg">
                        {result.purchasedPackages.length > 0 ? (
                           result.purchasedPackages.map((p, i) => (
                               <div key={i} className="flex justify-between">
                                   <span className="text-gray-400">{p.quantity} x {p.tier.amount} {unit}</span>
                                   <span>{formatCurrency(p.quantity * p.tier.price, currency)}</span>
                               </div>
                           ))
                        ) : (
                           <p className="text-gray-400 text-center">Tidak ada pembelian paket baru (kebutuhan terpenuhi dari stok).</p>
                        )}
                        <hr className="border-gray-700 my-2" />
                        <div className="flex justify-between font-bold"><span>Total Cash Out (HPP)</span><span>{formatCurrency(result.hpp, currency)}</span></div>
                     </div>
                </div>

                <div className={`p-4 rounded-lg transition-all ${result.newStock > 0 ? 'bg-cyan-900/50 border border-cyan-500/50' : 'bg-gray-800'}`}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-center sm:text-left">
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold">Total Stok {unit} Setelah Transaksi</h4>
                            <p className="text-2xl sm:text-3xl font-bold">{result.newStock.toLocaleString('id-ID')}</p>
                            <p className="text-xs text-gray-400">
                                Sisa dari pembelian baru: {result.leftoverRobux.toLocaleString('id-ID')} {unit}
                            </p>
                        </div>
                        {result.newStock > 0 && (
                            <Button onClick={() => onCommitStock(result.newStock)} className="w-full sm:w-auto">
                                Simpan {result.newStock.toLocaleString('id-ID')} ke Stok
                            </Button>
                        )}
                    </div>
                </div>
                 
                 {totalDuration > 0 && (
                    <div className="text-center p-3 bg-gray-800 rounded-md">
                        <p className="text-sm text-gray-400">
                           Tip: Untuk order selama <strong>{exampleDoubleDuration} jam</strong>, estimasi kebutuhan {unit} akan menjadi ~<strong>{exampleRobuxNeeded.toLocaleString('id-ID')} {unit}</strong>.
                        </p>
                    </div>
                 )}

            </CardContent>
        </Card>
    );
};