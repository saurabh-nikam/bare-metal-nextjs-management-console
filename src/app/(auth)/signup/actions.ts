"use server";

import { redirect } from "next/navigation";
import { postJson } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";

export type SignupFormState = {
    errors?: { name?: string; email?: string; password?: string; form?: string };
    success?: boolean;
};

export async function signupAction(_: SignupFormState, formData: FormData): Promise<SignupFormState> {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const errors: SignupFormState["errors"] = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    if (!password || password.length < 8) errors.password = "Password must be at least 8 characters";
    if (Object.keys(errors).length > 0) return { errors };

    try {
        const result = await postJson<{ token: string }>("/auth/signup", { name, email, password });
        if (!result?.token) {
            return { errors: { form: "Invalid response from server" } };
        }
        await setAuthToken(result.token);
        redirect("/");
        return { success: true };
    } catch (e: unknown) {
        const message = (e as { message?: string })?.message || "Signup failed";
        return { errors: { form: message } };
    }
}
