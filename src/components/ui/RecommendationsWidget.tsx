import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

const RecommendationsWidget: React.FC = () => {
    const { books, transactions } = useLibrary();

    // Calculate trending: most borrowed
    const trending = useMemo(() => {
        const countMap: Record<string, number> = {};
        transactions.forEach(t => { countMap[t.bookId] = (countMap[t.bookId] || 0) + 1; });
        return Object.entries(countMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([id, count]) => ({ book: books.find(b => b.id === id), count }))
            .filter(r => r.book);
    }, [books, transactions]);

    // "If you liked X, try Y" — same category
    const recommendations = useMemo(() => {
        const pairs: { liked: string; try: typeof books[0] }[] = [];
        const borrowed = transactions.slice(0, 5);
        for (const t of borrowed) {
            const borrowedBook = books.find(b => b.id === t.bookId);
            if (!borrowedBook) continue;
            const similar = books.find(b =>
                b.id !== borrowedBook.id &&
                b.category === borrowedBook.category &&
                !pairs.some(p => p.try.id === b.id)
            );
            if (similar) {
                pairs.push({ liked: borrowedBook.title, try: similar });
            }
            if (pairs.length >= 3) break;
        }
        return pairs;
    }, [books, transactions]);

    return (
        <div>
            {/* Trending section */}
            <div className="glass-card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
                <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TrendingUp size={15} style={{ color: 'var(--danger)' }} /> Trending Now
                </h3>
                <div style={{ display: 'flex', gap: 'var(--sp-3)', overflowX: 'auto' }}>
                    {trending.map(({ book, count }) => book && (
                        <motion.div key={book.id} style={{
                            minWidth: 130, padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-glass)', textAlign: 'center', cursor: 'pointer',
                        }} whileHover={{ y: -3 }}>
                            <div style={{ width: 50, height: 70, borderRadius: 4, background: book.coverColor, margin: '0 auto var(--sp-2)' }} />
                            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, lineHeight: 1.3 }}>{book.title.substring(0, 25)}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{count} borrows</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Personalized recommendations */}
            <div className="glass-card" style={{ padding: 'var(--sp-5)' }}>
                <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={15} style={{ color: 'var(--warning)' }} /> Recommended For You
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {recommendations.map(rec => (
                        <div key={rec.try.id} style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                            padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)',
                        }}>
                            <div style={{ width: 36, height: 50, borderRadius: 4, background: rec.try.coverColor, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{rec.try.title}</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                                    Because you liked "{rec.liked.substring(0, 30)}"
                                </div>
                            </div>
                            <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                        </div>
                    ))}
                    {recommendations.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 'var(--sp-4)', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>
                            <BookOpen size={24} style={{ marginBottom: 6 }} /><br />
                            Borrow more books to get personalized recommendations!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationsWidget;
