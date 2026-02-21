import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    books as initialBooks,
    members as initialMembers,
    transactions as initialTransactions,
    reservations as initialReservations,
    fines as initialFines,
    notifications as initialNotifications,
    FINE_RATE_PER_DAY,
    LOAN_PERIOD_DAYS,
    type Book, type Member, type Transaction, type Reservation, type Fine, type Notification,
} from '../data/mockData';

interface LibraryContextType {
    books: Book[];
    members: Member[];
    transactions: Transaction[];
    reservations: Reservation[];
    fines: Fine[];
    notifications: Notification[];
    addBook: (book: Omit<Book, 'id'>) => void;
    updateBook: (id: string, updates: Partial<Book>) => void;
    addMember: (member: Omit<Member, 'id'>) => void;
    updateMember: (id: string, updates: Partial<Member>) => void;
    issueBook: (bookId: string, memberId: string) => Transaction | null;
    returnBook: (transactionId: string) => { fine: number } | null;
    addReservation: (bookId: string, memberId: string) => Reservation | null;
    cancelReservation: (id: string) => void;
    payFine: (id: string) => void;
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;
    addNotification: (n: Omit<Notification, 'id'>) => void;
    getBookById: (id: string) => Book | undefined;
    getMemberById: (id: string) => Member | undefined;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

let nextId = 100;
const genId = (prefix: string) => `${prefix}${nextId++}`;

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>(initialBooks);
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
    const [finesState, setFines] = useState<Fine[]>(initialFines);
    const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);

    const getBookById = useCallback((id: string) => books.find(b => b.id === id), [books]);
    const getMemberById = useCallback((id: string) => members.find(m => m.id === id), [members]);

    const addBook = useCallback((book: Omit<Book, 'id'>) => {
        setBooks(prev => [...prev, { ...book, id: genId('b') }]);
    }, []);

    const updateBook = useCallback((id: string, updates: Partial<Book>) => {
        setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    }, []);

    const addMember = useCallback((member: Omit<Member, 'id'>) => {
        setMembers(prev => [...prev, { ...member, id: genId('m') }]);
    }, []);

    const updateMember = useCallback((id: string, updates: Partial<Member>) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    }, []);

    const issueBook = useCallback((bookId: string, memberId: string): Transaction | null => {
        const book = books.find(b => b.id === bookId);
        if (!book || book.availableCopies <= 0) return null;

        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + LOAN_PERIOD_DAYS);

        const txn: Transaction = {
            id: genId('t'),
            bookId, memberId,
            type: 'issue',
            issueDate: today.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'active',
            fine: 0,
        };

        setTransactions(prev => [txn, ...prev]);
        setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, booksIssued: m.booksIssued + 1 } : m));

        return txn;
    }, [books]);

    const returnBook = useCallback((transactionId: string): { fine: number } | null => {
        const txn = transactions.find(t => t.id === transactionId);
        if (!txn || txn.status === 'returned') return null;

        const today = new Date();
        const dueDate = new Date(txn.dueDate);
        const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
        const fineAmount = daysOverdue * FINE_RATE_PER_DAY;

        const returnDate = today.toISOString().split('T')[0];

        setTransactions(prev => prev.map(t =>
            t.id === transactionId ? { ...t, status: 'returned' as const, returnDate, fine: fineAmount } : t
        ));
        setBooks(prev => prev.map(b => b.id === txn.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
        setMembers(prev => prev.map(m =>
            m.id === txn.memberId ? { ...m, booksIssued: Math.max(0, m.booksIssued - 1) } : m
        ));

        if (fineAmount > 0) {
            const fine: Fine = {
                id: genId('f'),
                memberId: txn.memberId,
                transactionId,
                amount: fineAmount,
                reason: 'Overdue return',
                status: 'pending',
                date: returnDate,
            };
            setFines(prev => [...prev, fine]);
        }

        return { fine: fineAmount };
    }, [transactions]);

    const addReservation = useCallback((bookId: string, memberId: string): Reservation | null => {
        const existing = reservations.filter(r => r.bookId === bookId && (r.status === 'waiting' || r.status === 'ready'));
        const reservation: Reservation = {
            id: genId('r'),
            bookId, memberId,
            reservationDate: new Date().toISOString().split('T')[0],
            status: 'waiting',
            priority: existing.length + 1,
        };
        setReservations(prev => [...prev, reservation]);
        return reservation;
    }, [reservations]);

    const cancelReservation = useCallback((id: string) => {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r));
    }, []);

    const payFine = useCallback((id: string) => {
        setFines(prev => prev.map(f => f.id === id ? { ...f, status: 'paid' as const } : f));
    }, []);

    const markNotificationRead = useCallback((id: string) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllNotificationsRead = useCallback(() => {
        setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
        setNotifs(prev => [{ ...n, id: genId('n') }, ...prev]);
    }, []);

    return (
        <LibraryContext.Provider value={{
            books, members, transactions, reservations, fines: finesState, notifications: notifs,
            addBook, updateBook, addMember, updateMember,
            issueBook, returnBook, addReservation, cancelReservation,
            payFine, markNotificationRead, markAllNotificationsRead, addNotification,
            getBookById, getMemberById,
        }}>
            {children}
        </LibraryContext.Provider>
    );
};

export const useLibrary = () => {
    const ctx = useContext(LibraryContext);
    if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
    return ctx;
};
