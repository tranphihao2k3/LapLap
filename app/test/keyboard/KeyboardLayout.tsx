'use client';

interface Key {
    key: string;
    code: string;
    label: string;
    width?: number;
}

interface KeyboardLayoutProps {
    pressedKeys: Set<string>;
    testedKeys: Set<string>;
    osType: string;
}

const KeyboardLayout: React.FC<KeyboardLayoutProps> = ({ pressedKeys, testedKeys, osType }) => {
    // Main keyboard section
    const mainKeyboard: Key[][] = [
        // Row 1 - Function keys
        [
            { key: 'Escape', code: 'Escape', label: 'Esc' },
            { key: 'F1', code: 'F1', label: 'F1' },
            { key: 'F2', code: 'F2', label: 'F2' },
            { key: 'F3', code: 'F3', label: 'F3' },
            { key: 'F4', code: 'F4', label: 'F4' },
            { key: 'F5', code: 'F5', label: 'F5' },
            { key: 'F6', code: 'F6', label: 'F6' },
            { key: 'F7', code: 'F7', label: 'F7' },
            { key: 'F8', code: 'F8', label: 'F8' },
            { key: 'F9', code: 'F9', label: 'F9' },
            { key: 'F10', code: 'F10', label: 'F10' },
            { key: 'F11', code: 'F11', label: 'F11' },
            { key: 'F12', code: 'F12', label: 'F12' },
        ],
        // Row 2 - Number row
        [
            { key: '`', code: 'Backquote', label: '`' },
            { key: '1', code: 'Digit1', label: '1' },
            { key: '2', code: 'Digit2', label: '2' },
            { key: '3', code: 'Digit3', label: '3' },
            { key: '4', code: 'Digit4', label: '4' },
            { key: '5', code: 'Digit5', label: '5' },
            { key: '6', code: 'Digit6', label: '6' },
            { key: '7', code: 'Digit7', label: '7' },
            { key: '8', code: 'Digit8', label: '8' },
            { key: '9', code: 'Digit9', label: '9' },
            { key: '0', code: 'Digit0', label: '0' },
            { key: '-', code: 'Minus', label: '-' },
            { key: '=', code: 'Equal', label: '=' },
            { key: 'Backspace', code: 'Backspace', label: 'Backspace', width: 2 },
        ],
        // Row 3 - QWERTY row
        [
            { key: 'Tab', code: 'Tab', label: 'Tab', width: 1.5 },
            { key: 'Q', code: 'KeyQ', label: 'Q' },
            { key: 'W', code: 'KeyW', label: 'W' },
            { key: 'E', code: 'KeyE', label: 'E' },
            { key: 'R', code: 'KeyR', label: 'R' },
            { key: 'T', code: 'KeyT', label: 'T' },
            { key: 'Y', code: 'KeyY', label: 'Y' },
            { key: 'U', code: 'KeyU', label: 'U' },
            { key: 'I', code: 'KeyI', label: 'I' },
            { key: 'O', code: 'KeyO', label: 'O' },
            { key: 'P', code: 'KeyP', label: 'P' },
            { key: '[', code: 'BracketLeft', label: '[' },
            { key: ']', code: 'BracketRight', label: ']' },
            { key: '\\', code: 'Backslash', label: '\\', width: 1.5 },
        ],
        // Row 4 - ASDF row
        [
            { key: 'CapsLock', code: 'CapsLock', label: 'Caps', width: 1.75 },
            { key: 'A', code: 'KeyA', label: 'A' },
            { key: 'S', code: 'KeyS', label: 'S' },
            { key: 'D', code: 'KeyD', label: 'D' },
            { key: 'F', code: 'KeyF', label: 'F' },
            { key: 'G', code: 'KeyG', label: 'G' },
            { key: 'H', code: 'KeyH', label: 'H' },
            { key: 'J', code: 'KeyJ', label: 'J' },
            { key: 'K', code: 'KeyK', label: 'K' },
            { key: 'L', code: 'KeyL', label: 'L' },
            { key: ';', code: 'Semicolon', label: ';' },
            { key: "'", code: 'Quote', label: "'" },
            { key: 'Enter', code: 'Enter', label: 'Enter', width: 2.25 },
        ],
        // Row 5 - ZXCV row
        [
            { key: 'ShiftLeft', code: 'ShiftLeft', label: 'Shift', width: 2.25 },
            { key: 'Z', code: 'KeyZ', label: 'Z' },
            { key: 'X', code: 'KeyX', label: 'X' },
            { key: 'C', code: 'KeyC', label: 'C' },
            { key: 'V', code: 'KeyV', label: 'V' },
            { key: 'B', code: 'KeyB', label: 'B' },
            { key: 'N', code: 'KeyN', label: 'N' },
            { key: 'M', code: 'KeyM', label: 'M' },
            { key: ',', code: 'Comma', label: ',' },
            { key: '.', code: 'Period', label: '.' },
            { key: '/', code: 'Slash', label: '/' },
            { key: 'ShiftRight', code: 'ShiftRight', label: 'Shift', width: 2.75 },
        ],
        // Row 6 - Bottom row
        [
            { key: 'ControlLeft', code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
            { key: 'MetaLeft', code: 'MetaLeft', label: osType === 'Mac' ? 'Cmd' : 'Win', width: 1.25 },
            { key: 'AltLeft', code: 'AltLeft', label: osType === 'Mac' ? 'Opt' : 'Alt', width: 1.25 },
            { key: ' ', code: 'Space', label: '', width: 6.25 },
            { key: 'AltRight', code: 'AltRight', label: osType === 'Mac' ? 'Opt' : 'Alt', width: 1.25 },
            { key: 'MetaRight', code: 'MetaRight', label: osType === 'Mac' ? 'Cmd' : 'Win', width: 1.25 },
            { key: 'ContextMenu', code: 'ContextMenu', label: 'Menu', width: 1.25 },
            { key: 'ControlRight', code: 'ControlRight', label: 'Ctrl', width: 1.25 },
        ],
    ];

    // Navigation cluster
    const navCluster: Key[][] = [
        [
            { key: 'PrintScreen', code: 'PrintScreen', label: 'PrtSc' },
            { key: 'ScrollLock', code: 'ScrollLock', label: 'ScrLk' },
            { key: 'Pause', code: 'Pause', label: 'Pause' },
        ],
        [],
        [
            { key: 'Insert', code: 'Insert', label: 'Ins' },
            { key: 'Home', code: 'Home', label: 'Home' },
            { key: 'PageUp', code: 'PageUp', label: 'PgUp' },
        ],
        [
            { key: 'Delete', code: 'Delete', label: 'Del' },
            { key: 'End', code: 'End', label: 'End' },
            { key: 'PageDown', code: 'PageDown', label: 'PgDn' },
        ],
        [],
        [
            { key: '', code: '', label: '' },
            { key: 'ArrowUp', code: 'ArrowUp', label: '↑' },
            { key: '', code: '', label: '' },
        ],
        [
            { key: 'ArrowLeft', code: 'ArrowLeft', label: '←' },
            { key: 'ArrowDown', code: 'ArrowDown', label: '↓' },
            { key: 'ArrowRight', code: 'ArrowRight', label: '→' },
        ],
    ];

    // Numpad
    const numpad: Key[][] = [
        [
            { key: 'NumLock', code: 'NumLock', label: 'Num' },
            { key: 'NumpadDivide', code: 'NumpadDivide', label: '/' },
            { key: 'NumpadMultiply', code: 'NumpadMultiply', label: '*' },
            { key: 'NumpadSubtract', code: 'NumpadSubtract', label: '-' },
        ],
        [],
        [
            { key: 'Numpad7', code: 'Numpad7', label: '7' },
            { key: 'Numpad8', code: 'Numpad8', label: '8' },
            { key: 'Numpad9', code: 'Numpad9', label: '9' },
            { key: 'NumpadAdd', code: 'NumpadAdd', label: '+', width: 1 },
        ],
        [
            { key: 'Numpad4', code: 'Numpad4', label: '4' },
            { key: 'Numpad5', code: 'Numpad5', label: '5' },
            { key: 'Numpad6', code: 'Numpad6', label: '6' },
        ],
        [
            { key: 'Numpad1', code: 'Numpad1', label: '1' },
            { key: 'Numpad2', code: 'Numpad2', label: '2' },
            { key: 'Numpad3', code: 'Numpad3', label: '3' },
            { key: 'NumpadEnter', code: 'NumpadEnter', label: 'Ent', width: 1 },
        ],
        [
            { key: 'Numpad0', code: 'Numpad0', label: '0', width: 2 },
            { key: 'NumpadDecimal', code: 'NumpadDecimal', label: '.' },
        ],
    ];

    const getKeyWidth = (width: number = 1) => {
        const baseWidth = 48;
        return `${baseWidth * width + (width - 1) * 4}px`;
    };

    const renderKey = (keyData: Key, index: number) => {
        if (!keyData.code) {
            return <div key={index} style={{ width: getKeyWidth(keyData.width) }} className="h-12" />;
        }

        const isPressed = pressedKeys.has(keyData.code);
        const isTested = testedKeys.has(keyData.code);

        let className = 'h-12 flex items-center justify-center rounded border-2 text-sm font-medium transition-all ';

        if (isPressed) {
            // Currently being pressed - blue with shadow
            className += 'bg-blue-500 text-white border-blue-600 shadow-lg scale-95';
        } else if (isTested) {
            // Has been tested - green
            className += 'bg-green-500 text-white border-green-600';
        } else {
            // Not tested yet - gray
            className += 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
        }

        return (
            <div
                key={keyData.code}
                style={{ width: getKeyWidth(keyData.width) }}
                className={className}
            >
                {keyData.label}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded">
                        <span className="font-semibold">Shift</span>
                        <span className="font-semibold">Win</span>
                    </div>
                    <span className="text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">{pressedKeys.size}</span> keys
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-flex gap-4">
                    {/* Main Keyboard */}
                    <div>
                        {mainKeyboard.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-1 mb-1">
                                {row.map((keyData, keyIndex) => renderKey(keyData, keyIndex))}
                            </div>
                        ))}
                    </div>

                    {/* Navigation Cluster */}
                    <div>
                        {navCluster.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-1 mb-1 h-12">
                                {row.length > 0 ? row.map((keyData, keyIndex) => renderKey(keyData, keyIndex)) : <div className="h-12" />}
                            </div>
                        ))}
                    </div>

                    {/* Numpad */}
                    <div>
                        {numpad.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-1 mb-1 h-12">
                                {row.length > 0 ? row.map((keyData, keyIndex) => renderKey(keyData, keyIndex)) : <div className="h-12" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyboardLayout;
