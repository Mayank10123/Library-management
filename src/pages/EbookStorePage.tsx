import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, ShoppingCart, Search, Eye, Heart, Tag, Download } from 'lucide-react';

interface Ebook {
    id: string;
    title: string;
    author: string;
    cover: string;
    price: number;
    rating: number;
    reviews: number;
    category: string;
    pages: number;
    description: string;
    free: boolean;
    sampleContent: string;
}

const EBOOKS: Ebook[] = [
    {
        id: 'eb1', title: 'The Art of Programming', author: 'Donald Knuth', cover: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', price: 0, rating: 4.9, reviews: 2840, category: 'Technology', pages: 672, description: 'A comprehensive guide to the fundamentals of computer programming.', free: true,
        sampleContent: `Chapter 1: Basic Concepts\n\nThe notion of an algorithm is basic to all of computer programming, so we should begin with a careful analysis of this concept.\n\nAn algorithm is a finite set of rules which gives a sequence of operations for solving a specific type of problem. An algorithm has five important features:\n\n1. Finiteness — An algorithm must always terminate after a finite number of steps.\n2. Definiteness — Each step of an algorithm must be precisely defined.\n3. Input — An algorithm has zero or more inputs.\n4. Output — An algorithm has one or more outputs.\n5. Effectiveness — An algorithm is effective.\n\nLet us consider a simple example. Suppose we wish to find the greatest common divisor of two positive integers m and n.\n\nAlgorithm E (Euclid's algorithm):\nE1. [Find remainder.] Divide m by n and let r be the remainder.\nE2. [Is it zero?] If r = 0, the algorithm terminates; n is the answer.\nE3. [Reduce.] Set m ← n, n ← r, and go back to step E1.\n\nThis is one of the oldest known algorithms, dating back to Euclid's Elements (circa 300 B.C.).\n\nThe word "algorithm" itself is quite interesting; it is derived from the name of the Persian mathematician al-Khwārizmī who wrote a famous textbook about A.D. 825.`
    },
    {
        id: 'eb2', title: 'JavaScript: The Definitive Guide', author: 'David Flanagan', cover: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)', price: 14.99, rating: 4.7, reviews: 1250, category: 'Technology', pages: 1048, description: 'Master the world\'s most-used programming language.', free: false,
        sampleContent: `Chapter 1: Introduction to JavaScript\n\nJavaScript is the programming language of the web. The overwhelming majority of websites use JavaScript, and all modern web browsers include JavaScript interpreters.\n\nJavaScript is a high-level, dynamic, interpreted programming language that is well-suited to object-oriented and functional programming styles.\n\nJavaScript's variables are untyped. Its syntax is loosely based on Java, but the two languages are otherwise unrelated.\n\nJavaScript derives its first-class functions from Scheme and its prototype-based inheritance from Self. But you don't need to know those languages to use this book.\n\nThe name "JavaScript" is quite misleading. Except for a superficial syntactic resemblance, JavaScript is completely different from the Java programming language.`
    },
    {
        id: 'eb3', title: 'Sapiens: A Brief History', author: 'Yuval Noah Harari', cover: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', price: 9.99, rating: 4.8, reviews: 5200, category: 'History', pages: 498, description: 'Exploring 70,000 years of human history.', free: false,
        sampleContent: `Part One: The Cognitive Revolution\n\nAbout 13.5 billion years ago, matter, energy, time and space came into being in what is known as the Big Bang.\n\nAbout 300,000 years after their appearance, matter and energy started to coalesce into complex structures, called atoms, which then combined into molecules.\n\nThe story of these atoms, molecules, and their interactions is called chemistry.\n\nAbout 3.8 billion years ago, on a planet called Earth, certain molecules combined to form particularly large and intricate structures called organisms. The story of organisms is called biology.\n\nAbout 70,000 years ago, organisms belonging to the species Homo sapiens started to form even more elaborate structures called cultures. The subsequent development of these human cultures is called history.`
    },
    {
        id: 'eb4', title: 'The Design of Everyday Things', author: 'Don Norman', cover: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', price: 0, rating: 4.6, reviews: 980, category: 'Design', pages: 347, description: 'How design serves as communication between object and user.', free: true,
        sampleContent: `Chapter 1: The Psychopathology of Everyday Things\n\nI push doors that are meant to be pulled, pull doors that should be pushed, and walk into doors that should be slid. Moreover, I see others having the same troubles—making the wrong action on everyday things.\n\nWe are surrounded by objects designed by engineers, programmers, and designers who do not understand human psychology. These objects work perfectly well as long as we happen to guess correctly about how they should be operated.\n\nThe problem with the designs of most engineers is that they are too logical. We have to accept human behavior the way it is, not the way we would wish it to be.\n\nGood design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible.`
    },
    {
        id: 'eb5', title: 'Meditations', author: 'Marcus Aurelius', cover: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', price: 0, rating: 4.8, reviews: 3400, category: 'Philosophy', pages: 256, description: 'Personal writings of the Roman Emperor on Stoic philosophy.', free: true,
        sampleContent: `Book 1\n\nFrom my grandfather Verus I learned good morals and the government of my temper.\n\nFrom the reputation and remembrance of my father, modesty and a manly character.\n\nFrom my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.\n\nBook 2\n\nBegin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil.\n\nBut I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me... I can neither be injured by any of them, nor can I be angry with my kinsman.\n\nDo every act of your life as though it were the very last act of your life.`
    },
    {
        id: 'eb6', title: 'Clean Architecture', author: 'Robert C. Martin', cover: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', price: 19.99, rating: 4.5, reviews: 890, category: 'Technology', pages: 432, description: 'A craftsman\'s guide to software structure and design.', free: false,
        sampleContent: `Part I: Introduction\n\nWhat is design and architecture? There has been a lot of confusion about these two terms over the years. The word "architecture" is often used in the context of something at a high level that is divorced from the lower-level details, whereas "design" more often seems to imply structures and decisions at a lower level.\n\nBut this usage is nonsensical when you look at what a real architect does.\n\nConsider the architect who designed my house. Does this home have an architecture? Of course it does. And what is that architecture? Well, it is the shape of the home, the number of floors, the overall layout, the way the rooms connect.\n\nBut the architect also designed the building. It was the architect who placed the outlets and light switches. It was the architect who decided where each door should go and which way each door should open.`
    },
];

