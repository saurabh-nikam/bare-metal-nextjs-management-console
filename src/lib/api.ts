export type JsonRecord = Record<string, unknown>;

export type ApiError = {
    status: number;
    message: string;
    details?: unknown;
};

function getApiBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_BASE_URL. Add it to your .env.local (e.g. NEXT_PUBLIC_API_BASE_URL=https://api.example.com)");
    }
    return baseUrl.replace(/\/$/, "");
}

export async function postJson<TResp = unknown>(path: string, body: JsonRecord, init?: RequestInit): Promise<TResp> {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
        body: JSON.stringify(body),
        credentials: "omit",
        ...init,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const err: ApiError = {
            status: response.status,
            message: (isJson && payload && (payload.message || payload.error)) || response.statusText || "Request failed",
            details: isJson ? payload : undefined,
        };
        throw err;
    }

    return payload as TResp;
}

export async function getJson<TResp = unknown>(path: string, init?: RequestInit): Promise<TResp> {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            ...(init?.headers || {}),
        },
        credentials: "omit",
        ...init,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const err: ApiError = {
            status: response.status,
            message: (isJson && payload && (payload.message || payload.error)) || response.statusText || "Request failed",
            details: isJson ? payload : undefined,
        };
        throw err;
    }

    return payload as TResp;
}
