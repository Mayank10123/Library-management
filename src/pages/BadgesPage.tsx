import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Zap, Award, Lock } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

// Mock leaderboard
const LEADERBOARD = [
    { name: 'Sarah Parker', xp: 580, level: 6, avatar: 'S', streak: 12 },
    { name: 'Dr. Emily Foster', xp: 420, level: 5, avatar: 'E', streak: 8 },
    { name: 'Lisa Chang', xp: 350, level: 4, avatar: 'L', streak: 5 },
    { name: 'James Wilson', xp: 290, level: 3, avatar: 'J', streak: 3 },
    { name: 'Raj Patel', xp: 245, level: 3, avatar: 'R', streak: 5 },
    { name: 'Kevin Wright', xp: 180, level: 2, avatar: 'K', streak: 2 },
    { name: 'Anna Clark', xp: 120, level: 2, avatar: 'A', streak: 1 },
    { name: 'Sophie Turner', xp: 80, level: 1, avatar: 'T', streak: 0 },
];

const BadgesPage: React.FC = () => {
    const { state, xpProgress } = useGamification();
    const unlockedCount = state.badges.filter(b => b.unlocked).length;

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Achievements</motion.h1>
                <motion.p variants={item}>Track your reading journey and unlock badges.</motion.p>
            </div>

            {/* XP & Level Card */}
            <motion.div className="glass-card" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-5)' }} variants={item}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-6)', flexWrap: 'wrap' }}>
                    {/* Level Ring */}
                    <div style={{ position: 'relative', width: 90, height: 90 }}>
                        <svg width="90" height="90" viewBox="0 0 90 90">
                            <circle cx="45" cy="45" r="38" fill="none" stroke="var(--bg-glass)" strokeWidth="6" />
                            <circle cx="45" cy="45" r="38" fill="none" stroke="var(--accent-primary)" strokeWidth="6"
                                strokeDasharray={`${2 * Math.PI * 38}`}
                                strokeDashoffset={`${2 * Math.PI * 38 * (1 - xpProgress() / 100)}`}
                                strokeLinecap="round" transform="rotate(-90 45 45)"
                                style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-tertiary)' }}>{state.level}</div>
                            <div style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Level</div>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                            <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>{state.xp}</span>
                            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>XP</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-glass)', overflow: 'hidden', marginBottom: 'var(--sp-2)' }}>
                            <div style={{ height: '100%', borderRadius: 3, background: 'var(--accent-gradient)', width: `${xpProgress()}%`, transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                            {Math.round(state.level * 100 - state.xp)} XP to Level {state.level + 1}
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
                        {[
                            { icon: <Flame size={18} />, value: `${state.streak}🔥`, label: 'Day streak', color: 'var(--danger)' },
                            { icon: <Star size={18} />, value: state.booksRead, label: 'Books read', color: 'var(--warning)' },
                            { icon: <Award size={18} />, value: `${unlockedCount}/${state.badges.length}`, label: 'Badges', color: 'var(--accent-tertiary)' },
                        ].map(s => (
                            <div key={s.label} style={{ textAlign: 'center' }}>
                                <div style={{ color: s.color, marginBottom: 2 }}>{s.icon}</div>
                                <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{s.value}</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-5)' }}>
                {/* Badges Grid */}
                <motion.div variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
                        <Trophy size={16} style={{ color: 'var(--warning)', marginRight: 6 }} />
                        Badges ({unlockedCount}/{state.badges.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--sp-3)' }}>
                        {state.badges.map(badge => (
                            <motion.div key={badge.id} className="glass-card"
                                style={{
                                    padding: 'var(--sp-4)', textAlign: 'center',
                                    opacity: badge.unlocked ? 1 : 0.45,
                                    filter: badge.unlocked ? 'none' : 'grayscale(1)',
                                }}
                                whileHover={badge.unlocked ? { scale: 1.05, y: -2 } : {}}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-2)' }}>{badge.icon}</div>
                                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 2 }}>{badge.name}</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', lineHeight: 1.3 }}>
                                    {badge.description}
                                </div>
                                {badge.unlocked ? (
                                    <div style={{ fontSize: '0.55rem', color: 'var(--success)', marginTop: 'var(--sp-2)' }}>
                                        ✓ Unlocked {badge.unlockedDate}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 'var(--sp-2)', fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>
                                        <Lock size={8} /> Locked
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Leaderboard */}
                <motion.div className="glass-card" style={{ padding: 'var(--sp-5)', height: 'fit-content' }} variants={item}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <Zap size={16} style={{ color: 'var(--warning)' }} /> Leaderboard
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                        {LEADERBOARD.map((user, i) => (
                            <div key={user.name} style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                                padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--radius-sm)',
                                background: i < 3 ? `rgba(250, 204, 21, ${0.08 - i * 0.02})` : 'transparent',
                            }}>
                                <div style={{
                                    width: 20, fontSize: 'var(--fs-xs)', fontWeight: 700, textAlign: 'center',
                                    color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : 'var(--text-tertiary)',
                                }}>
                                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}`}
                                </div>
                                <div style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: 'var(--accent-gradient)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.65rem', fontWeight: 700, color: 'white',
                                }}>{user.avatar}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>{user.name}</div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>Lv.{user.level} · {user.streak}🔥</div>
                                </div>
                                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--accent-tertiary)' }}>
                                    {user.xp} <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent XP */}
            <motion.div className="glass-card" style={{ padding: 'var(--sp-5)', marginTop: 'var(--sp-5)' }} variants={item}>
                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>Recent XP Gains</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                    {state.recentXP.map((xp, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-2) var(--sp-3)' }}>
                            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{xp.reason}</span>
                            <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--success)' }}>+{xp.amount} XP</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BadgesPage;
