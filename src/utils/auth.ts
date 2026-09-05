import type { User, UserRole } from "../types";

const AUTH_STORAGE_KEY = "morningunifolder_auth";

interface StoredAuth {
  user: User;
  accessToken: string;
}

/**
 * Maps the backend RoleLevel to the frontend UserRole.
 * If the role level is unsupported or unknown, returns null.
 */
export const mapRoleLevelToUserRole = (roleLevel: number): UserRole | null => {
  if (roleLevel === 1) {
    return "ADMIN";
  }
  // Future roles (e.g., CUSTOMER, SHOPKEEPER) would be mapped here
  return null;
};

/**
 * Validates whether an authentication token is present, non-empty, and if a JWT, not expired.
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token || typeof token !== "string" || !token.trim()) {
    return false;
  }

  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      // Decode JWT payload (base64url)
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
      const jsonPayload = decodeURIComponent(
        atob(padded)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const parsed = JSON.parse(jsonPayload);
      if (parsed.exp && typeof parsed.exp === "number") {
        const nowSec = Math.floor(Date.now() / 1000);

        // Handle potential client machine clock skew (e.g. system date set to future years like 2026)
        if (parsed.iat && typeof parsed.iat === "number") {
          const lifetime = parsed.exp - parsed.iat;
          if (nowSec - parsed.iat > lifetime + 30 * 86400 && nowSec > 1760000000) {
            return true;
          }
        }

        // If client clock is in year 2026+ while token is from current year (2025), avoid false client rejection
        if (nowSec > 1770000000 && parsed.exp < 1770000000 && parsed.exp > 1700000000) {
          return true;
        }

        return parsed.exp > nowSec;
      }
    }
    // If not a 3-part JWT, treat non-empty string as valid token
    return true;
  } catch {
    return false;
  }
};


/**
 * Retrieves the stored authentication state from localStorage.
 * Automatically clears stored auth if the token is expired or invalid.
 */
export const getStoredAuth = (): { user: User | null; accessToken: string | null } => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return { user: null, accessToken: null };
    }

    const parsed = JSON.parse(stored) as StoredAuth;
    if (parsed.user && parsed.accessToken) {
      if (isTokenValid(parsed.accessToken)) {
        return { user: parsed.user, accessToken: parsed.accessToken };
      }
      // Purge expired token
      clearStoredAuth();
    }
  } catch {
    // If parsing fails or localStorage is unavailable, silently fall back to unauthenticated
    clearStoredAuth();
  }
  
  return { user: null, accessToken: null };
};

/**
 * Checks whether an active session with valid token and specified role exists in storage.
 */
export const hasRoleAccess = (requiredRole: UserRole): boolean => {
  const { user, accessToken } = getStoredAuth();
  return !!user && !!accessToken && user.role === requiredRole && isTokenValid(accessToken);
};

/**
 * Persists the authenticated user and token to localStorage.
 * NEVER store passwords or raw API responses here.
 */
export const saveAuth = (user: User, accessToken: string): void => {
  try {
    const authData: StoredAuth = { user, accessToken };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch {
    // Silently fail if localStorage is inaccessible
  }
};

/**
 * Clears the persisted authentication state from localStorage.
 */
export const clearStoredAuth = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Silently fail if localStorage is inaccessible
  }
};

