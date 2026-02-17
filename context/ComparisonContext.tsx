"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ProductSummary {
    _id: string;
    name: string;
    image: string;
    price: number;
    slug?: string;
    specs: {
        cpu: string;
        gpu: string;
        ram: string;
        ssd: string;
        screen: string;
        battery: string;
    };
}

interface ComparisonContextType {
    selectedProducts: ProductSummary[];
    addToCompare: (product: ProductSummary) => void;
    removeFromCompare: (productId: string) => void;
    clearComparison: () => void;
    isOpen: boolean;
    toggleOpen: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
    const [selectedProducts, setSelectedProducts] = useState<ProductSummary[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("comparison_products");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setSelectedProducts(parsed);
                    if (parsed.length > 0) setIsOpen(true);
                }
            } catch (e) {
                console.error("Failed to parse comparison data", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("comparison_products", JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    const addToCompare = (product: ProductSummary) => {
        if (selectedProducts.some((p) => p._id === product._id)) {
            // Already exists, maybe notify user?
            return;
        }
        if (selectedProducts.length >= 4) {
            alert("Bạn chỉ có thể so sánh tối đa 4 sản phẩm.");
            return;
        }
        setSelectedProducts((prev) => [...prev, product]);
        setIsOpen(true);
    };

    const removeFromCompare = (productId: string) => {
        setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
    };

    const clearComparison = () => {
        setSelectedProducts([]);
        setIsOpen(false);
    };

    const toggleOpen = () => setIsOpen((prev) => !prev);

    return (
        <ComparisonContext.Provider
            value={{
                selectedProducts,
                addToCompare,
                removeFromCompare,
                clearComparison,
                isOpen,
                toggleOpen,
            }}
        >
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error("useComparison must be used within a ComparisonProvider");
    }
    return context;
}
