'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KeyboardLayout from './KeyboardLayout';
import KeyStats from './KeyStats';
import PerformanceMonitor from './PerformanceMonitor';
import ControlPanel from './ControlPanel';

export default function KeyboardTestPage() {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
    const [totalPresses, setTotalPresses] = useState(0);
    const [keyPressCount, setKeyPressCount] = useState<Map<string, number>>(new Map());
    const [lastKeyCode, setLastKeyCode] = useState('');
    const [lastPressTime, setLastPressTime] = useState(0);
    const [lastInterval, setLastInterval] = useState(0);
    const [scanRate, setScanRate] = useState(0);
    const [pressHistory, setPressHistory] = useState<number[]>(new Array(60).fill(0));
    const [cps, setCps] = useState(0);
    const [apm, setApm] = useState(0);

    // Control panel states
    const [osType, setOsType] = useState('Windows');

    // Handle key down
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        e.preventDefault();

        const now = Date.now();

        setPressedKeys((prev) => {
            const newSet = new Set(prev);
            newSet.add(e.code);
            return newSet;
        });

        // Mark key as tested
        setTestedKeys((prev) => {
            const newSet = new Set(prev);
            newSet.add(e.code);
            return newSet;
        });

        setTotalPresses((prev) => prev + 1);

        setKeyPressCount((prev) => {
            const newMap = new Map(prev);
            newMap.set(e.code, (newMap.get(e.code) || 0) + 1);
            return newMap;
        });

        setLastKeyCode(e.code);

        if (lastPressTime > 0) {
            const interval = now - lastPressTime;
            setLastInterval(interval);
            setScanRate(Math.round(1000 / interval));
        }

        setLastPressTime(now);

        // Update press history for graph
        setPressHistory((prev) => {
            const newHistory = [...prev.slice(1), prev[prev.length - 1] + 1];
            return newHistory;
        });
    }, [lastPressTime]);

    // Handle key up
    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        e.preventDefault();

        setPressedKeys((prev) => {
            const newSet = new Set(prev);
            newSet.delete(e.code);
            return newSet;
        });
    }, []);

    // Update CPS and APM every second
    useEffect(() => {
        const interval = setInterval(() => {
            setPressHistory((prev) => {
                const newHistory = [...prev.slice(1), 0];

                // Calculate CPS (last second)
                const lastSecondPresses = prev[prev.length - 1];
                setCps(lastSecondPresses);

                // Calculate APM (average over last 60 seconds)
                const totalPresses = newHistory.reduce((sum, val) => sum + val, 0);
                setApm(totalPresses);

                return newHistory;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    // Get most pressed key
    const getMostPressed = () => {
        if (keyPressCount.size === 0) return '';

        let maxKey = '';
        let maxCount = 0;

        keyPressCount.forEach((count, key) => {
            if (count > maxCount) {
                maxCount = count;
                maxKey = key;
            }
        });

        return maxKey;
    };

    // Reset function
    const handleReset = () => {
        setPressedKeys(new Set());
        setTestedKeys(new Set());
        setTotalPresses(0);
        setKeyPressCount(new Map());
        setLastKeyCode('');
        setLastPressTime(0);
        setLastInterval(0);
        setScanRate(0);
        setPressHistory(new Array(60).fill(0));
        setCps(0);
        setApm(0);
    };

    return (
        <>
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Header with Back Button */}
                <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                        ⌨️ Keyboard Tester
                    </h1>
                    <a
                        href="/test"
                        className="text-sm px-4 py-2 border border-blue-400 text-blue-600 rounded hover:bg-blue-50 transition"
                    >
                        ← Quay lại
                    </a>
                </div>

                <ControlPanel
                    osType={osType}
                    onOsChange={setOsType}
                    onReset={handleReset}
                />

                <KeyboardLayout pressedKeys={pressedKeys} testedKeys={testedKeys} osType={osType} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <KeyStats
                        activeKeys={pressedKeys.size}
                        totalPresses={totalPresses}
                        mostPressed={getMostPressed()}
                        lastKeyCode={lastKeyCode}
                        scanRate={scanRate}
                        lastInterval={lastInterval}
                    />

                    <PerformanceMonitor
                        cps={cps}
                        apm={apm}
                        history={pressHistory}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
