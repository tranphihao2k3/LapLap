'use client';

interface KeyStatsProps {
    activeKeys: number;
    totalPresses: number;
    mostPressed: string;
    lastKeyCode: string;
    scanRate: number;
    lastInterval: number;
}

const KeyStats: React.FC<KeyStatsProps> = ({
    activeKeys,
    totalPresses,
    mostPressed,
    lastKeyCode,
    scanRate,
    lastInterval,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-600">Active Keys</p>
                    <p className="text-3xl font-bold text-blue-600">{activeKeys}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Total Presses</p>
                    <p className="text-3xl font-bold text-blue-600">{totalPresses}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Most Pressed</p>
                    <p className="text-xl font-bold">{mostPressed || '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Last Key Code</p>
                    <p className="text-xl font-bold font-mono">{lastKeyCode || '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Est. Scan Rate</p>
                    <p className="text-xl font-bold">{scanRate} Hz</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Last Interval</p>
                    <p className="text-xl font-bold">{lastInterval.toFixed(1)} ms</p>
                </div>
            </div>
        </div>
    );
};

export default KeyStats;
