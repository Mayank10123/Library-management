import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Search, CheckCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';
import Confetti from '../components/ui/Confetti';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const IssuePage: React.FC = () => {
    const { books, members, issueBook } = useLibrary();
    const { toast } = useToast();
    const [memberSearch, setMemberSearch] = useState('');
    const [bookSearch, setBookSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [selectedBook, setSelectedBook] = useState<string | null>(null);
    const [issued, setIssued] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const filteredMembers = useMemo(() => {
        if (!memberSearch) return [];
        const q = memberSearch.toLowerCase();
        return members.filter(m => m.status === 'active' && (m.name.toLowerCase().includes(q) || m.id.includes(q) || m.email.toLowerCase().includes(q))).slice(0, 5);
    }, [members, memberSearch]);

    const filteredBooks = useMemo(() => {
        if (!bookSearch) return [];
        const q = bookSearch.toLowerCase();
        return books.filter(b => b.availableCopies > 0 && (b.title.toLowerCase().includes(q) || b.isbn.includes(q) || b.author.toLowerCase().includes(q))).slice(0, 5);
    }, [books, bookSearch]);

    const selMember = members.find(m => m.id === selectedMember);
    const selBook = books.find(b => b.id === selectedBook);

    const handleIssue = () => {
        if (!selectedMember || !selectedBook) return;
        const txn = issueBook(selectedBook, selectedMember);
        if (txn) {
            toast('success', `Book issued successfully! Due: ${txn.dueDate}`);
            setIssued(true);
            setShowConfetti(true);
            setTimeout(() => {
                setIssued(false);
                setSelectedMember(null); setSelectedBook(null);
                setMemberSearch(''); setBookSearch('');
            }, 2500);
        } else {
            toast('error', 'Failed to issue book. Check availability.');
        }
    };

    return (
        <>
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
                <div className="page-header">
                    <motion.h1 variants={item}>Issue Book</motion.h1>
                    <motion.p variants={item}>Issue a book to a library member.</motion.p>
                </div>

                {issued ? (
                    <motion.div className="glass-card text-center" style={{ padding: 'var(--sp-12)' }}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                            <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 'var(--sp-4)' }} />
                        </motion.div>
                        <h2 style={{ marginBottom: 'var(--sp-2)' }}>Book Issued Successfully!</h2>
                        <p className="text-muted">The transaction has been recorded.</p>
                    </motion.div>
                ) : (
                    <div className="grid-2">
                        {/* Member Selection */}
                        <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                            <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                                1. Select Member
                            </h3>
                            <div style={{ position: 'relative', marginBottom: 'var(--sp-4)' }}>
                                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input className="form-input" placeholder="Search by name, ID, or email..."
                                    value={memberSearch} onChange={e => { setMemberSearch(e.target.value); setSelectedMember(null); }}
                                    style={{ paddingLeft: 36 }} />
                            </div>
                            {filteredMembers.length > 0 && !selectedMember && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                                    {filteredMembers.map(m => (
                                        <div key={m.id} className="glass-panel" onClick={() => { setSelectedMember(m.id); setMemberSearch(m.name); }}
                                            style={{ padding: 'var(--sp-3) var(--sp-4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'white' }}>
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{m.id} · {m.department}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selMember && (
                                <motion.div className="glass-panel" style={{ padding: 'var(--sp-4)', borderColor: 'var(--border-accent)' }}
                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', marginBottom: 'var(--sp-2)' }}>
                                        <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                                        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--success)' }}>Selected</span>
                                    </div>
                                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}><strong>{selMember.name}</strong></div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{selMember.department} · {selMember.membershipType} · Books: {selMember.booksIssued}</div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Book Selection */}
                        <motion.div className="glass-card" style={{ padding: 'var(--sp-6)' }} variants={item}>
                            <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                                2. Select Book
                            </h3>
                            <div style={{ position: 'relative', marginBottom: 'var(--sp-4)' }}>
                                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input className="form-input" placeholder="Search by title, ISBN, or author..."
                                    value={bookSearch} onChange={e => { setBookSearch(e.target.value); setSelectedBook(null); }}
                                    style={{ paddingLeft: 36 }} />
                            </div>
                            {filteredBooks.length > 0 && !selectedBook && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                                    {filteredBooks.map(b => (
                                        <div key={b.id} className="glass-panel" onClick={() => { setSelectedBook(b.id); setBookSearch(b.title); }}
                                            style={{ padding: 'var(--sp-3) var(--sp-4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                            <div style={{ width: 36, height: 48, borderRadius: 4, background: b.coverColor, flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{b.title}</div>
                                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{b.author} · {b.availableCopies} available</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selBook && (
                                <motion.div className="glass-panel" style={{ padding: 'var(--sp-4)', borderColor: 'var(--border-accent)' }}
                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', marginBottom: 'var(--sp-2)' }}>
                                        <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                                        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--success)' }}>Selected</span>
                                    </div>
                                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}><strong>{selBook.title}</strong></div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{selBook.author} · {selBook.location} · {selBook.availableCopies} copies</div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}

                {!issued && selectedMember && selectedBook && (
                    <motion.div style={{ marginTop: 'var(--sp-6)', textAlign: 'center' }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <button className="btn btn-primary btn-lg" onClick={handleIssue}>
                            <BookMarked size={18} /> Issue Book
                        </button>
                    </motion.div>
                )}
            </motion.div>
            <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />
        </>
    );
};

export default IssuePage;
