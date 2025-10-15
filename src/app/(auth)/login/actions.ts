"use server";

import { redirect } from "next/navigation";
import { postJson } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";

export type LoginFormState = {
    errors?: { username?: string; password?: string; form?: string };
    success?: boolean;
};

export async function loginAction(_: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    const errors: LoginFormState["errors"] = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0) return { errors };

    try {
        const result = await postJson<any>("/login", { username, password });
        const token: string | undefined = typeof result === "string"
            ? result
            : result?.token || result?.jwt || result?.access_token || result?.data?.token;
        if (!token) {
            return { errors: { form: "Invalid response from server (no token)" } };
        }
        await setAuthToken(token);
        redirect("/");
    } catch (e: unknown) {
        const message = (e as { message?: string })?.message || "Login failed";
        return { errors: { form: message } };
    }
}
