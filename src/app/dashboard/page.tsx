"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function DashboardPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!isAuthenticated) router.replace("/login?next=/dashboard");
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <p className="mb-6">You are signed in.</p>
            <Link href="/" className="underline">Back home</Link>
        </div>
    );
}