const EbookStorePage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [selectedBook, setSelectedBook] = useState<Ebook | null>(null);
    const [readingBook, setReadingBook] = useState<Ebook | null>(null);
    const [purchased, setPurchased] = useState<Set<string>>(new Set());
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const categories = [...new Set(EBOOKS.map(b => b.category))].sort();

    const filtered = EBOOKS.filter(b => {
        const q = search.toLowerCase();
        const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
        const matchCat = !category || b.category === category;
        return matchSearch && matchCat;
    });

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const buyBook = (book: Ebook) => {
        setPurchased(prev => new Set(prev).add(book.id));
    };

    const renderStars = (rating: number) => (
        <div style={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={12} fill={s <= Math.round(rating) ? 'var(--warning)' : 'transparent'}
                    style={{ color: s <= Math.round(rating) ? 'var(--warning)' : 'var(--text-tertiary)' }} />
            ))}
        </div>
    );

    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

    // Reader View
    if (readingBook) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
                    <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{readingBook.title}</h2>
                    <button className="btn btn-ghost" onClick={() => setReadingBook(null)}>← Back to Store</button>
                </div>
                <div className="glass-card" style={{
                    padding: 'var(--sp-8)', maxWidth: 720, margin: '0 auto',
                    fontSize: 'var(--fs-base)', lineHeight: 1.9, color: 'var(--text-secondary)',
                    fontFamily: 'Georgia, "Times New Roman", serif',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
                        <div style={{ width: 80, height: 110, borderRadius: 8, background: readingBook.cover, margin: '0 auto var(--sp-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={28} color="rgba(255,255,255,0.7)" />
                        </div>
                        <h3 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>{readingBook.title}</h3>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)' }}>by {readingBook.author}</p>
                    </div>
                    {readingBook.sampleContent.split('\n').map((line, i) => (
                        <p key={i} style={{
                            marginBottom: line.trim() === '' ? 'var(--sp-4)' : 'var(--sp-2)',
                            fontWeight: line.startsWith('Chapter') || line.startsWith('Part') || line.startsWith('Book') ? 700 : 400,
                            fontSize: line.startsWith('Chapter') || line.startsWith('Part') || line.startsWith('Book') ? 'var(--fs-lg)' : 'var(--fs-base)',
                            color: line.startsWith('Chapter') || line.startsWith('Part') || line.startsWith('Book') ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}>{line}</p>
                    ))}
                    <div style={{ textAlign: 'center', marginTop: 'var(--sp-8)', padding: 'var(--sp-6)', borderTop: '1px solid var(--border-color)' }}>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-3)' }}>
                            {readingBook.free ? 'This is a free book — full content shown above.' : 'End of sample. Purchase full book to continue reading.'}
                        </p>
                        {!readingBook.free && !purchased.has(readingBook.id) && (
                            <button className="btn btn-primary" onClick={() => buyBook(readingBook)}>
                                <ShoppingCart size={16} /> Buy for ${readingBook.price.toFixed(2)}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>eBook Store</motion.h1>
                <motion.p variants={item}>Browse, buy, and read eBooks online.</motion.p>
            </div>

            {/* Filters */}
            <motion.div variants={item} style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input className="filter-input" placeholder="Search eBooks..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, width: '100%' }} />
                </div>
                <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </motion.div>

            {/* Book Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260, 1fr))', gap: 'var(--sp-4)' }}>
                {filtered.map(book => (
                    <motion.div key={book.id} className="glass-card" variants={item}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        style={{ overflow: 'hidden', cursor: 'pointer' }}
                    >
                        {/* Cover */}
                        <div style={{ height: 160, background: book.cover, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <BookOpen size={40} color="rgba(255,255,255,0.5)" />
                            {book.free && (
                                <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--success)', color: 'white', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.6rem', fontWeight: 700 }}>FREE</div>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id); }}
                                style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Heart size={14} fill={favorites.has(book.id) ? '#ef4444' : 'transparent'} style={{ color: favorites.has(book.id) ? '#ef4444' : 'white' }} />
                            </button>
                        </div>

                        <div style={{ padding: 'var(--sp-4)' }}>
                            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{book.title}</div>
                            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-2)' }}>{book.author}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--sp-2)' }}>
                                {renderStars(book.rating)}
                                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>({book.reviews})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 'var(--sp-3)', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                                <Tag size={10} /> {book.category} · {book.pages} pages
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                                <button className="btn btn-ghost" onClick={() => setReadingBook(book)} style={{ flex: 1, fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-2)' }}>
                                    <Eye size={13} /> {book.free || purchased.has(book.id) ? 'Read' : 'Preview'}
                                </button>
                                {!book.free && !purchased.has(book.id) ? (
                                    <button className="btn btn-primary" onClick={() => buyBook(book)} style={{ fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-2)' }}>
                                        <ShoppingCart size={13} /> ${book.price}
                                    </button>
                                ) : purchased.has(book.id) ? (
                                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}><Download size={12} /> Owned</span>
                                ) : null}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="empty-state"><BookOpen size={48} /><h3>No eBooks found</h3></div>
            )}
        </motion.div>
    );
};

export default EbookStorePage;
