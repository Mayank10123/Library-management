import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface ContextMenuItem {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    danger?: boolean;
    divider?: boolean;
}

interface ContextMenuState {
    x: number;
    y: number;
    items: ContextMenuItem[];
}

const ContextMenuContext = React.createContext<{
    show: (x: number, y: number, items: ContextMenuItem[]) => void;
    hide: () => void;
}>({ show: () => { }, hide: () => { } });

export const useContextMenu = () => React.useContext(ContextMenuContext);

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [menu, setMenu] = useState<ContextMenuState | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const show = useCallback((x: number, y: number, items: ContextMenuItem[]) => {
        // Adjust position to stay in viewport
        const maxX = window.innerWidth - 200;
        const maxY = window.innerHeight - items.length * 40;
        setMenu({ x: Math.min(x, maxX), y: Math.min(y, maxY), items });
    }, []);

    const hide = useCallback(() => setMenu(null), []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) hide();
        };
        const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', escHandler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', escHandler);
        };
    }, [hide]);

    return (
        <ContextMenuContext.Provider value={{ show, hide }}>
            {children}
            <AnimatePresence>
                {menu && (
                    <motion.div ref={ref}
                        className="glass-card context-menu"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.12 }}
                        style={{
                            position: 'fixed', left: menu.x, top: menu.y,
                            zIndex: 10000, padding: 'var(--sp-1)',
                            minWidth: 180, borderRadius: 'var(--radius-md)',
                        }}>
                        {menu.items.map((item, i) => (
                            <React.Fragment key={i}>
                                {item.divider && <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />}
                                <button
                                    onClick={() => { item.onClick(); hide(); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                                        width: '100%', padding: 'var(--sp-2) var(--sp-3)',
                                        border: 'none', background: 'transparent',
                                        fontSize: 'var(--fs-sm)', cursor: 'pointer',
                                        borderRadius: 'var(--radius-sm)',
                                        color: item.danger ? 'var(--danger)' : 'var(--text-primary)',
                                        transition: 'background var(--transition-fast)',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.1)' : 'var(--bg-glass-hover)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {item.icon && <item.icon size={14} />}
                                    {item.label}
                                </button>
                            </React.Fragment>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </ContextMenuContext.Provider>
    );
};
