import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
    '': 'Dashboard',
    'books': 'Books',
    'add': 'Add New',
    'issue': 'Issue Book',
    'return': 'Return Book',
    'members': 'Members',
    'reservations': 'Reservations',
    'fines': 'Fines',
    'reports': 'Reports',
    'notifications': 'Notifications',
    'calendar': 'Calendar',
    'timeline': 'Timeline',
    'ebooks': 'eBook Store',
    'reader': 'Reader',
    'settings': 'Settings',
};

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const segments = location.pathname.split('/').filter(Boolean);

    if (segments.length === 0) return null;

    const crumbs = segments.map((seg, i) => ({
        label: routeNames[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        path: '/' + segments.slice(0, i + 1).join('/'),
        isLast: i === segments.length - 1,
    }));

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)',
            marginBottom: 'var(--sp-4)', padding: '0 var(--sp-1)',
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-tertiary)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-tertiary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                <Home size={13} />
            </Link>
            {crumbs.map(c => (
                <React.Fragment key={c.path}>
                    <ChevronRight size={12} style={{ opacity: 0.5 }} />
                    {c.isLast ? (
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.label}</span>
                    ) : (
                        <Link to={c.path} style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-tertiary)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                            {c.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
