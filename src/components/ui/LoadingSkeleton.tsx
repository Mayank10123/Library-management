import React from 'react';
import { motion } from 'framer-motion';

const shimmer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const bar = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
};

const LoadingSkeleton: React.FC = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Sidebar skeleton */}
            <div style={{ width: 260, padding: 'var(--sp-5)', borderRight: '1px solid var(--border-color)' }}>
                <div className="skeleton-block" style={{ width: 120, height: 32, marginBottom: 'var(--sp-8)', borderRadius: 'var(--radius-md)' }} />
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="skeleton-block" style={{ width: '100%', height: 36, marginBottom: 'var(--sp-3)', borderRadius: 'var(--radius-md)' }} />
                ))}
            </div>

            {/* Main content skeleton */}
            <div style={{ flex: 1, padding: 'var(--sp-8)' }}>
                {/* Header bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-8)' }}>
                    <div className="skeleton-block" style={{ width: 300, height: 40, borderRadius: 'var(--radius-md)' }} />
                    <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                        <div className="skeleton-block" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                        <div className="skeleton-block" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    </div>
                </div>

                {/* Title */}
                <motion.div variants={shimmer} initial="hidden" animate="show">
                    <motion.div variants={bar} className="skeleton-block" style={{ width: 200, height: 28, marginBottom: 'var(--sp-2)', borderRadius: 'var(--radius-sm)' }} />
                    <motion.div variants={bar} className="skeleton-block" style={{ width: 320, height: 16, marginBottom: 'var(--sp-8)', borderRadius: 'var(--radius-sm)' }} />

                    {/* Stat cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-5)', marginBottom: 'var(--sp-8)' }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <motion.div key={i} variants={bar} className="skeleton-block" style={{ height: 110, borderRadius: 'var(--radius-lg)' }} />
                        ))}
                    </div>

                    {/* Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--sp-5)' }}>
                        <motion.div variants={bar} className="skeleton-block" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />
                        <motion.div variants={bar} className="skeleton-block" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
