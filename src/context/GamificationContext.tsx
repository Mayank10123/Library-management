import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: number;
    type: 'books_read' | 'reviews' | 'streak' | 'on_time' | 'first_book';
    unlocked: boolean;
    unlockedDate?: string;
}

export interface GamificationState {
    xp: number;
    level: number;
    streak: number;
    booksRead: number;
    reviewsWritten: number;
    onTimeReturns: number;
    badges: Badge[];
    recentXP: { amount: number; reason: string; timestamp: number }[];
}

const BADGES: Badge[] = [
    { id: 'bg1', name: 'First Steps', description: 'Borrow your first book', icon: '📖', requirement: 1, type: 'first_book', unlocked: false },
    { id: 'bg2', name: 'Bookworm', description: 'Read 5 books', icon: '🐛', requirement: 5, type: 'books_read', unlocked: false },
    { id: 'bg3', name: 'Bibliophile', description: 'Read 10 books', icon: '📚', requirement: 10, type: 'books_read', unlocked: false },
    { id: 'bg4', name: 'Scholar', description: 'Read 25 books', icon: '🎓', requirement: 25, type: 'books_read', unlocked: false },
    { id: 'bg5', name: 'Speed Reader', description: 'Return 3 books on time', icon: '⚡', requirement: 3, type: 'on_time', unlocked: false },
    { id: 'bg6', name: 'Punctual Pro', description: 'Return 10 books on time', icon: '⏰', requirement: 10, type: 'on_time', unlocked: false },
    { id: 'bg7', name: 'Critic', description: 'Write 3 reviews', icon: '✍️', requirement: 3, type: 'reviews', unlocked: false },
    { id: 'bg8', name: 'Reviewer', description: 'Write 5 reviews', icon: '⭐', requirement: 5, type: 'reviews', unlocked: false },
    { id: 'bg9', name: 'Streak Starter', description: '3-day reading streak', icon: '🔥', requirement: 3, type: 'streak', unlocked: false },
    { id: 'bg10', name: 'Streak Master', description: '7-day reading streak', icon: '💎', requirement: 7, type: 'streak', unlocked: false },
    { id: 'bg11', name: 'Legend', description: '14-day reading streak', icon: '👑', requirement: 14, type: 'streak', unlocked: false },
    { id: 'bg12', name: 'Librarian\'s Friend', description: 'Read 50 books', icon: '🏆', requirement: 50, type: 'books_read', unlocked: false },
];

const initialState: GamificationState = {
    xp: 245, level: 3, streak: 5, booksRead: 8, reviewsWritten: 2, onTimeReturns: 6,
    badges: BADGES.map(b => {
        // Pre-unlock some badges based on initial stats
        if (b.type === 'first_book' && 8 >= b.requirement) return { ...b, unlocked: true, unlockedDate: '2026-01-15' };
        if (b.type === 'books_read' && 8 >= b.requirement) return { ...b, unlocked: true, unlockedDate: '2026-02-10' };
        if (b.type === 'on_time' && 6 >= b.requirement) return { ...b, unlocked: true, unlockedDate: '2026-02-05' };
        if (b.type === 'streak' && 5 >= b.requirement) return { ...b, unlocked: true, unlockedDate: '2026-02-18' };
        return b;
    }),
    recentXP: [
        { amount: 20, reason: 'Returned on time', timestamp: Date.now() - 86400000 },
        { amount: 10, reason: 'Borrowed a book', timestamp: Date.now() - 172800000 },
        { amount: 15, reason: 'Wrote a review', timestamp: Date.now() - 259200000 },
    ],
};

function getLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
}

function xpForNextLevel(xp: number): number {
    const level = getLevel(xp);
    return level * 100;
}

interface GamificationContextType {
    state: GamificationState;
    addXP: (amount: number, reason: string) => void;
    getLevel: (xp: number) => number;
    xpForNextLevel: (xp: number) => number;
    xpProgress: () => number;
}

const GamificationContext = createContext<GamificationContextType>({
    state: initialState,
    addXP: () => { },
    getLevel,
    xpForNextLevel,
    xpProgress: () => 0,
});

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GamificationState>(initialState);

    const addXP = useCallback((amount: number, reason: string) => {
        setState(prev => ({
            ...prev,
            xp: prev.xp + amount,
            level: getLevel(prev.xp + amount),
            recentXP: [{ amount, reason, timestamp: Date.now() }, ...prev.recentXP].slice(0, 20),
        }));
    }, []);

    const xpProgress = useCallback(() => {
        const currentLevelStart = (state.level - 1) * 100;
        const nextLevelXP = state.level * 100;
        return ((state.xp - currentLevelStart) / (nextLevelXP - currentLevelStart)) * 100;
    }, [state.xp, state.level]);

    return (
        <GamificationContext.Provider value={{ state, addXP, getLevel, xpForNextLevel, xpProgress }}>
            {children}
        </GamificationContext.Provider>
    );
};
