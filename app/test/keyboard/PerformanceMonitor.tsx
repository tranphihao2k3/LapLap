'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
    cps: number;
    apm: number;
    history: number[];
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ cps, apm, history }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw graph
        if (history.length > 1) {
            const maxValue = Math.max(...history, 10);
            const stepX = canvas.width / (history.length - 1);

            ctx.beginPath();
            ctx.fillStyle = '#93c5fd';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;

            // Start from bottom left
            ctx.moveTo(0, canvas.height);

            history.forEach((value, index) => {
                const x = index * stepX;
                const y = canvas.height - (value / maxValue) * canvas.height;
                ctx.lineTo(x, y);
            });

            // Complete the path to bottom right
            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();
            ctx.fill();

            // Draw line on top
            ctx.beginPath();
            history.forEach((value, index) => {
                const x = index * stepX;
                const y = canvas.height - (value / maxValue) * canvas.height;
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        }
    }, [history]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Monitor</h3>
            <div className="flex justify-end gap-6 mb-4">
                <div className="text-right">
                    <p className="text-sm text-gray-600">CPS</p>
                    <p className="text-2xl font-bold text-blue-600">{cps}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">APM</p>
                    <p className="text-2xl font-bold text-blue-600">{apm}</p>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full h-32 rounded"
            />
        </div>
    );
};

export default PerformanceMonitor;
