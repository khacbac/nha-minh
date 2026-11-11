import { accessToken } from "@/lib/supabase";

import { metroHost, reachableInDev } from "./dev-host";

/** apps/server's port in dev (`pnpm server:dev`). */
const DEV_API_PORT = 3100;

function resolveApiBase(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return reachableInDev(envUrl);
  const host = __DEV__ ? metroHost() : undefined;
  return `http://${host ?? "localhost"}:${DEV_API_PORT}`;
}

const API_BASE = resolveApiBase();

/** `code` is the server's error code, or `NETWORK_ERROR` when the server was never reached. */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let onUnauthorized: (() => void) | null = null;

/** What to do when the server no longer accepts the sign-in: back to Đăng nhập (spec §2.0). */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = await accessToken();
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  } catch (err) {
    // Offline, DNS, refused: one error type for "the server was never reached".
    throw new ApiError(
      "NETWORK_ERROR",
      err instanceof Error ? err.message : "Network request failed",
      0,
    );
  }

  if (!res.ok) {
    let err: { code?: string; message?: string } = {};
    try {
      err = JSON.parse(await res.text());
    } catch {
      // A proxy's HTML error page: keep the status only.
    }
    if (res.status === 401) onUnauthorized?.();
    throw new ApiError(err.code ?? "UNKNOWN", err.message ?? res.statusText, res.status);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const http = {
  get: <T>(path: string) => request<T>("GET", path),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
