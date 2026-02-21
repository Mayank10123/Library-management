import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, BookOpen, Search, Calendar, Settings, Keyboard } from 'lucide-react';

interface TourStep {
    target: string; // CSS selector or description
    title: string;
    description: string;
    icon: React.ReactNode;
    position: { top: string; left: string };
}

const TOUR_STEPS: TourStep[] = [
    {
        target: '.sidebar', title: 'Sidebar Navigation',
        description: 'Access all sections of the library: books, members, circulation, fines, and more. Collapse it for more space.',
        icon: <BookOpen size={20} />, position: { top: '200px', left: '280px' },
    },
    {
        target: '.app-header', title: 'Quick Search & Themes',
        description: 'Use the search bar or press Ctrl+K for the command palette. Click the palette icon to customize colors.',
        icon: <Search size={20} />, position: { top: '80px', left: '50%' },
    },
    {
        target: '.stats-grid', title: 'Dashboard Stats',
        description: 'See real-time library metrics at a glance. The numbers animate in when the page loads.',
        icon: <Calendar size={20} />, position: { top: '280px', left: '50%' },
    },
    {
        target: '.sidebar-nav', title: 'New in v3: Calendar & Timeline',
        description: 'View due dates on a calendar, browse the activity timeline, and explore the eBook store!',
        icon: <Calendar size={20} />, position: { top: '350px', left: '280px' },
    },
    {
        target: '.app-header', title: 'Keyboard Shortcuts',
        description: 'Press ? to see all keyboard shortcuts. Use G+B for Books, G+M for Members, N+B for new book, and more.',
        icon: <Keyboard size={20} />, position: { top: '80px', left: '70%' },
    },
    {
        target: '.sidebar-footer', title: 'Settings & Customization',
        description: 'Head to Settings to configure themes, export/import data, and customize your library setup. Enjoy!',
        icon: <Settings size={20} />, position: { top: '80vh', left: '100px' },
    },
];

const STORAGE_KEY = 'koha_onboarding_complete';

const OnboardingTour: React.FC = () => {
    const [active, setActive] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const done = localStorage.getItem(STORAGE_KEY);
        if (!done) {
            const timer = setTimeout(() => setActive(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const completeTour = useCallback(() => {
        setActive(false);
        localStorage.setItem(STORAGE_KEY, 'true');
    }, []);

    const nextStep = () => {
        if (step < TOUR_STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            completeTour();
        }
    };

    const prevStep = () => { if (step > 0) setStep(s => s - 1); };

    if (!active) return null;

    const current = TOUR_STEPS[step];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, zIndex: 20000 }}
            >
                {/* Backdrop */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(3px)',
                }} />

                {/* Tooltip */}
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="glass-card"
                    style={{
                        position: 'absolute',
                        top: current.position.top, left: current.position.left,
                        transform: 'translateX(-50%)',
                        width: 360, padding: 'var(--sp-5)',
                        zIndex: 20001,
                    }}
                >
                    <button className="btn-icon" onClick={completeTour}
                        style={{ position: 'absolute', top: 8, right: 8 }}>
                        <X size={16} />
                    </button>

                    <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                        background: 'var(--accent-gradient)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', marginBottom: 'var(--sp-3)',
                    }}>
                        {current.icon}
                    </div>

                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 700, marginBottom: 'var(--sp-2)' }}>
                        {current.title}
                    </h3>
                    <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--sp-4)' }}>
                        {current.description}
                    </p>

                    {/* Progress dots */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {TOUR_STEPS.map((_, i) => (
                                <div key={i} style={{
                                    width: i === step ? 16 : 6, height: 6, borderRadius: 3,
                                    background: i === step ? 'var(--accent-primary)' : 'var(--bg-glass)',
                                    transition: 'all 0.2s',
                                }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                            {step > 0 && (
                                <button className="btn btn-ghost" onClick={prevStep} style={{ fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-3)' }}>
                                    Back
                                </button>
                            )}
                            <button className="btn btn-primary" onClick={nextStep} style={{ fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-3)' }}>
                                {step === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
                                {step < TOUR_STEPS.length - 1 && <ChevronRight size={14} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--sp-2)' }}>
                        Step {step + 1} of {TOUR_STEPS.length}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OnboardingTour;
