import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AccentColor {
    name: string;
    primary: string;
    secondary: string;
    tertiary: string;
    gradient: string;
    glow: string;
}

export const ACCENT_COLORS: AccentColor[] = [
    { name: 'Violet', primary: '#7c3aed', secondary: '#6366f1', tertiary: '#a78bfa', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #818cf8 100%)', glow: '0 0 25px rgba(124,58,237,0.3)' },
    { name: 'Blue', primary: '#2563eb', secondary: '#3b82f6', tertiary: '#93c5fd', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)', glow: '0 0 25px rgba(37,99,235,0.3)' },
    { name: 'Cyan', primary: '#0891b2', secondary: '#06b6d4', tertiary: '#67e8f9', gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)', glow: '0 0 25px rgba(8,145,178,0.3)' },
    { name: 'Teal', primary: '#0d9488', secondary: '#14b8a6', tertiary: '#5eead4', gradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)', glow: '0 0 25px rgba(13,148,136,0.3)' },
    { name: 'Green', primary: '#16a34a', secondary: '#22c55e', tertiary: '#86efac', gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)', glow: '0 0 25px rgba(22,163,74,0.3)' },
    { name: 'Amber', primary: '#d97706', secondary: '#f59e0b', tertiary: '#fcd34d', gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)', glow: '0 0 25px rgba(217,119,6,0.3)' },
    { name: 'Orange', primary: '#ea580c', secondary: '#f97316', tertiary: '#fdba74', gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)', glow: '0 0 25px rgba(234,88,12,0.3)' },
    { name: 'Red', primary: '#dc2626', secondary: '#ef4444', tertiary: '#fca5a5', gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)', glow: '0 0 25px rgba(220,38,38,0.3)' },
    { name: 'Pink', primary: '#db2777', secondary: '#ec4899', tertiary: '#f9a8d4', gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)', glow: '0 0 25px rgba(219,39,119,0.3)' },
    { name: 'Rose', primary: '#e11d48', secondary: '#f43f5e', tertiary: '#fda4af', gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)', glow: '0 0 25px rgba(225,29,72,0.3)' },
    { name: 'Indigo', primary: '#4f46e5', secondary: '#6366f1', tertiary: '#a5b4fc', gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)', glow: '0 0 25px rgba(79,70,229,0.3)' },
    { name: 'Slate', primary: '#475569', secondary: '#64748b', tertiary: '#94a3b8', gradient: 'linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%)', glow: '0 0 25px rgba(71,85,105,0.3)' },
];

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    accent: AccentColor;
    toggleMode: () => void;
    setAccent: (accent: AccentColor) => void;
    isPanelOpen: boolean;
    togglePanel: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('koha-theme-mode');
        return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    });
    const [accent, setAccentState] = useState<AccentColor>(() => {
        const saved = localStorage.getItem('koha-accent');
        if (saved) {
            const found = ACCENT_COLORS.find(c => c.name === saved);
            if (found) return found;
        }
        return ACCENT_COLORS[0];
    });
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const toggleMode = useCallback(() => {
        setMode(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    const setAccent = useCallback((a: AccentColor) => {
        setAccentState(a);
        localStorage.setItem('koha-accent', a.name);
    }, []);

    const togglePanel = useCallback(() => setIsPanelOpen(prev => !prev), []);

    useEffect(() => {
        localStorage.setItem('koha-theme-mode', mode);
        const root = document.documentElement;
        root.setAttribute('data-theme', mode);

        if (mode === 'light') {
            root.style.setProperty('--bg-primary', '#f0f2f8');
            root.style.setProperty('--bg-secondary', '#e8eaf2');
            root.style.setProperty('--bg-tertiary', '#dddfe9');
            root.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.75)');
            root.style.setProperty('--bg-card-hover', 'rgba(255, 255, 255, 0.9)');
            root.style.setProperty('--bg-glass', 'rgba(0, 0, 0, 0.03)');
            root.style.setProperty('--bg-glass-hover', 'rgba(0, 0, 0, 0.06)');
            root.style.setProperty('--text-primary', '#1e293b');
            root.style.setProperty('--text-secondary', '#475569');
            root.style.setProperty('--text-tertiary', '#94a3b8');
            root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.08)');
            root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.08)');
            root.style.setProperty('--shadow-md', '0 4px 12px rgba(0,0,0,0.1)');
            root.style.setProperty('--shadow-lg', '0 8px 30px rgba(0,0,0,0.12)');
        } else {
            root.style.setProperty('--bg-primary', '#06081a');
            root.style.setProperty('--bg-secondary', '#0d1025');
            root.style.setProperty('--bg-tertiary', '#151933');
            root.style.setProperty('--bg-card', 'rgba(20, 24, 50, 0.65)');
            root.style.setProperty('--bg-card-hover', 'rgba(30, 35, 70, 0.7)');
            root.style.setProperty('--bg-glass', 'rgba(255, 255, 255, 0.04)');
            root.style.setProperty('--bg-glass-hover', 'rgba(255, 255, 255, 0.07)');
            root.style.setProperty('--text-primary', '#f1f5f9');
            root.style.setProperty('--text-secondary', '#94a3b8');
            root.style.setProperty('--text-tertiary', '#64748b');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.06)');
            root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.3)');
            root.style.setProperty('--shadow-md', '0 4px 12px rgba(0,0,0,0.4)');
            root.style.setProperty('--shadow-lg', '0 8px 30px rgba(0,0,0,0.5)');
        }
    }, [mode]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--accent-primary', accent.primary);
        root.style.setProperty('--accent-secondary', accent.secondary);
        root.style.setProperty('--accent-tertiary', accent.tertiary);
        root.style.setProperty('--accent-gradient', accent.gradient);
        root.style.setProperty('--accent-glow', accent.glow);
        root.style.setProperty('--border-accent', `${accent.primary}4d`);
        root.style.setProperty('--shadow-glow', `0 0 40px ${accent.primary}26`);
    }, [accent]);

    return (
        <ThemeContext.Provider value={{ mode, setMode, accent, toggleMode, setAccent, isPanelOpen, togglePanel }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
