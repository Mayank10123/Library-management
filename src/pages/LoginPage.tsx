import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Library, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        const ok = login(username, password);
        setLoading(false);
        if (ok) { toast('success', 'Welcome back!'); navigate('/'); }
        else toast('error', 'Invalid credentials. Try a demo login below.');
    };

    const demoLogin = (u: string, p: string) => {
        setUsername(u); setPassword(p);
        setLoading(true);
        setTimeout(() => {
            const ok = login(u, p);
            setLoading(false);
            if (ok) { toast('success', 'Welcome back!'); navigate('/'); }
        }, 400);
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>
            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
                <div className="login-logo">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.1 }}
                        style={{
                            width: 56, height: 56, borderRadius: 14,
                            background: 'var(--accent-gradient)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)',
                        }}
                    >
                        <Library size={28} color="white" />
                    </motion.div>
                    <h1>Koha</h1>
                    <p>Library Management System</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="form-input"
                                type={showPass ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: 40 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer',
                                }}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
                            />
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="demo-logins">
                    <p>Quick demo access</p>
                    <div className="demo-btns">
                        <button className="demo-btn" type="button" onClick={() => demoLogin('admin', 'admin123')}>
                            👑 Admin
                        </button>
                        <button className="demo-btn" type="button" onClick={() => demoLogin('librarian', 'lib123')}>
                            📚 Librarian
                        </button>
                        <button className="demo-btn" type="button" onClick={() => demoLogin('member', 'mem123')}>
                            🎓 Member
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
