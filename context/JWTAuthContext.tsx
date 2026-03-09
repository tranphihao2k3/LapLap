/**
 * JWT Authentication Context
 * Manages JWT token lifecycle and user authentication
 * Replaces NextAuth with stateless JWT authentication from NexGear
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { LoginRequest, AuthMeResponse, LoginResponse, User } from '@/types/api';

// Token management utilities
import { login as authLogin, storeToken as authStoreToken, clearToken as authClearToken } from '@/lib/api/auth';

const TOKEN_KEY = 'jwt_token';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

function storeToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    authStoreToken(token); // keep helper in sync
}

function clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    authClearToken();
}

function isTokenValid(): boolean {
    const token = getToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

// wrapper around API client login helper
async function apiLogin(credentials: LoginRequest): Promise<{ data?: LoginResponse; error?: string }> {
    try {
        const res = await authLogin(credentials);
        if (res.success && res.data) {
            return { data: res.data };
        }
        return { error: res.error || 'Login failed' };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Network error' };
    }
}

// Using User from @/types/api

interface JWTAuthContextType {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const JWTAuthContext = createContext<JWTAuthContextType | undefined>(undefined);

export function JWTAuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            try {
                const savedToken = getToken();
                if (savedToken && isTokenValid()) {
                    setToken(savedToken);
                } else if (savedToken) {
                    // Token expired, clear it
                    clearToken();
                }
            } catch (error) {
                console.error('Auth init error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (
        credentials: LoginRequest
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            setIsLoading(true);

            // Call NexGear login API
            const response = await apiLogin(credentials);

            if (response.error || !response.data) {
                return {
                    success: false,
                    error: response.error || 'Login failed',
                };
            }

            // Store token
            storeToken(response.data.token);

            // Update local state
            setToken(response.data.token);
            setUser(response.data.user);

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        clearToken();
        setToken(null);
        setUser(null);
    };

    const checkAuth = async () => {
        try {
            const savedToken = getToken();
            if (savedToken && isTokenValid()) {
                setToken(savedToken);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            logout();
        }
    };

    const value: JWTAuthContextType = {
        token,
        user,
        isLoading,
        isAuthenticated: token !== null && isTokenValid(),
        login,
        logout,
        checkAuth,
    };

    return <JWTAuthContext.Provider value={value}>{children}</JWTAuthContext.Provider>;
}

/**
 * Hook to use JWT authentication
 * Usage: const { token, user, login, logout } = useJWTAuth()
 */
export function useJWTAuth() {
    const context = useContext(JWTAuthContext);
    if (context === undefined) {
        throw new Error('useJWTAuth must be used within JWTAuthProvider');
    }
    return context;
}

/**
 * Hook to check if user is authenticated
 * Usage: const isAuth = useIsAuthenticated()
 */
export function useIsAuthenticated() {
    const { isAuthenticated } = useJWTAuth();
    return isAuthenticated;
}

/**
 * HOC to protect routes with authentication
 * Usage: const ProtectedPage = withAuth(MyPage)
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function ProtectedComponent(props: P) {
        const { isAuthenticated, isLoading } = useJWTAuth();
        const router = require('next/navigation').useRouter();

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push('/admin/(auth)/login');
            }
        }, [isLoading, isAuthenticated, router]);

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    };
}
