'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    label: string;
}

export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = 'Chọn hoặc nhập...',
    label,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Update input value when prop value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        setInputValue(option);
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setSearchTerm(newValue);
        onChange(newValue);
        setIsOpen(true);
    };

    const handleClear = () => {
        setInputValue('');
        onChange('');
        setSearchTerm('');
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={16} className="text-gray-400" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        <ul className="py-1">
                            {filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(option)}
                                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                            {searchTerm ? (
                                <span>
                                    Không tìm thấy. Nhấn Enter để sử dụng: <strong>{searchTerm}</strong>
                                </span>
                            ) : (
                                'Nhập để tìm kiếm hoặc thêm mới...'
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
