'use client';

interface ControlPanelProps {
    osType: string;
    onOsChange: (os: string) => void;
    onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    osType,
    onOsChange,
    onReset,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* OS Type */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">OS</span>
                    <div className="flex gap-2">
                        {['Windows', 'Mac'].map((os) => (
                            <button
                                key={os}
                                onClick={() => onOsChange(os)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${osType === os
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {os}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reset Button */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">ACTION</span>
                    <button
                        onClick={onReset}
                        className="px-4 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
