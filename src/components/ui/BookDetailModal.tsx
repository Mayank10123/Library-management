import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, User, Calendar, Hash, Building } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { Book } from '../../data/mockData';

interface Props {
    book: Book | null;
    onClose: () => void;
}

const BookDetailModal: React.FC<Props> = ({ book, onClose }) => {
    const { transactions, members } = useLibrary();

    if (!book) return null;

    const bookTxns = transactions.filter(t => t.bookId === book.id).slice(0, 8);

    return (
        <AnimatePresence>
            {book && (
                <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}>
                    <motion.div className="book-detail-modal"
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 30 }}
                        transition={{ type: 'spring', damping: 22 }}
                        onClick={e => e.stopPropagation()}>

                        <button className="modal-close-btn" onClick={onClose}>
                            <X size={18} />
                        </button>

                        <div className="book-detail-header">
                            <div className="book-detail-cover" style={{ background: book.coverColor || 'var(--accent-gradient)' }}>
                                <BookOpen size={32} style={{ color: 'rgba(255,255,255,0.7)' }} />
                            </div>
                            <div className="book-detail-info">
                                <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--sp-1)' }}>{book.title}</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-3)' }}>{book.author}</p>
                                <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                                    <span className="badge badge-accent">{book.category}</span>
                                    <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                                        {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="book-detail-grid">
                            <div className="book-detail-field">
                                <Hash size={13} />
                                <div><span className="field-label">ISBN</span><span className="field-value">{book.isbn}</span></div>
                            </div>
                            <div className="book-detail-field">
                                <Building size={13} />
                                <div><span className="field-label">Publisher</span><span className="field-value">{book.publisher}</span></div>
                            </div>
                            <div className="book-detail-field">
                                <Calendar size={13} />
                                <div><span className="field-label">Year</span><span className="field-value">{book.year}</span></div>
                            </div>
                            <div className="book-detail-field">
                                <User size={13} />
                                <div><span className="field-label">Copies</span><span className="field-value">{book.availableCopies}/{book.totalCopies}</span></div>
                            </div>
                        </div>

                        {/* Availability bar */}
                        <div style={{ marginBottom: 'var(--sp-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-1)', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                                <span>Availability</span>
                                <span>{Math.round((book.availableCopies / book.totalCopies) * 100)}%</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-glass)', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    style={{ height: '100%', borderRadius: 3, background: book.availableCopies > 0 ? 'var(--success)' : 'var(--danger)' }}
                                />
                            </div>
                        </div>

                        {bookTxns.length > 0 && (
                            <>
                                <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Recent Activity</h3>
                                <div className="data-table-container" style={{ borderRadius: 'var(--radius-md)' }}>
                                    <table className="data-table">
                                        <thead><tr><th>Member</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {bookTxns.map(t => {
                                                const mem = members.find(m => m.id === t.memberId);
                                                return (
                                                    <tr key={t.id}>
                                                        <td style={{ color: 'var(--text-primary)' }}>{mem?.name}</td>
                                                        <td>{t.type}</td>
                                                        <td>{t.issueDate}</td>
                                                        <td><span className={`badge ${t.status === 'returned' ? 'badge-success' : t.status === 'overdue' ? 'badge-danger' : 'badge-info'}`}>{t.status}</span></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BookDetailModal;
