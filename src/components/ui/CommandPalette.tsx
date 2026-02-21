import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, BookOpen, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../../context/LibraryContext';

interface CommandItem {
    id: string;
    label: string;
    category: 'page' | 'book' | 'member';
    icon: React.ReactNode;
    action: () => void;
}

const CommandPalette: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { books, members } = useLibrary();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
                setQuery('');
                setActiveIndex(0);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    const pages: CommandItem[] = useMemo(() => [
        { id: 'p-dash', label: 'Dashboard', category: 'page', icon: <FileText size={14} />, action: () => navigate('/') },
        { id: 'p-books', label: 'Books', category: 'page', icon: <BookOpen size={14} />, action: () => navigate('/books') },
        { id: 'p-add-book', label: 'Add Book', category: 'page', icon: <BookOpen size={14} />, action: () => navigate('/books/add') },
        { id: 'p-issue', label: 'Issue Book', category: 'page', icon: <BookOpen size={14} />, action: () => navigate('/issue') },
        { id: 'p-return', label: 'Return Book', category: 'page', icon: <BookOpen size={14} />, action: () => navigate('/return') },
        { id: 'p-members', label: 'Members', category: 'page', icon: <Users size={14} />, action: () => navigate('/members') },
        { id: 'p-add-member', label: 'Add Member', category: 'page', icon: <Users size={14} />, action: () => navigate('/members/add') },
        { id: 'p-reservations', label: 'Reservations', category: 'page', icon: <FileText size={14} />, action: () => navigate('/reservations') },
        { id: 'p-fines', label: 'Fines', category: 'page', icon: <FileText size={14} />, action: () => navigate('/fines') },
        { id: 'p-reports', label: 'Reports', category: 'page', icon: <FileText size={14} />, action: () => navigate('/reports') },
        { id: 'p-notifs', label: 'Notifications', category: 'page', icon: <FileText size={14} />, action: () => navigate('/notifications') },
    ], [navigate]);

    const allItems = useMemo(() => {
        const bookItems: CommandItem[] = books.slice(0, 20).map(b => ({
            id: `b-${b.id}`, label: `${b.title} — ${b.author}`, category: 'book',
            icon: <BookOpen size={14} />, action: () => navigate('/books'),
        }));
        const memberItems: CommandItem[] = members.slice(0, 15).map(m => ({
            id: `m-${m.id}`, label: `${m.name} — ${m.department}`, category: 'member',
            icon: <Users size={14} />, action: () => navigate('/members'),
        }));
        return [...pages, ...bookItems, ...memberItems];
    }, [pages, books, members, navigate]);

    const results = useMemo(() => {
        if (!query) return pages;
        const q = query.toLowerCase();
        return allItems.filter(item => item.label.toLowerCase().includes(q)).slice(0, 12);
    }, [query, pages, allItems]);

    useEffect(() => setActiveIndex(0), [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
        if (e.key === 'Enter' && results[activeIndex]) { results[activeIndex].action(); setOpen(false); }
    };

    const categoryLabel = (cat: string) => {
        switch (cat) { case 'page': return 'Pages'; case 'book': return 'Books'; case 'member': return 'Members'; default: return ''; }
    };

    const grouped = useMemo(() => {
        const map = new Map<string, CommandItem[]>();
        results.forEach(r => {
            const arr = map.get(r.category) || [];
            arr.push(r);
            map.set(r.category, arr);
        });
        return map;
    }, [results]);

    let flatIdx = -1;

    return (
        <AnimatePresence>
            {open && (
                <motion.div className="command-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setOpen(false)}>
                    <motion.div className="command-palette"
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 25 }}
                        onClick={e => e.stopPropagation()}>
                        <div className="command-input-row">
                            <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                            <input ref={inputRef} className="command-input" placeholder="Search pages, books, members..."
                                value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
                            <kbd className="command-kbd">ESC</kbd>
                        </div>
                        <div className="command-results">
                            {results.length === 0 && (
                                <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
                                    No results found
                                </div>
                            )}
                            {Array.from(grouped.entries()).map(([cat, items]) => (
                                <div key={cat}>
                                    <div className="command-category">{categoryLabel(cat)}</div>
                                    {items.map(item => {
                                        flatIdx++;
                                        const idx = flatIdx;
                                        return (
                                            <div key={item.id}
                                                className={`command-item ${idx === activeIndex ? 'active' : ''}`}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                onClick={() => { item.action(); setOpen(false); }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </div>
                                                <ArrowRight size={12} style={{ opacity: idx === activeIndex ? 1 : 0 }} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
