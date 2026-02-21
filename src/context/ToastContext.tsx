import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: string; type: ToastType; message: string; }

interface ToastContextType {
    toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = `toast-${toastId++}`;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    const icons = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertTriangle };

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map(t => {
                        const Icon = icons[t.type];
                        return (
                            <motion.div
                                key={t.id}
                                className={`toast toast-${t.type}`}
                                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            >
                                <Icon size={18} />
                                <span style={{ flex: 1 }}>{t.message}</span>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 2, display: 'flex' }}
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};
