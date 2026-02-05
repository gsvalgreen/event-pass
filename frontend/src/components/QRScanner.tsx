import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { api } from '../services/api';

interface QRScannerProps {
    onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onClose }) => {
    const [scanResult, setScanResult] = useState<{ status: 'idle' | 'success' | 'error'; message?: string; data?: any }>({ status: 'idle' });
    const [scanning, setScanning] = useState(true);

    const handleScan = async (result: any, error: any) => {
        if (!scanning) return;

        if (result) {
            setScanning(false);
            const token = result?.text || result; // react-qr-reader versions differ, checking both

            try {
                const { data } = await api.post('/tickets/validate', { token });
                setScanResult({
                    status: 'success',
                    message: 'Valid Ticket',
                    data: data.ticket
                });

                // Auto reset after 3 seconds for next scan
                setTimeout(() => {
                    setScanResult({ status: 'idle' });
                    setScanning(true);
                }, 3000);

            } catch (err: any) {
                setScanResult({
                    status: 'error',
                    message: err.response?.data?.message || 'Invalid Ticket'
                });

                // Auto reset after 3 seconds
                setTimeout(() => {
                    setScanResult({ status: 'idle' });
                    setScanning(true);
                }, 3000);
            }
        }
    };

    const bgColor = {
        idle: 'bg-black',
        success: 'bg-emerald-600',
        error: 'bg-rose-600',
    }[scanResult.status];

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${bgColor} transition-colors duration-500`}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full">
                ✕ Close
            </button>

            <div className="w-full max-w-sm aspect-square relative">
                {scanResult.status === 'idle' && (
                    <div className="border-4 border-white/30 rounded-lg overflow-hidden relative">
                        {/* Note: In a real browser, this requires HTTPS or localhost */}
                        <QrReader
                            onResult={handleScan}
                            constraints={{ facingMode: 'environment' }}
                            className="w-full h-full"
                            containerStyle={{ width: '100%', paddingTop: '100%' }}
                            videoStyle={{ objectFit: 'cover' }}
                        />
                        <div className="absolute inset-0 border-2 border-primary animate-pulse opacity-50 pointer-events-none"></div>
                    </div>
                )}
            </div>

            <div className="mt-8 text-white text-center px-4">
                {scanResult.status === 'idle' && (
                    <p className="text-xl animate-bounce">Point camera at QR Code</p>
                )}
                {scanResult.status === 'success' && (
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold mb-2">✅ APPROVED</h2>
                        <p className="text-xl">{scanResult.data?.user?.email}</p>
                        <p>{scanResult.data?.event?.name}</p>
                    </div>
                )}
                {scanResult.status === 'error' && (
                    <div>
                        <h2 className="text-4xl font-bold mb-2">❌ DENIED</h2>
                        <p className="text-xl">{scanResult.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
