import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } };

const AddMemberPage: React.FC = () => {
    const { addMember } = useLibrary();
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', department: '',
        membershipType: 'student' as 'student' | 'faculty' | 'staff',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMember({
            ...form,
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active',
            booksIssued: 0,
            totalFines: 0,
        });
        toast('success', `${form.name} registered successfully!`);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setForm({ name: '', email: '', phone: '', department: '', membershipType: 'student' });
        }, 2000);
    };

    return (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            <div className="page-header">
                <motion.h1 variants={item}>Register Member</motion.h1>
                <motion.p variants={item}>Add a new member to the library system.</motion.p>
            </div>

            <motion.div className="glass-card" style={{ padding: 'var(--sp-8)', maxWidth: 600 }} variants={item}>
                {submitted ? (
                    <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: 'var(--sp-10)' }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                            <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 'var(--sp-4)' }} />
                        </motion.div>
                        <h2 style={{ marginBottom: 'var(--sp-2)' }}>Member Registered!</h2>
                        <p className="text-muted">Account has been created and activated.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" required />
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@uni.edu" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone *</label>
                                <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555-0000" required />
                            </div>
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Department *</label>
                                <input className="form-input" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Membership Type *</label>
                                <select className="form-input" name="membershipType" value={form.membershipType} onChange={handleChange}>
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-lg" type="submit" style={{ marginTop: 'var(--sp-2)' }}>
                            <UserPlus size={18} /> Register Member
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AddMemberPage;
