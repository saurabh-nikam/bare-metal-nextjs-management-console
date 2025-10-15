"use client";

import { AuthProvider } from "@/providers/auth";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}

