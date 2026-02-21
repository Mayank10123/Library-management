import React, { createContext, useContext, useState, useCallback } from 'react';
import { users, type User, type Role } from '../data/mockData';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = useCallback((username: string, password: string): boolean => {
        const found = users.find(u => u.username === username && u.password === password);
        if (found) { setUser(found); return true; }
        return false;
    }, []);

    const logout = useCallback(() => setUser(null), []);

    const hasRole = useCallback((roles: Role[]) => {
        if (!user) return false;
        return roles.includes(user.role);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
