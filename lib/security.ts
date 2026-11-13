interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_STORE_KEY = "__portfolio_rate_limit_store__";

function getRateLimitStore(): Map<string, RateLimitEntry> {
  const g = globalThis as unknown as Record<string, Map<string, RateLimitEntry> | undefined>;
  if (!g[RATE_LIMIT_STORE_KEY]) {
    g[RATE_LIMIT_STORE_KEY] = new Map<string, RateLimitEntry>();
  }
  return g[RATE_LIMIT_STORE_KEY];
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getClientIp(source?: Request | Headers | null): string {
  if (!source) return "unknown";
  const hdrs = source instanceof Headers ? source : source.headers;
  const forwarded = hdrs.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return hdrs.get("x-real-ip")?.trim() || "unknown";
}

/**
 * In-memory sliding-window counter per key. Best-effort guard per runtime instance
 * against brute-force login attempts and public endpoint spam.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const store = getRateLimitStore();
  const now = Date.now();

  if (store.size > 5000) {
    for (const [k, entry] of store.entries()) {
      if (entry.resetAt <= now) store.delete(k);
    }
  }

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, maxAttempts - 1),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (current.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(key, current);
  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - current.count),
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function peekRateLimitBlocked(
  key: string,
  maxAttempts: number
): { blocked: boolean; retryAfterSeconds: number } {
  const store = getRateLimitStore();
  const current = store.get(key);
  const now = Date.now();
  if (!current || current.resetAt <= now) {
    return { blocked: false, retryAfterSeconds: 0 };
  }
  if (current.count >= maxAttempts) {
    return {
      blocked: true,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  return { blocked: false, retryAfterSeconds: 0 };
}

export function resetRateLimit(key: string): void {
  getRateLimitStore().delete(key);
}

export function validateStrongPassword(password: string): { valid: boolean; reason?: string } {
  if (password.length < 10) {
    return { valid: false, reason: "Password must be at least 10 characters long." };
  }
  if (password.length > 128) {
    return { valid: false, reason: "Password must be at most 128 characters long." };
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      reason: "Password must include uppercase, lowercase, and at least one number.",
    };
  }
  return { valid: true };
}

export function isSafeRelativeRedirect(target?: string | null): boolean {
  if (!target) return false;
  if (!target.startsWith("/")) return false;
  if (target.startsWith("//") || target.startsWith("/\\")) return false;
  return !target.includes("\r") && !target.includes("\n");
}

/**
 * Accepts only empty strings, app-relative paths (/assets/...), or http(s) URLs.
 * Rejects javascript:, data:, vbscript:, and protocol-relative strings.
 */
export function sanitizeUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return "";
  }
  return "";
}

const UNSAFE_OBJECT_KEYS = new Set(["__proto__", "constructor", "prototype", "_id", "__v", "createdAt", "updatedAt"]);

/**
 * Deeply strips MongoDB operator keys ($...) and prototype-pollution keys from JSON payloads.
 */
export function stripUnsafeKeys(value: unknown, depth = 0): unknown {
  if (depth > 8) return null;
  if (Array.isArray(value)) {
    return value.map((item) => stripUnsafeKeys(item, depth + 1));
  }
  if (value !== null && typeof value === "object") {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (UNSAFE_OBJECT_KEYS.has(key)) continue;
      if (key.startsWith("$") || key.includes(".")) continue;
      clean[key] = stripUnsafeKeys(val, depth + 1);
    }
    return clean;
  }
  return value;
}

export function getSecurityDiagnostics() {
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
  const cloudinarySecretNonPublic = Boolean(process.env.CLOUDINARY_API_SECRET);
  const cloudinarySecretLegacyPublic = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET);
  const hasDatabaseUri = Boolean(process.env.MONGODB_URI);
  const hasSetupToken = Boolean(process.env.ADMIN_SETUP_TOKEN);
  const hasMailjet = Boolean(
    process.env.MJ_APIKEY_PUBLIC && process.env.MJ_APIKEY_PRIVATE && process.env.MAILJET_SENDER_EMAIL
  );

  return {
    hasAuthSecret,
    cloudinarySecretNonPublic,
    cloudinarySecretLegacyPublic,
    hasDatabaseUri,
    hasSetupToken,
    hasMailjet,
    isProduction: process.env.NODE_ENV === "production",
  };
}

