import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';

type AuthState = {
  loading: boolean;
  authenticated: boolean;
  username: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  loading: true,
  authenticated: false,
  username: null,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const session = await api.session();
      setAuthenticated(session.authenticated);
      setUsername(session.user?.username || null);
    } catch {
      setAuthenticated(false);
      setUsername(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.ensureCsrf().finally(refresh);
  }, []);

  const login = async (loginValue: string, password: string) => {
    await api.ensureCsrf();
    await api.login({ login: loginValue, password });
    await refresh();
  };

  const logout = async () => {
    await api.ensureCsrf();
    await api.logout();
    await refresh();
  };

  const value = useMemo(
    () => ({ loading, authenticated, username, login, logout, refresh }),
    [loading, authenticated, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
