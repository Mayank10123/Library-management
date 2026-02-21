import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Clock } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

// Fuzzy matching with Levenshtein distance
function levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= a.length; i++) matrix[i] = [i];
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }
    return matrix[a.length][b.length];
}

function fuzzyMatch(query: string, text: string): number {
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    if (t.includes(q)) return 0; // Exact substring = best match
    const words = t.split(/\s+/);
    let bestScore = Infinity;
    for (const word of words) {
        const dist = levenshtein(q, word.substring(0, q.length + 2));
        bestScore = Math.min(bestScore, dist);
    }
    return bestScore;
}

interface SearchResult {
    id: string;
    title: string;
    author: string;
    category: string;
    coverColor: string;
    score: number;
    matchField: string;
}

const AdvancedSearch: React.FC<{ onClose?: () => void }> = ({ onClose: _onClose }) => {
    const { books } = useLibrary();
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<string[]>(() => {
        try { return JSON.parse(localStorage.getItem('koha_search_history') || '[]'); } catch { return []; }
    });
    const [categoryFilter, setCategoryFilter] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const results = useMemo<SearchResult[]>(() => {
        if (!query.trim()) return [];
        const maxDist = Math.max(2, Math.floor(query.length * 0.4));
        const matches: SearchResult[] = [];

        for (const book of books) {
            if (categoryFilter && book.category !== categoryFilter) continue;

            const titleScore = fuzzyMatch(query, book.title);
            const authorScore = fuzzyMatch(query, book.author);
            const catScore = fuzzyMatch(query, book.category);
            const isbnScore = book.isbn.includes(query) ? 0 : Infinity;

            let bestScore = Math.min(titleScore, authorScore, catScore, isbnScore);
            let matchField = 'title';
            if (authorScore < titleScore && authorScore <= catScore) matchField = 'author';
            if (catScore < titleScore && catScore < authorScore) matchField = 'category';
            if (isbnScore === 0) { matchField = 'isbn'; bestScore = 0; }

            if (bestScore <= maxDist) {
                matches.push({
                    id: book.id, title: book.title, author: book.author,
                    category: book.category, coverColor: book.coverColor,
                    score: bestScore, matchField,
                });
            }
        }

        return matches.sort((a, b) => a.score - b.score).slice(0, 15);
    }, [query, books, categoryFilter]);

    const doSearch = (q: string) => {
        setQuery(q);
        if (q.trim() && !history.includes(q.trim())) {
            const newHistory = [q.trim(), ...history].slice(0, 8);
            setHistory(newHistory);
            localStorage.setItem('koha_search_history', JSON.stringify(newHistory));
        }
    };

    const categories = [...new Set(books.map(b => b.category))];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card" style={{ padding: 'var(--sp-5)' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                <Search size={18} style={{ color: 'var(--accent-tertiary)' }} />
                <input
                    ref={inputRef}
                    value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doSearch(query)}
                    placeholder="Search books, authors, ISBNs... (typo-tolerant)"
                    style={{
                        flex: 1, border: 'none', outline: 'none',
                        background: 'transparent', color: 'var(--text-primary)',
                        fontSize: 'var(--fs-md)', fontFamily: 'inherit',
                    }}
                />
                {query && (
                    <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)', flexWrap: 'wrap' }}>
                <button className={`btn btn-ghost ${!categoryFilter ? 'active' : ''}`} onClick={() => setCategoryFilter('')}
                    style={{ fontSize: 'var(--fs-xs)', padding: '3px 10px', borderRadius: 20 }}>All</button>
                {categories.map(c => (
                    <button key={c} className={`btn btn-ghost ${categoryFilter === c ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(categoryFilter === c ? '' : c)}
                        style={{ fontSize: 'var(--fs-xs)', padding: '3px 10px', borderRadius: 20 }}>{c}</button>
                ))}
            </div>

            {/* Search History */}
            {!query && history.length > 0 && (
                <div style={{ marginBottom: 'var(--sp-3)' }}>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={10} /> Recent Searches
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                        {history.map(h => (
                            <button key={h} onClick={() => { setQuery(h); doSearch(h); }}
                                style={{
                                    fontSize: 'var(--fs-xs)', padding: '3px 10px', borderRadius: 20,
                                    background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit',
                                }}>{h}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {query && (
                <div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)' }}>
                        {results.length} result{results.length !== 1 && 's'} {results.length > 0 && '— sorted by relevance'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', maxHeight: 350, overflowY: 'auto' }}>
                        {results.map(r => (
                            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                                    padding: 'var(--sp-2) var(--sp-3)',
                                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                    background: 'var(--bg-glass)',
                                }} whileHover={{ background: 'var(--bg-glass-hover)' }}>
                                <div style={{ width: 30, height: 42, borderRadius: 3, background: r.coverColor, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{r.title}</div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{r.author} · {r.category}</div>
                                </div>
                                <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', background: 'var(--bg-glass)', padding: '2px 6px', borderRadius: 4 }}>
                                    {r.matchField}
                                </span>
                                {r.score === 0 && <span style={{ fontSize: '0.5rem', color: 'var(--success)' }}>exact</span>}
                            </motion.div>
                        ))}
                        {results.length === 0 && (
                            <div style={{ textAlign: 'center', padding: 'var(--sp-4)', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
                                No matches found. Try a different spelling!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AdvancedSearch;
