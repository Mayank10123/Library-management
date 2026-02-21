import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, CheckCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';
import Confetti from '../components/ui/Confetti';

const coverColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } } };

const AddBookPage: React.FC = () => {
    const { addBook } = useLibrary();
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [form, setForm] = useState({
        title: '', author: '', isbn: '', publisher: '', category: 'Fiction',
        totalCopies: 1, location: '', description: '', year: 2024,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'totalCopies' || name === 'year' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addBook({
            ...form,
            availableCopies: form.totalCopies,
            coverColor: coverColors[Math.floor(Math.random() * coverColors.length)],
        });
        toast('success', `"${form.title}" added to the library!`);
        setSubmitted(true);
        setShowConfetti(true);
        setTimeout(() => {
            setSubmitted(false);
            setForm({ title: '', author: '', isbn: '', publisher: '', category: 'Fiction', totalCopies: 1, location: '', description: '', year: 2024 });
        }, 2000);
    };

    const categories = ['Fiction', 'Science', 'Technology', 'History', 'Philosophy', 'Mathematics', 'Art', 'Literature', 'Psychology', 'Business'];

    return (
        <>
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
                <div className="page-header">
                    <motion.h1 variants={item}>Add New Book</motion.h1>
                    <motion.p variants={item}>Enter book details to add to the library catalog.</motion.p>
                </div>

                <motion.div className="glass-card" style={{ padding: 'var(--sp-8)', maxWidth: 700 }} variants={item}>
                    {submitted ? (
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ padding: 'var(--sp-10)' }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                            >
                                <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 'var(--sp-4)' }} />
                            </motion.div>
                            <h2 style={{ marginBottom: 'var(--sp-2)' }}>Book Added Successfully!</h2>
                            <p className="text-muted">The book has been added to the library catalog.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="Book title" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Author *</label>
                                    <input className="form-input" name="author" value={form.author} onChange={handleChange} placeholder="Author name" required />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">ISBN *</label>
                                    <input className="form-input" name="isbn" value={form.isbn} onChange={handleChange} placeholder="978-0-..." required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Publisher</label>
                                    <input className="form-input" name="publisher" value={form.publisher} onChange={handleChange} placeholder="Publisher name" />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Year</label>
                                    <input className="form-input" name="year" type="number" value={form.year} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Copies *</label>
                                    <input className="form-input" name="totalCopies" type="number" min={1} value={form.totalCopies} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location *</label>
                                    <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Shelf A-12" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" name="description" value={form.description} onChange={handleChange}
                                    placeholder="Brief description..." rows={3} style={{ resize: 'vertical' }} />
                            </div>
                            <button className="btn btn-primary btn-lg" type="submit" style={{ marginTop: 'var(--sp-2)' }}>
                                <PlusCircle size={18} /> Add Book
                            </button>
                        </form>
                    )}
                </motion.div>
            </motion.div>
            <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />
        </>
    );
};

export default AddBookPage;
