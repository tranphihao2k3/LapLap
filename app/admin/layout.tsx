'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import AdminLayoutContent from './AdminLayoutContent';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SessionProvider>
    );
}
