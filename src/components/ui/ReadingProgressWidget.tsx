import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Flame, TrendingUp } from 'lucide-react';

interface ReadingBook {
    id: string;
    title: string;
    totalPages: number;
    pagesRead: number;
    coverColor: string;
}

const READING_DATA: ReadingBook[] = [
    { id: 'rp1', title: 'Clean Code', totalPages: 464, pagesRead: 312, coverColor: '#7c3aed' },
    { id: 'rp2', title: 'The Great Gatsby', totalPages: 180, pagesRead: 180, coverColor: '#10b981' },
    { id: 'rp3', title: 'Thinking, Fast and Slow', totalPages: 499, pagesRead: 145, coverColor: '#f59e0b' },
];

const WEEKLY_GOAL = 200; // pages per week
const PAGES_THIS_WEEK = 142;

const ReadingProgressWidget: React.FC = () => {
    const goalProgress = Math.min((PAGES_THIS_WEEK / WEEKLY_GOAL) * 100, 100);

    return (
        <div>
            {/* Weekly Goal */}
            <div className="glass-card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
                    <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Target size={15} style={{ color: 'var(--accent-tertiary)' }} /> Weekly Reading Goal
                    </h3>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{PAGES_THIS_WEEK}/{WEEKLY_GOAL} pages</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-glass)', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goalProgress}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{
                            height: '100%', borderRadius: 4,
                            background: goalProgress >= 100 ? 'var(--success)' : 'var(--accent-gradient)',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--sp-2)' }}>
                    <span style={{ fontSize: 'var(--fs-xs)', color: goalProgress >= 100 ? 'var(--success)' : 'var(--text-tertiary)' }}>
                        {goalProgress >= 100 ? '🎉 Goal reached!' : `${WEEKLY_GOAL - PAGES_THIS_WEEK} pages to go`}
                    </span>
                    <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--accent-tertiary)' }}>
                        {Math.round(goalProgress)}%
                    </span>
                </div>
            </div>

            {/* Currently Reading */}
            <div className="glass-card" style={{ padding: 'var(--sp-5)' }}>
                <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BookOpen size={15} style={{ color: 'var(--info)' }} /> Currently Reading
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {READING_DATA.map(book => {
                        const pct = Math.round((book.pagesRead / book.totalPages) * 100);
                        const isComplete = pct >= 100;
                        return (
                            <div key={book.id} style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                                padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)',
                            }}>
                                <div style={{ width: 34, height: 48, borderRadius: 4, background: book.coverColor, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                                    {/* Progress fill on cover */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        height: `${100 - pct}%`, background: 'rgba(0,0,0,0.4)',
                                        transition: 'height 0.5s ease',
                                    }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{book.title}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginTop: 4 }}>
                                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--bg-glass)', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${pct}%`, height: '100%', borderRadius: 2,
                                                background: isComplete ? 'var(--success)' : 'var(--accent-primary)',
                                                transition: 'width 0.5s ease',
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '0.6rem', color: isComplete ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                                            {pct}%
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                        {book.pagesRead} of {book.totalPages} pages {isComplete && '✓ Complete'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reading Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }}>
                <div className="glass-card" style={{ padding: 'var(--sp-4)', textAlign: 'center' }}>
                    <Flame size={20} style={{ color: 'var(--danger)', marginBottom: 4 }} />
                    <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>5 🔥</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>Day Streak</div>
                </div>
                <div className="glass-card" style={{ padding: 'var(--sp-4)', textAlign: 'center' }}>
                    <TrendingUp size={20} style={{ color: 'var(--success)', marginBottom: 4 }} />
                    <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>637</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>Pages this month</div>
                </div>
            </div>
        </div>
    );
};

export default ReadingProgressWidget;
