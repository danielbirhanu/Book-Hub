import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; username: string; email: string; isAdmin: boolean };
type AuthValue = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  async function refresh() {
    const response = await fetch("/api/v1/auth/me", { credentials: "include" });
    setUser(response.ok ? ((await response.json()) as User) : null);
    setLoading(false);
  }
  async function signOut() {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }
  useEffect(() => {
    void refresh();
  }, []);
  const value = useMemo(
    () => ({ user, loading, refresh, signOut }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
