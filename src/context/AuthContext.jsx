import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'bike360_token';
const USER_KEY  = 'bike360_user';

export function AuthProvider({ children }) {

    // Hydrate from localStorage so refresh keeps user logged in
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(USER_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(
        () => localStorage.getItem(TOKEN_KEY)
    );

    /**
     * Called after successful login or register.
     * Backend returns: { token, email, fullName, roles: ["Admin"], userId, expiresAt }
     * Note: backend sends "roles" (array) — we take the first entry as primary role.
     */
    const saveSession = useCallback((authResponse) => {
        const { token: newToken, email, fullName, roles } = authResponse;

        // roles is an array e.g. ["Admin"] — take the first one
        const primaryRole = Array.isArray(roles) && roles.length > 0
            ? roles[0]
            : 'Customer';

        const userData = { email, fullName, role: primaryRole };

        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, saveSession, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}