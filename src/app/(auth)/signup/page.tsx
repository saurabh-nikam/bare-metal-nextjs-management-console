"use client";

import React from "react";
import Link from "next/link";
import { postJson } from "@/lib/api";
import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [errors, setErrors] = React.useState<{ name?: string; email?: string; password?: string; form?: string }>({});
    const [pending, setPending] = React.useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get("name") || "").trim();
        const email = String(form.get("email") || "").trim();
        const password = String(form.get("password") || "");

        const nextErrors: typeof errors = {};
        if (!name) nextErrors.name = "Name is required";
        if (!email) nextErrors.email = "Email is required";
        if (!password || password.length < 8) nextErrors.password = "Password must be at least 8 characters";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setPending(true);
        try {
            const result = await postJson<any>("/signup", { name, email, password });
            const token: string | undefined = typeof result === "string"
                ? result
                : result?.token || result?.jwt || result?.access_token || result?.data?.token;
            if (!token) {
                setErrors({ form: "Invalid response from server (no token)" });
                return;
            }
            login(token);
            router.replace("/");
        } catch (e: any) {
            setErrors({ form: e?.message || "Signup failed" });
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black/10">
                <h1 className="text-2xl font-semibold mb-4">Create account</h1>
                <form onSubmit={onSubmit} className="grid gap-4" noValidate>
                    <div className="grid gap-1">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <input id="name" name="name" type="text" autoComplete="name" className="border rounded px-3 py-2" required />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <input id="email" name="email" type="email" autoComplete="email" className="border rounded px-3 py-2" required />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <input id="password" name="password" type="password" autoComplete="new-password" className="border rounded px-3 py-2" required />
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>
                    {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
                    <button type="submit" disabled={pending} className="h-10 rounded bg-foreground text-background px-4 disabled:opacity-60">
                        {pending ? "Creating..." : "Create account"}
                    </button>
                </form>
                <p className="mt-4 text-sm">
                    Already have an account? <Link href="/login" className="underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
