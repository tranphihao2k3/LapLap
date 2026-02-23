import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Quản lý laptop, danh mục, thương hiệu',
    robots: {
        index: false,
        follow: false,
    },
    manifest: '/manifest-admin.json',
    icons: {
        apple: '/icon-192.png',
    },
    appleWebApp: {
        capable: true,
        title: 'LapLap Admin',
        statusBarStyle: 'default',
    },
};

export default function AdminMetadataLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
