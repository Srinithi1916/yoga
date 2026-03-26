import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, signupUser } from '../lib/authApi';

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'jeevanam360.authToken';

function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

function storeToken(token) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      if (!token) {
        if (!cancelled) {
          setUser(null);
          setIsReady(true);
        }
        return;
      }

      try {
        const profile = await fetchCurrentUser(token);
        if (!cancelled) {
          setUser(profile);
        }
      } catch (error) {
        if (!cancelled) {
          storeToken('');
          setToken('');
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    bootstrapAuth();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function login(credentials) {
    setIsAuthenticating(true);
    try {
      const response = await loginUser(credentials);
      storeToken(response.token);
      setToken(response.token);
      setUser(response.user);
      setIsReady(true);
      return response.user;
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function signup(details) {
    setIsAuthenticating(true);
    try {
      const response = await signupUser(details);
      storeToken(response.token);
      setToken(response.token);
      setUser(response.user);
      setIsReady(true);
      return response.user;
    } finally {
      setIsAuthenticating(false);
    }
  }

  function logout() {
    storeToken('');
    setToken('');
    setUser(null);
    setIsReady(true);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isReady,
      isAuthenticating,
      isAuthenticated: Boolean(token && user),
      login,
      signup,
      logout,
    }),
    [token, user, isReady, isAuthenticating],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
