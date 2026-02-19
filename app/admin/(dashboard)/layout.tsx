'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import AdminLayoutContent from './AdminLayoutContent';

import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
            <Toaster position="top-right" />
        </SessionProvider>
    );
}
