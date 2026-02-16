'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'white'
    | 'glass'
    | 'facebook'
    | 'zalo'
    | 'danger';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    rounded?: ButtonRounded;
    leftIcon?: LucideIcon | React.ReactNode;
    rightIcon?: LucideIcon | React.ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
    href?: string;
    className?: string;
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            rounded = 'xl',
            leftIcon,
            rightIcon,
            isLoading,
            fullWidth,
            href,
            className = '',
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const variants = {
            primary: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700',
            secondary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700',
            outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
            ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
            white: 'bg-white text-blue-600 shadow-xl hover:bg-gray-50',
            glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
            facebook: 'bg-[#1877F2] text-white shadow-lg shadow-blue-600/20 hover:bg-[#166fe5]',
            zalo: 'bg-white text-[#0068FF] shadow-lg border border-gray-100 hover:bg-gray-50',
            danger: 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600',
        };

        const sizes = {
            xs: 'px-3 py-1.5 text-xs',
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
            xl: 'px-10 py-5 text-xl font-black uppercase tracking-wider',
        };

        const roundedClasses = {
            none: 'rounded-none',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            '2xl': 'rounded-2xl',
            '3xl': 'rounded-3xl',
            full: 'rounded-full',
        };

        const baseStyles = `inline-flex items-center justify-center gap-3 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100`;

        const combinedClassName = `
      ${baseStyles} 
      ${variants[variant]} 
      ${sizes[size]} 
      ${roundedClasses[rounded]} 
      ${fullWidth ? 'w-full' : ''} 
      ${className}
    `.trim();

        const IconRenderer = ({ icon }: { icon: LucideIcon | React.ReactNode }) => {
            if (!icon) return null;
            if (typeof icon === 'function') {
                const Icon = icon as LucideIcon;
                return <Icon className="w-5 h-5" />;
            }
            return <>{icon}</>;
        };

        const content = (
            <>
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                <IconRenderer icon={leftIcon} />
                {children}
                <IconRenderer icon={rightIcon} />
            </>
        );

        if (href) {
            return (
                <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={fullWidth ? 'w-full' : 'inline-block'}
                >
                    <Link href={href} className={combinedClassName}>
                        {content}
                    </Link>
                </motion.div>
            );
        }

        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={combinedClassName}
                disabled={disabled || isLoading}
                {...(props as any)}
            >
                {content}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
