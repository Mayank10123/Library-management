import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, BookOpen, MapPin } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import BookDetailModal from '../components/ui/BookDetailModal';
import type { Book } from '../data/mockData';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const BooksPage: React.FC = () => {
    const { books } = useLibrary();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [availability, setAvailability] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const categories = useMemo(() => [...new Set(books.map(b => b.category))].sort(), [books]);

    const filtered = useMemo(() => {
        return books.filter(b => {
            const q = search.toLowerCase();
            const matchesSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
                || b.isbn.includes(q) || b.category.toLowerCase().includes(q);
            const matchesCat = !category || b.category === category;
            const matchesAvail = !availability
                || (availability === 'available' && b.availableCopies > 0)
                || (availability === 'unavailable' && b.availableCopies === 0);
            return matchesSearch && matchesCat && matchesAvail;
        });
    }, [books, search, category, availability]);

    return (
        <>
            <motion.div variants={container} initial="hidden" animate="show">
                <div className="page-header">
                    <motion.h1 variants={item}>Book Catalog</motion.h1>
                    <motion.p variants={item}>Browse and search through {books.length} books in the library.</motion.p>
                </div>

                <motion.div className="filters-bar" variants={item}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            className="filter-input"
                            placeholder="Search by title, author, ISBN..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 36, width: '100%' }}
                        />
                    </div>
                    <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="filter-select" value={availability} onChange={e => setAvailability(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                    <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
                        <button className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}
                            style={viewMode === 'grid' ? { borderColor: 'var(--accent-primary)', color: 'var(--accent-tertiary)' } : {}}>
                            <Grid size={16} />
                        </button>
                        <button className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}
                            style={viewMode === 'list' ? { borderColor: 'var(--accent-primary)', color: 'var(--accent-tertiary)' } : {}}>
                            <List size={16} />
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {viewMode === 'grid' ? (
                        <motion.div
                            key="grid"
                            className="book-grid"
                            variants={container}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0 }}
                        >
                            {filtered.map(book => (
                                <motion.div key={book.id} className="glass-card book-card" variants={item} whileHover={{ y: -4 }}
                                    onClick={() => setSelectedBook(book)} style={{ cursor: 'pointer' }}>
                                    <div className="book-cover" style={{ background: book.coverColor }}>
                                        <BookOpen size={40} color="rgba(255,255,255,0.6)" />
                                    </div>
                                    <div className="book-title">{book.title}</div>
                                    <div className="book-author">{book.author}</div>
                                    <div className="book-meta">
                                        <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                                            {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Unavailable'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                                            <MapPin size={10} /> {book.location}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="data-table-container glass-card">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Book</th>
                                            <th>Author</th>
                                            <th>ISBN</th>
                                            <th>Category</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(book => (
                                            <tr key={book.id} onClick={() => setSelectedBook(book)} style={{ cursor: 'pointer' }}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                                        <div style={{
                                                            width: 36, height: 48, borderRadius: 4,
                                                            background: book.coverColor,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                        }}>
                                                            <BookOpen size={14} color="rgba(255,255,255,0.7)" />
                                                        </div>
                                                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{book.title}</span>
                                                    </div>
                                                </td>
                                                <td>{book.author}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: 'var(--fs-xs)' }}>{book.isbn}</td>
                                                <td><span className="badge badge-accent">{book.category}</span></td>
                                                <td>{book.location}</td>
                                                <td>
                                                    <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                                                        {book.availableCopies}/{book.totalCopies}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="empty-state">
                        <BookOpen size={48} />
                        <h3>No books found</h3>
                        <p>Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </motion.div>
            <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
        </>
    );
};

export default BooksPage;
