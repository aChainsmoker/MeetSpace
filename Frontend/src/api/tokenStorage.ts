import { AuthResponse } from '@/models/AuthResponse';

const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_IDENTIFIER;
const REFRESH_TOKEN_KEY = process.env.REACT_APP_REFRESH_TOKEN_IDENTIFIER;

function getTokensStorage(): Storage {
    return isRememberedSession() ? localStorage : sessionStorage;
}

export function isRememberedSession(): boolean {
    return localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
}

export function getAccessToken(): string | null {
    return getTokensStorage().getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    return getTokensStorage().getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: AuthResponse, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
