import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--bg-primary)', fontFamily: "'Inter', sans-serif",
                }}>
                    <div style={{
                        textAlign: 'center', maxWidth: 420, padding: 'var(--sp-10)',
                        background: 'rgba(20,24,50,0.65)', borderRadius: 'var(--radius-xl)',
                        border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', margin: '0 auto var(--sp-5)',
                            background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 28,
                        }}>
                            💥
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 'var(--sp-2)' }}>
                            Something went wrong
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 'var(--sp-6)', lineHeight: 1.6 }}>
                            An unexpected error occurred. Click below to reload.
                        </p>
                        {this.state.error && (
                            <details style={{ marginBottom: 'var(--sp-5)', textAlign: 'left' }}>
                                <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.75rem', marginBottom: 'var(--sp-2)' }}>
                                    Error details
                                </summary>
                                <pre style={{
                                    padding: 'var(--sp-3)', background: 'rgba(0,0,0,0.3)', borderRadius: 8,
                                    fontSize: '0.7rem', color: '#ef4444', overflowX: 'auto', whiteSpace: 'pre-wrap',
                                }}>
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 32px', border: 'none', borderRadius: 10,
                                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #818cf8 100%)',
                                color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
