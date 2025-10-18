import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { RobuxPriceData } from '../types';
import { DEFAULT_ROBUX_PRICE_JSON } from '../constants';

interface JsonEditorProps {
    jsonString: string;
    setJsonString: (value: string) => void;
    isValid: boolean;
    error: string | null;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ jsonString, setJsonString, isValid, error }) => {
    
    const handleRestoreDefault = () => {
        setJsonString(JSON.stringify(DEFAULT_ROBUX_PRICE_JSON, null, 2));
    };

    const handleCopyAiPrompt = () => {
        const prompt = `
Tolong ubah daftar harga Robux saya ke dalam format JSON yang benar, berdasarkan struktur dan contoh berikut.

Contoh Struktur JSON:
\`\`\`json
${JSON.stringify(DEFAULT_ROBUX_PRICE_JSON, null, 2)}
\`\`\`

Sekarang, ubah daftar harga ini:
"[SALIN DAN TEMPEL DAFTAR HARGA ANDA YANG BERANTAKAN DI SINI, contoh: 500 RBX = 68.000, 1000 RBX = 136.000]"
        `.trim();

        navigator.clipboard.writeText(prompt);
        alert('Prompt untuk AI telah disalin ke clipboard!');
    };


    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <CardTitle>Harga Robux (JSON)</CardTitle>
                        <CardDescription>Edit data harga paket Robux di bawah ini.</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                         <Button variant="ghost" size="sm" onClick={handleCopyAiPrompt} className="gap-2 justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z"/><path d="M5 21L6 17"/><path d="M19 21L18 17"/></svg>
                            Copy AI Prompt
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleRestoreDefault}>
                            Restore Default
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <textarea
                    value={jsonString}
                    onChange={(e) => setJsonString(e.target.value)}
                    className={`w-full h-64 p-2 font-mono text-sm bg-gray-950 border rounded-md focus:ring-2 focus:outline-none transition-colors ${isValid ? 'border-gray-700 focus:ring-cyan-500' : 'border-red-500 focus:ring-red-500'}`}
                    placeholder="Enter Robux price data as JSON..."
                />
                {!isValid && error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
            </CardContent>
        </Card>
    );
};