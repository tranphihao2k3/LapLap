'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

interface StatItemProps {
    value: number;
    suffix?: string;
    label: string;
}

export default function StatItem({ value, suffix = '', label }: StatItemProps) {
    const nodeRef = useRef<HTMLDivElement>(null);
    const inView = useInView(nodeRef, { once: true, margin: "-20px" });
    const [displayValue, setDisplayValue] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!inView) return;

        const controls = animate(0, value, {
            duration: 2, // Animation duration in seconds
            ease: "easeOut",
            onUpdate(val) {
                setDisplayValue(Math.floor(val));
            },
            onComplete() {
                setIsComplete(true);
            }
        });

        return () => controls.stop();
    }, [inView, value]);

    return (
        <div ref={nodeRef} className="text-center lg:text-left group">
            <div className={`text-3xl md:text-4xl font-bold transition-all duration-700 ease-out transform ${isComplete ? 'text-cyan-400 scale-110 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-white scale-100'
                }`}>
                {displayValue}{suffix}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-wider text-blue-200/80 font-bold mt-1 group-hover:text-white transition-colors">
                {label}
            </div>
        </div>
    );
}
