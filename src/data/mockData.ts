export type Role = 'admin' | 'librarian' | 'member';

export interface User {
    id: string;
    username: string;
    password: string;
    name: string;
    role: Role;
    email: string;
    avatar?: string;
}

export interface Book {
    id: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
    location: string;
    coverColor: string;
    description: string;
    year: number;
}

export interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    membershipType: 'student' | 'faculty' | 'staff';
    joinDate: string;
    status: 'active' | 'suspended' | 'expired';
    booksIssued: number;
    totalFines: number;
}

export interface Transaction {
    id: string;
    bookId: string;
    memberId: string;
    type: 'issue' | 'return';
    issueDate: string;
    dueDate: string;
    returnDate?: string;
    fine: number;
    status: 'active' | 'returned' | 'overdue';
}

export interface Reservation {
    id: string;
    bookId: string;
    memberId: string;
    reservationDate: string;
    status: 'waiting' | 'ready' | 'fulfilled' | 'cancelled';
    priority: number;
}

export interface Fine {
    id: string;
    memberId: string;
    transactionId: string;
    amount: number;
    reason: string;
    status: 'pending' | 'paid';
    date: string;
}

export interface Notification {
    id: string;
    type: 'due_reminder' | 'overdue' | 'reservation_ready' | 'fine' | 'system';
    title: string;
    message: string;
    date: string;
    read: boolean;
    userId?: string;
}

// ─── Users ───
export const users: User[] = [
    { id: 'u1', username: 'admin', password: 'admin123', name: 'Alexandra Chen', role: 'admin', email: 'admin@koha.lib' },
    { id: 'u2', username: 'librarian', password: 'lib123', name: 'Marcus Rivera', role: 'librarian', email: 'marcus@koha.lib' },
    { id: 'u3', username: 'member', password: 'mem123', name: 'Sarah Parker', role: 'member', email: 'sarah@koha.lib' },
];

// ─── Books ───
const categories = ['Fiction', 'Science', 'Technology', 'History', 'Philosophy', 'Mathematics', 'Art', 'Literature', 'Psychology', 'Business'];
const coverColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
];

