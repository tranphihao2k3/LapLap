"use client";

import { JWTAuthProvider } from "@/context/JWTAuthContext";

export default function JWTAuthLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <JWTAuthProvider>
            {children}
        </JWTAuthProvider>
    );
}
