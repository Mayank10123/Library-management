import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutDef {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    description: string;
    action: () => void;
    category: string;
}

export function useKeyboardShortcuts(openShortcutsModal: () => void) {
    const navigate = useNavigate();

    useEffect(() => {
        let pendingPrefix = '';
        let prefixTimer: ReturnType<typeof setTimeout>;

        const shortcuts: ShortcutDef[] = [
            // Navigation (G + key)
            { key: 'g+d', description: 'Go to Dashboard', action: () => navigate('/'), category: 'Navigation' },
            { key: 'g+b', description: 'Go to Books', action: () => navigate('/books'), category: 'Navigation' },
            { key: 'g+m', description: 'Go to Members', action: () => navigate('/members'), category: 'Navigation' },
            { key: 'g+i', description: 'Go to Issue', action: () => navigate('/issue'), category: 'Navigation' },
            { key: 'g+r', description: 'Go to Return', action: () => navigate('/return'), category: 'Navigation' },
            { key: 'g+v', description: 'Go to Reservations', action: () => navigate('/reservations'), category: 'Navigation' },
            { key: 'g+f', description: 'Go to Fines', action: () => navigate('/fines'), category: 'Navigation' },
            { key: 'g+p', description: 'Go to Reports', action: () => navigate('/reports'), category: 'Navigation' },
            { key: 'g+n', description: 'Go to Notifications', action: () => navigate('/notifications'), category: 'Navigation' },
            { key: 'g+c', description: 'Go to Calendar', action: () => navigate('/calendar'), category: 'Navigation' },
            { key: 'g+t', description: 'Go to Timeline', action: () => navigate('/timeline'), category: 'Navigation' },
            { key: 'g+e', description: 'Go to eBooks', action: () => navigate('/ebooks'), category: 'Navigation' },
            { key: 'g+s', description: 'Go to Settings', action: () => navigate('/settings'), category: 'Navigation' },
            // Create (N + key)
            { key: 'n+b', description: 'New Book', action: () => navigate('/books/add'), category: 'Create' },
            { key: 'n+m', description: 'New Member', action: () => navigate('/members/add'), category: 'Create' },
        ];

        const handler = (e: KeyboardEvent) => {
            // Don't trigger in inputs
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) return;

            // ? key → open shortcuts modal
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                openShortcutsModal();
                return;
            }

            const k = e.key.toLowerCase();

            // Handle prefix shortcuts (g+key, n+key)
            if (pendingPrefix) {
                const combo = pendingPrefix + '+' + k;
                const match = shortcuts.find(s => s.key === combo);
                if (match) {
                    e.preventDefault();
                    match.action();
                }
                pendingPrefix = '';
                clearTimeout(prefixTimer);
                return;
            }

            if (k === 'g' || k === 'n') {
                pendingPrefix = k;
                prefixTimer = setTimeout(() => { pendingPrefix = ''; }, 800);
                return;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [navigate, openShortcutsModal]);
}

export const SHORTCUT_LIST = [
    {
        category: 'Navigation', shortcuts: [
            { keys: ['G', 'D'], description: 'Dashboard' },
            { keys: ['G', 'B'], description: 'Books' },
            { keys: ['G', 'M'], description: 'Members' },
            { keys: ['G', 'I'], description: 'Issue Book' },
            { keys: ['G', 'R'], description: 'Return Book' },
            { keys: ['G', 'V'], description: 'Reservations' },
            { keys: ['G', 'F'], description: 'Fines' },
            { keys: ['G', 'P'], description: 'Reports' },
            { keys: ['G', 'N'], description: 'Notifications' },
            { keys: ['G', 'C'], description: 'Calendar' },
            { keys: ['G', 'T'], description: 'Timeline' },
            { keys: ['G', 'E'], description: 'eBooks' },
            { keys: ['G', 'S'], description: 'Settings' },
        ]
    },
    {
        category: 'Create', shortcuts: [
            { keys: ['N', 'B'], description: 'New Book' },
            { keys: ['N', 'M'], description: 'New Member' },
        ]
    },
    {
        category: 'Global', shortcuts: [
            { keys: ['Ctrl', 'K'], description: 'Command Palette' },
            { keys: ['?'], description: 'Keyboard Shortcuts' },
        ]
    },
];
