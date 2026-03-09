/**
 * Authentication Helpers
 * Utility functions for JWT authentication and authorization
 */

import { getToken } from '@/lib/api/auth';

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
        return false; // Server-side: always false
    }
    const token = getToken();
    return token !== null && !isTokenExpired(token);
}

/**
 * Get current user token
 */
export function getCurrentToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return getToken();
}

/**
 * Decode JWT token to get user info (client-side only)
 * Note: For security, token should be validated on server too
 */
export function decodeJWT(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const decoded = JSON.parse(
            Buffer.from(parts[1], 'base64').toString()
        );

        return decoded;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}

/**
 * Check if JWT token has expired
 */
export function isTokenExpired(token: string): boolean {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    // exp is in seconds, convert to milliseconds
    return (decoded.exp as number) * 1000 < Date.now();
}

/**
 * Get user role from token
 */
export function getUserRole(): 'admin' | 'customer' | 'employee' | null {
    const token = getCurrentToken();
    if (!token) return null;

    const decoded = decodeJWT(token);
    return (decoded?.role as any) || null;
}

/**
 * Check if user has admin role
 */
export function isAdmin(): boolean {
    return getUserRole() === 'admin';
}

/**
 * Check if user has employee role
 */
export function isEmployee(): boolean {
    return getUserRole() === 'employee';
}

/**
 * Check if user has customer role
 */
export function isCustomer(): boolean {
    return getUserRole() === 'customer';
}

/**
 * Check if user has one of the given roles
 */
export function hasRole(roles: Array<'admin' | 'customer' | 'employee'>): boolean {
    const userRole = getUserRole();
    return userRole ? roles.includes(userRole) : false;
}

/**
 * Get user ID from token
 */
export function getUserId(): string | null {
    const token = getCurrentToken();
    if (!token) return null;

    const decoded = decodeJWT(token);
    return (decoded?.sub as string) || (decoded?._id as string) || null;
}

/**
 * Get user email from token (if included)
 */
export function getUserEmail(): string | null {
    const token = getCurrentToken();
    if (!token) return null;

    const decoded = decodeJWT(token);
    return (decoded?.email as string) || null;
}

/**
 * Require authentication - throws if not authenticated
 * Usage in server actions: requireAuth()
 */
export function requireAuth(): void {
    if (typeof window !== 'undefined' && !isAuthenticated()) {
        throw new Error('Authentication required');
    }
}

/**
 * Require admin role - throws if not admin
 */
export function requireAdmin(): void {
    if (!isAdmin()) {
        throw new Error('Admin access required');
    }
}

/**
 * Require one of the given roles - throws if user doesn't have any
 */
export function requireRole(roles: Array<'admin' | 'customer' | 'employee'>): void {
    if (!hasRole(roles)) {
        throw new Error(`Access requires one of roles: ${roles.join(', ')}`);
    }
}
