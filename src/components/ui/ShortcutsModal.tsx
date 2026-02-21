import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { SHORTCUT_LIST } from './KeyboardShortcuts';

interface Props { open: boolean; onClose: () => void; }

const ShortcutsModal: React.FC<Props> = ({ open, onClose }) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9000, backdropFilter: 'blur(4px)' }} />
                    <motion.div className="glass-card shortcuts-modal"
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        style={{
                            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '90%', maxWidth: 600, maxHeight: '80vh', overflow: 'auto',
                            padding: 'var(--sp-6)', zIndex: 9001,
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                                <Keyboard size={20} style={{ color: 'var(--accent-tertiary)' }} />
                                <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>Keyboard Shortcuts</h2>
                            </div>
                            <button className="btn-icon" onClick={onClose}><X size={18} /></button>
                        </div>

                        {SHORTCUT_LIST.map(cat => (
                            <div key={cat.category} style={{ marginBottom: 'var(--sp-5)' }}>
                                <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)' }}>
                                    {cat.category}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
                                    {cat.shortcuts.map(s => (
                                        <div key={s.description} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--radius-sm)',
                                        }}>
                                            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{s.description}</span>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {s.keys.map((k, i) => (
                                                    <React.Fragment key={i}>
                                                        {i > 0 && <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-xs)', lineHeight: '24px' }}>then</span>}
                                                        <kbd style={{
                                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                            minWidth: 24, height: 24, padding: '0 6px',
                                                            background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                                                            borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 600,
                                                            fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-primary)',
                                                        }}>{k}</kbd>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div style={{ textAlign: 'center', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--sp-3)' }}>
                            Press <kbd style={{ padding: '0 4px', background: 'var(--bg-glass)', borderRadius: 4, fontSize: '0.65rem' }}>?</kbd> anytime to open this panel
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShortcutsModal;
