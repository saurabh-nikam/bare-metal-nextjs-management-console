"use client";

import React from "react";
import Link from "next/link";
import { postJson } from "@/lib/api";
import { useAuth } from "@/providers/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const search = useSearchParams();
    const [errors, setErrors] = React.useState<{ username?: string; password?: string; form?: string }>({});
    const [pending, setPending] = React.useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const username = String(form.get("username") || "").trim();
        const password = String(form.get("password") || "");

        const nextErrors: typeof errors = {};
        if (!username) nextErrors.username = "Username is required";
        if (!password) nextErrors.password = "Password is required";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setPending(true);
        try {
            const result = await postJson<any>("/login", { username, password });
            const token: string | undefined = typeof result === "string"
                ? result
                : result?.token || result?.jwt || result?.access_token || result?.data?.token;
            if (!token) {
                setErrors({ form: "Invalid response from server (no token)" });
                return;
            }
            login(token);
            const next = search.get("next") || "/";
            router.replace(next);
        } catch (e: any) {
            setErrors({ form: e?.message || "Login failed" });
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black/10">
                <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
                <form onSubmit={onSubmit} className="grid gap-4" noValidate>
                    <div className="grid gap-1">
                        <label htmlFor="username" className="text-sm font-medium">Username</label>
                        <input id="username" name="username" type="text" autoComplete="username" className="border rounded px-3 py-2" required />
                        {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" className="border rounded px-3 py-2" required />
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>
                    {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
                    <button type="submit" disabled={pending} className="h-10 rounded bg-foreground text-background px-4 disabled:opacity-60">
                        {pending ? "Signing in..." : "Sign in"}
                    </button>
                </form>
                <p className="mt-4 text-sm">
                    Don&apos;t have an account? <Link href="/signup" className="underline">Create one</Link>
                </p>
            </div>
        </div>
    );
}
