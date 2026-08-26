import { ApiError } from '@/api/apiError';
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
    isRememberedSession,
} from '@/api/tokenStorage';
import { notifications } from '@mantine/notifications';

const API_URL = process.env.REACT_APP_API_URL;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
    suppressUnauthorizedHandler?: boolean;
}

let unauthorizedHandler: (() => void) | null = null;

let refreshPromise: Promise<string | null> | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
    unauthorizedHandler = handler;
}

async function refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const refreshToken = getRefreshToken();
            if (!refreshToken) return null;

            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!res.ok) {
                clearTokens();
                return null;
            }

            const data = await res.json();
            setTokens(data, isRememberedSession());
            return data.accessToken as string;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

async function sendRequest(
    path: string,
    options: ApiRequestOptions = {},
): Promise<Response> {
    const { body, ...rest } = options;
    const accessToken = getAccessToken();

    return fetch(`${API_URL}${path}`, {
        ...rest,
        headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...(body !== undefined && !(body instanceof FormData)
                ? { 'Content-Type': 'application/json' }
                : {}),
            ...(rest.headers as Record<string, string> | undefined),
        },
        body:
            typeof body === 'string' || body instanceof FormData
                ? (body as BodyInit)
                : JSON.stringify(body),
    });
}

export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    let response = await sendRequest(path, options);

    if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            response = await sendRequest(path, options);
        } else {
            clearTokens();
            if (!options.suppressUnauthorizedHandler) {
                unauthorizedHandler?.();
            }
            const text = await response.text();
            throw new ApiError(response.status, text);
        }
    }

    if (!response.ok) {
        const text = await response.text();
        let detail: string | undefined;
        try {
            const parsed = JSON.parse(text);
            if (typeof parsed.detail === 'string') {
                detail = parsed.detail;
            }
        } catch {
            notifications.show({
                color: 'var(--red-color)',
                message: 'Ответ от сервера содержит ошибку',
            });
            throw new ApiError(response.status, text, 'Body is not json');
        }
        console.error(`[API ${response.status}] ${detail || text}`);
        throw new ApiError(response.status, detail || text, detail);
    }

    const text = await response.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
}
