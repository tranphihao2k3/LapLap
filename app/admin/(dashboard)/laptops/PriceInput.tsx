'use client';

import { useState, useEffect } from 'react';

interface PriceInputProps {
    value: number; // Value in VND (full price)
    onChange: (value: number) => void;
    label?: string;
    placeholder?: string;
}

export default function PriceInput({
    value,
    onChange,
    label = 'Giá',
    placeholder = 'Nhập giá (nghìn đồng)...',
}: PriceInputProps) {
    // Convert VND to thousands (9900000 -> 9900)
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        if (value > 0) {
            setDisplayValue((value / 1000).toString());
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // Only allow numbers
        const numericValue = input.replace(/[^0-9]/g, '');

        setDisplayValue(numericValue);

        // Convert thousands to VND (9900 -> 9900000)
        const priceInVND = numericValue ? parseInt(numericValue) * 1000 : 0;
        onChange(priceInVND);
    };

    // Format display with thousand separators
    const formatDisplay = (val: string) => {
        if (!val) return '';
        return parseInt(val).toLocaleString('vi-VN');
    };

    // Format preview in VND
    const formatPreview = () => {
        if (!displayValue) return '0đ';
        const priceInVND = parseInt(displayValue) * 1000;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(priceInVND);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                    x 1.000đ
                </div>
            </div>
            {displayValue && (
                <p className="text-sm text-gray-600 mt-1">
                    = <span className="font-semibold text-blue-600">{formatPreview()}</span>
                </p>
            )}
        </div>
    );
}
