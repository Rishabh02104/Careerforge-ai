export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  role: "user" | "admin";
}

const USERS_KEY = "cf_users";
const SESSION_KEY = "cf_session";

// ── Admin credentials from env — never hardcoded ─────────────────────────────
export const ADMIN_CREDENTIALS = {
  email:    process.env.NEXT_PUBLIC_ADMIN_EMAIL    ?? "admin@careerforge.ai",
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "",
  name:     process.env.NEXT_PUBLIC_ADMIN_NAME     ?? "Admin",
  id:       "admin-001",
  role:     "admin" as const,
};

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch { return []; }
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): User | undefined {
  // Check admin credentials first
  if (email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()) {
    return {
      id:        ADMIN_CREDENTIALS.id,
      name:      ADMIN_CREDENTIALS.name,
      email:     ADMIN_CREDENTIALS.email,
      password:  ADMIN_CREDENTIALS.password,
      createdAt: "2024-01-01",
      role:      "admin",
    };
  }
  return getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function createSession(user: Omit<User, "password">): void {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id:        user.id,
      name:      user.name,
      email:     user.email,
      role:      user.role,
      createdAt: user.createdAt,
    })
  );
}

export function getSession(): Omit<User, "password"> | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}

// ── Dev bypass — only works locally, never on Vercel ─────────────────────────
export function devAdminBypass(): void {
  if (process.env.NODE_ENV !== "development") return;
  createSession({
    id:        ADMIN_CREDENTIALS.id,
    name:      ADMIN_CREDENTIALS.name,
    email:     ADMIN_CREDENTIALS.email,
    role:      "admin",
    createdAt: "2024-01-01",
  });
}