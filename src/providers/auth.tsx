"use client";

import React from "react";

type AuthContextValue = {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function readTokenFromStorage(): string | null {
    try {
        return localStorage.getItem("auth_token");
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = React.useState<string | null>(null);

    React.useEffect(() => {
        setToken(readTokenFromStorage());
    }, []);

    const login = React.useCallback((newToken: string) => {
        setToken(newToken);
        try {
            localStorage.setItem("auth_token", newToken);
        } catch { }
    }, []);

    const logout = React.useCallback(() => {
        setToken(null);
        try {
            localStorage.removeItem("auth_token");
        } catch { }
    }, []);

    const value = React.useMemo<AuthContextValue>(() => ({ token, isAuthenticated: Boolean(token), login, logout }), [token, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