export const books: Book[] = [
    { id: 'b1', isbn: '978-0-13-468599-1', title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', publisher: 'Addison-Wesley', category: 'Technology', totalCopies: 5, availableCopies: 3, location: 'Shelf A-12', coverColor: coverColors[0], description: 'A classic guide to software development best practices.', year: 2019 },
    { id: 'b2', isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', author: 'Harper Lee', publisher: 'HarperCollins', category: 'Fiction', totalCopies: 8, availableCopies: 5, location: 'Shelf B-03', coverColor: coverColors[1], description: 'A novel about racial injustice in the American South.', year: 1960 },
    { id: 'b3', isbn: '978-0-201-63361-0', title: 'Design Patterns', author: 'Gang of Four', publisher: 'Addison-Wesley', category: 'Technology', totalCopies: 4, availableCopies: 1, location: 'Shelf A-15', coverColor: coverColors[2], description: 'Elements of reusable object-oriented software.', year: 1994 },
    { id: 'b4', isbn: '978-0-14-028329-7', title: '1984', author: 'George Orwell', publisher: 'Penguin Books', category: 'Fiction', totalCopies: 10, availableCopies: 7, location: 'Shelf B-01', coverColor: coverColors[3], description: 'A dystopian social science fiction novel.', year: 1949 },
    { id: 'b5', isbn: '978-0-07-352332-3', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', publisher: 'MIT Press', category: 'Technology', totalCopies: 6, availableCopies: 2, location: 'Shelf A-20', coverColor: coverColors[4], description: 'The comprehensive textbook on algorithms.', year: 2009 },
    { id: 'b6', isbn: '978-0-14-044913-6', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', publisher: 'Penguin Classics', category: 'Literature', totalCopies: 4, availableCopies: 3, location: 'Shelf C-05', coverColor: coverColors[5], description: 'A novel exploring morality and redemption.', year: 1866 },
    { id: 'b7', isbn: '978-0-06-093546-7', title: 'To the Lighthouse', author: 'Virginia Woolf', publisher: 'Harcourt', category: 'Literature', totalCopies: 3, availableCopies: 2, location: 'Shelf C-08', coverColor: coverColors[6], description: 'A landmark of high modernism and stream of consciousness.', year: 1927 },
    { id: 'b8', isbn: '978-0-553-21311-7', title: 'A Brief History of Time', author: 'Stephen Hawking', publisher: 'Bantam Books', category: 'Science', totalCopies: 7, availableCopies: 4, location: 'Shelf D-02', coverColor: coverColors[7], description: 'A landmark volume in science writing.', year: 1988 },
    { id: 'b9', isbn: '978-0-19-921613-3', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', publisher: 'Harper', category: 'History', totalCopies: 6, availableCopies: 0, location: 'Shelf E-01', coverColor: coverColors[8], description: 'An exploration of the history of our species.', year: 2015 },
    { id: 'b10', isbn: '978-0-307-47427-9', title: 'The Art of War', author: 'Sun Tzu', publisher: 'Filiquarian', category: 'Philosophy', totalCopies: 5, availableCopies: 4, location: 'Shelf F-03', coverColor: coverColors[9], description: 'An ancient Chinese military treatise.', year: -500 },
    { id: 'b11', isbn: '978-0-596-51774-8', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', publisher: "O'Reilly", category: 'Technology', totalCopies: 4, availableCopies: 2, location: 'Shelf A-18', coverColor: coverColors[0], description: 'Unearthing the excellence in JavaScript.', year: 2008 },
    { id: 'b12', isbn: '978-0-7432-7356-5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publisher: 'Scribner', category: 'Fiction', totalCopies: 6, availableCopies: 4, location: 'Shelf B-07', coverColor: coverColors[1], description: 'A story of decadence and idealism in the Jazz Age.', year: 1925 },
    { id: 'b13', isbn: '978-0-06-250217-4', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', publisher: 'Farrar', category: 'Psychology', totalCopies: 5, availableCopies: 3, location: 'Shelf G-01', coverColor: coverColors[2], description: 'Two systems that drive the way we think.', year: 2011 },
    { id: 'b14', isbn: '978-0-06-093546-9', title: 'Zero to One', author: 'Peter Thiel', publisher: 'Crown Business', category: 'Business', totalCopies: 4, availableCopies: 1, location: 'Shelf H-02', coverColor: coverColors[3], description: 'Notes on startups, or how to build the future.', year: 2014 },
    { id: 'b15', isbn: '978-0-14-118776-1', title: 'The Republic', author: 'Plato', publisher: 'Penguin Classics', category: 'Philosophy', totalCopies: 3, availableCopies: 2, location: 'Shelf F-01', coverColor: coverColors[4], description: 'One of the most influential works of philosophy.', year: -380 },
    { id: 'b16', isbn: '978-0-465-05065-7', title: 'The Design of Everyday Things', author: 'Don Norman', publisher: 'Basic Books', category: 'Art', totalCopies: 3, availableCopies: 1, location: 'Shelf I-03', coverColor: coverColors[5], description: 'A powerful primer on how design serves as a communication.', year: 2013 },
    { id: 'b17', isbn: '978-0-13-235088-4', title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', category: 'Technology', totalCopies: 6, availableCopies: 3, location: 'Shelf A-14', coverColor: coverColors[6], description: 'A handbook of agile software craftsmanship.', year: 2008 },
    { id: 'b18', isbn: '978-0-452-28423-4', title: 'Brave New World', author: 'Aldous Huxley', publisher: 'Harper', category: 'Fiction', totalCopies: 5, availableCopies: 4, location: 'Shelf B-09', coverColor: coverColors[7], description: 'A dystopian vision of the future.', year: 1932 },
    { id: 'b19', isbn: '978-0-262-03384-8', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', publisher: 'Pearson', category: 'Technology', totalCopies: 4, availableCopies: 0, location: 'Shelf A-22', coverColor: coverColors[8], description: 'The leading textbook in AI.', year: 2020 },
    { id: 'b20', isbn: '978-0-393-04002-9', title: 'A People\'s History of the United States', author: 'Howard Zinn', publisher: 'Harper', category: 'History', totalCopies: 3, availableCopies: 2, location: 'Shelf E-04', coverColor: coverColors[9], description: 'History from the bottom up.', year: 1980 },
    { id: 'b21', isbn: '978-0-691-16832-2', title: 'The Princeton Companion to Mathematics', author: 'Timothy Gowers', publisher: 'Princeton UP', category: 'Mathematics', totalCopies: 2, availableCopies: 1, location: 'Shelf J-01', coverColor: coverColors[0], description: 'The ultimate guide to modern mathematics.', year: 2008 },
    { id: 'b22', isbn: '978-0-393-33972-4', title: 'Cosmos', author: 'Carl Sagan', publisher: 'Ballantine Books', category: 'Science', totalCopies: 5, availableCopies: 3, location: 'Shelf D-05', coverColor: coverColors[1], description: 'A personal voyage through the universe.', year: 1980 },
    { id: 'b23', isbn: '978-0-81-297381-1', title: 'Meditations', author: 'Marcus Aurelius', publisher: 'Modern Library', category: 'Philosophy', totalCopies: 4, availableCopies: 3, location: 'Shelf F-05', coverColor: coverColors[2], description: 'Personal writings of the Roman Emperor.', year: 180 },
    { id: 'b24', isbn: '978-0-06-112008-5', title: 'Influence: The Psychology of Persuasion', author: 'Robert B. Cialdini', publisher: 'Harper Business', category: 'Psychology', totalCopies: 3, availableCopies: 2, location: 'Shelf G-04', coverColor: coverColors[3], description: 'The classic book on the psychology of persuasion.', year: 1984 },
];

// ─── Members ───
export const members: Member[] = [
    { id: 'm1', name: 'Sarah Parker', email: 'sarah@uni.edu', phone: '+1 555-0101', department: 'Computer Science', membershipType: 'student', joinDate: '2025-09-01', status: 'active', booksIssued: 2, totalFines: 0 },
    { id: 'm2', name: 'James Wilson', email: 'james@uni.edu', phone: '+1 555-0102', department: 'Mathematics', membershipType: 'student', joinDate: '2025-08-15', status: 'active', booksIssued: 3, totalFines: 5.50 },
    { id: 'm3', name: 'Dr. Emily Foster', email: 'emily.f@uni.edu', phone: '+1 555-0103', department: 'Physics', membershipType: 'faculty', joinDate: '2024-01-10', status: 'active', booksIssued: 5, totalFines: 0 },
    { id: 'm4', name: 'Raj Patel', email: 'raj.p@uni.edu', phone: '+1 555-0104', department: 'Engineering', membershipType: 'student', joinDate: '2025-09-20', status: 'active', booksIssued: 1, totalFines: 2.00 },
    { id: 'm5', name: 'Lisa Chang', email: 'lisa.c@uni.edu', phone: '+1 555-0105', department: 'Literature', membershipType: 'student', joinDate: '2025-07-01', status: 'active', booksIssued: 4, totalFines: 0 },
    { id: 'm6', name: 'Prof. Alan Brooks', email: 'alan.b@uni.edu', phone: '+1 555-0106', department: 'History', membershipType: 'faculty', joinDate: '2023-06-15', status: 'active', booksIssued: 6, totalFines: 0 },
    { id: 'm7', name: 'Maria Garcia', email: 'maria.g@uni.edu', phone: '+1 555-0107', department: 'Art', membershipType: 'student', joinDate: '2025-10-01', status: 'active', booksIssued: 0, totalFines: 0 },
    { id: 'm8', name: 'Thomas Kim', email: 'thomas.k@uni.edu', phone: '+1 555-0108', department: 'Business', membershipType: 'student', joinDate: '2025-06-20', status: 'suspended', booksIssued: 0, totalFines: 15.00 },
    { id: 'm9', name: 'Dr. Nora Adams', email: 'nora.a@uni.edu', phone: '+1 555-0109', department: 'Psychology', membershipType: 'faculty', joinDate: '2024-03-01', status: 'active', booksIssued: 3, totalFines: 0 },
    { id: 'm10', name: 'Kevin Wright', email: 'kevin.w@uni.edu', phone: '+1 555-0110', department: 'Computer Science', membershipType: 'student', joinDate: '2025-09-05', status: 'active', booksIssued: 2, totalFines: 1.00 },
    { id: 'm11', name: 'Anna Clark', email: 'anna.c@uni.edu', phone: '+1 555-0111', department: 'Philosophy', membershipType: 'student', joinDate: '2025-08-01', status: 'active', booksIssued: 1, totalFines: 0 },
    { id: 'm12', name: 'David Lee', email: 'david.l@uni.edu', phone: '+1 555-0112', department: 'Engineering', membershipType: 'staff', joinDate: '2024-11-15', status: 'active', booksIssued: 2, totalFines: 0 },
    { id: 'm13', name: 'Sophie Turner', email: 'sophie.t@uni.edu', phone: '+1 555-0113', department: 'Science', membershipType: 'student', joinDate: '2025-09-10', status: 'active', booksIssued: 1, totalFines: 3.00 },
    { id: 'm14', name: 'Michael Brown', email: 'michael.b@uni.edu', phone: '+1 555-0114', department: 'Mathematics', membershipType: 'student', joinDate: '2025-07-15', status: 'expired', booksIssued: 0, totalFines: 0 },
    { id: 'm15', name: 'Dr. Rachel Green', email: 'rachel.g@uni.edu', phone: '+1 555-0115', department: 'Biology', membershipType: 'faculty', joinDate: '2023-09-01', status: 'active', booksIssued: 4, totalFines: 0 },
];

// ─── Transactions ───
export const transactions: Transaction[] = [
    { id: 't1', bookId: 'b1', memberId: 'm1', type: 'issue', issueDate: '2026-02-05', dueDate: '2026-02-19', status: 'overdue', fine: 2.00 },
    { id: 't2', bookId: 'b3', memberId: 'm2', type: 'issue', issueDate: '2026-02-10', dueDate: '2026-02-24', status: 'active', fine: 0 },
    { id: 't3', bookId: 'b5', memberId: 'm3', type: 'issue', issueDate: '2026-01-20', dueDate: '2026-02-03', returnDate: '2026-02-01', status: 'returned', fine: 0 },
    { id: 't4', bookId: 'b9', memberId: 'm4', type: 'issue', issueDate: '2026-02-01', dueDate: '2026-02-15', status: 'overdue', fine: 6.00 },
    { id: 't5', bookId: 'b2', memberId: 'm5', type: 'issue', issueDate: '2026-02-15', dueDate: '2026-03-01', status: 'active', fine: 0 },
    { id: 't6', bookId: 'b8', memberId: 'm6', type: 'issue', issueDate: '2026-02-12', dueDate: '2026-02-26', status: 'active', fine: 0 },
    { id: 't7', bookId: 'b13', memberId: 'm9', type: 'issue', issueDate: '2026-02-18', dueDate: '2026-03-04', status: 'active', fine: 0 },
    { id: 't8', bookId: 'b19', memberId: 'm10', type: 'issue', issueDate: '2026-01-25', dueDate: '2026-02-08', returnDate: '2026-02-10', status: 'returned', fine: 2.00 },
    { id: 't9', bookId: 'b14', memberId: 'm2', type: 'issue', issueDate: '2026-02-14', dueDate: '2026-02-28', status: 'active', fine: 0 },
    { id: 't10', bookId: 'b17', memberId: 'm1', type: 'issue', issueDate: '2026-02-20', dueDate: '2026-03-06', status: 'active', fine: 0 },
];

// ─── Reservations ───
export const reservations: Reservation[] = [
    { id: 'r1', bookId: 'b9', memberId: 'm5', reservationDate: '2026-02-10', status: 'waiting', priority: 1 },
    { id: 'r2', bookId: 'b9', memberId: 'm7', reservationDate: '2026-02-12', status: 'waiting', priority: 2 },
    { id: 'r3', bookId: 'b19', memberId: 'm3', reservationDate: '2026-02-15', status: 'waiting', priority: 1 },
    { id: 'r4', bookId: 'b3', memberId: 'm10', reservationDate: '2026-02-08', status: 'ready', priority: 1 },
];

// ─── Fines ───
export const fines: Fine[] = [
    { id: 'f1', memberId: 'm1', transactionId: 't1', amount: 2.00, reason: 'Overdue return', status: 'pending', date: '2026-02-19' },
    { id: 'f2', memberId: 'm4', transactionId: 't4', amount: 6.00, reason: 'Overdue return', status: 'pending', date: '2026-02-15' },
    { id: 'f3', memberId: 'm2', transactionId: 't8', amount: 2.00, reason: 'Overdue return', status: 'paid', date: '2026-02-10' },
    { id: 'f4', memberId: 'm8', transactionId: '', amount: 15.00, reason: 'Lost book', status: 'pending', date: '2025-12-01' },
    { id: 'f5', memberId: 'm10', transactionId: 't8', amount: 1.00, reason: 'Late return', status: 'paid', date: '2026-02-10' },
    { id: 'f6', memberId: 'm13', transactionId: '', amount: 3.00, reason: 'Overdue return', status: 'pending', date: '2026-01-20' },
];

// ─── Notifications ───
export const notifications: Notification[] = [
    { id: 'n1', type: 'overdue', title: 'Overdue Book', message: 'The Pragmatic Programmer is 2 days overdue.', date: '2026-02-21', read: false, userId: 'm1' },
    { id: 'n2', type: 'reservation_ready', title: 'Reservation Ready', message: 'Design Patterns is now available for pickup.', date: '2026-02-21', read: false, userId: 'm10' },
    { id: 'n3', type: 'due_reminder', title: 'Due Reminder', message: 'Design Patterns is due in 3 days.', date: '2026-02-21', read: false, userId: 'm2' },
    { id: 'n4', type: 'fine', title: 'Fine Added', message: 'A fine of $6.00 has been added to your account.', date: '2026-02-15', read: true, userId: 'm4' },
    { id: 'n5', type: 'system', title: 'System Update', message: 'Library will be closed on Feb 25 for maintenance.', date: '2026-02-20', read: false },
    { id: 'n6', type: 'due_reminder', title: 'Due Reminder', message: 'A Brief History of Time is due in 5 days.', date: '2026-02-21', read: false, userId: 'm6' },
    { id: 'n7', type: 'overdue', title: 'Overdue Book', message: 'Sapiens is 6 days overdue.', date: '2026-02-21', read: false, userId: 'm4' },
];

// FINE_RATE per day
export const FINE_RATE_PER_DAY = 1.00;
export const MAX_BOOKS_PER_MEMBER = 5;
export const LOAN_PERIOD_DAYS = 14;
