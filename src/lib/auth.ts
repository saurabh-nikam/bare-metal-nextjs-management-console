"use server";

import { cookies } from "next/headers";

const AUTH_COOKIE = "auth_token";

export type AuthToken = string;

const isProd = process.env.NODE_ENV === "production";

export async function getAuthToken(): Promise<AuthToken | null> {
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE)?.value;
    return token ?? null;
}

export async function setAuthToken(token: AuthToken): Promise<void> {
    const jar = await cookies();
    jar.set(AUTH_COOKIE, token, {
        // One week expiry; adjust based on product needs
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
    });
}

export async function clearAuthToken(): Promise<void> {
    const jar = await cookies();
    jar.delete(AUTH_COOKIE);
}
