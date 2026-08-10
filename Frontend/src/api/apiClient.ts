import {ApiError} from "@/api/apiError";

const API_URL = process.env.REACT_APP_API_URL;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
    suppressUnauthorizedHandler?: boolean;
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
    unauthorizedHandler = handler;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const {body, ...rest} = options;
    const res = await fetch(`${API_URL}${path}`, {
        credentials: 'include',
        ...rest,
        headers: {
            ...(body !== undefined && !(body instanceof FormData) ? {'Content-Type': 'application/json'} : {}),
            ...(rest.headers as Record<string, string> | undefined),
        },
        body:
            typeof body === 'string' || body instanceof FormData
                ? (body as BodyInit)
                : JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        let detail: string | undefined;
        const parsed = JSON.parse(text);
        if (typeof parsed.detail === 'string') {
            detail = parsed.detail;
        }
        if (res.status === 401) {
            if (!options.suppressUnauthorizedHandler) {
                unauthorizedHandler?.();
            }
        }
        console.error(`[API ${res.status}] ${detail || text}`);
        throw new ApiError(res.status, detail || text, detail);
    }

    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
}