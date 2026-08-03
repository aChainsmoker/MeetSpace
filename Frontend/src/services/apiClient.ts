const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5200/api';

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers: {
      ...(body !== undefined && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
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
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed.detail === 'string') {
        detail = parsed.detail;
      }
    } catch {
      // ignore non-JSON error bodies
    }
    if (res.status === 401) {
      unauthorizedHandler?.();
    }
    throw new ApiError(res.status, detail || text, detail);
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}