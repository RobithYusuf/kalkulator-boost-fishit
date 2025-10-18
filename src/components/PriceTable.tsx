
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { RobuxPriceData } from '../types';

interface PriceTableProps {
    priceData: RobuxPriceData | null;
}

const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(value);
};

export const PriceTable: React.FC<PriceTableProps> = ({ priceData }) => {

    const isUnitPriceFixed = useMemo(() => {
        if (!priceData || priceData.tiers.length < 2) return true;
        const firstUnitPrice = priceData.tiers[0].price / priceData.tiers[0].amount;
        return priceData.tiers.every(tier => (tier.price / tier.amount) === firstUnitPrice);
    }, [priceData]);

    if (!priceData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tabel Harga Robux</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400">Data JSON tidak valid atau belum dimasukkan.</p>
                </CardContent>
            </Card>
        );
    }
    
    const { currency, unit, tiers } = priceData;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Tabel Harga Robux</CardTitle>
                    {isUnitPriceFixed && (
                        <span className="text-xs font-medium bg-cyan-900 text-cyan-200 px-2 py-1 rounded-full">
                            Unit Price Fixed
                        </span>
                    )}
                </div>
                <CardDescription>Harga berdasarkan data JSON yang Anda berikan.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Amount ({unit})</th>
                                <th scope="col" className="px-6 py-3">Harga ({currency})</th>
                                <th scope="col" className="px-6 py-3">Harga per {unit}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tiers.map((tier) => (
                                <tr key={tier.amount} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">{tier.amount.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4">{formatCurrency(tier.price, currency)}</td>
                                    <td className="px-6 py-4">{formatCurrency(tier.price / tier.amount, currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};
