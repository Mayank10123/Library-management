import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';

interface Review {
    id: string;
    bookId: string;
    userName: string;
    rating: number;
    text: string;
    date: string;
}

// Built-in sample reviews
const SAMPLE_REVIEWS: Review[] = [
    { id: 'rv1', bookId: 'b1', userName: 'Sarah P.', rating: 5, text: 'Absolutely essential reading for every programmer. Changed how I think about software development.', date: '2026-02-10' },
    { id: 'rv2', bookId: 'b1', userName: 'Kevin W.', rating: 4, text: 'Great book with practical advice. Some chapters feel dated but the core ideas are timeless.', date: '2026-02-05' },
    { id: 'rv3', bookId: 'b2', userName: 'Lisa C.', rating: 5, text: 'A masterpiece of American literature. Still deeply relevant today.', date: '2026-01-20' },
    { id: 'rv4', bookId: 'b4', userName: 'James W.', rating: 5, text: 'Chilling and prescient. Orwell\'s vision is more relevant than ever.', date: '2026-01-15' },
    { id: 'rv5', bookId: 'b5', userName: 'Raj P.', rating: 4, text: 'The definitive algorithms textbook. Dense but comprehensive.', date: '2026-02-01' },
    { id: 'rv6', bookId: 'b8', userName: 'Dr. Emily F.', rating: 5, text: 'Hawking explains the cosmos with clarity and wonder. A must-read.', date: '2026-01-28' },
    { id: 'rv7', bookId: 'b13', userName: 'Dr. Nora A.', rating: 5, text: 'Kahneman\'s exploration of cognitive biases is groundbreaking. Changed my understanding of decision-making.', date: '2026-02-08' },
    { id: 'rv8', bookId: 'b17', userName: 'Kevin W.', rating: 4, text: 'Clean Code should be required reading. The naming conventions chapter alone is worth it.', date: '2026-01-30' },
];

export function useReviews() {
    const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);

    const addReview = (bookId: string, userName: string, rating: number, text: string) => {
        setReviews(prev => [...prev, {
            id: 'rv' + Date.now(),
            bookId, userName, rating, text,
            date: new Date().toISOString().split('T')[0],
        }]);
    };

    const getReviewsForBook = (bookId: string) => reviews.filter(r => r.bookId === bookId);

    const getAverageRating = (bookId: string) => {
        const bookReviews = getReviewsForBook(bookId);
        if (bookReviews.length === 0) return 0;
        return bookReviews.reduce((s, r) => s + r.rating, 0) / bookReviews.length;
    };

    return { reviews, addReview, getReviewsForBook, getAverageRating };
}

// Star Rating Component
export const StarRating: React.FC<{ rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void }> = ({
    rating, size = 14, interactive = false, onChange
}) => {
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={size}
                    fill={(interactive ? hover || rating : rating) >= s ? 'var(--warning)' : 'transparent'}
                    style={{
                        color: (interactive ? hover || rating : rating) >= s ? 'var(--warning)' : 'var(--text-tertiary)',
                        cursor: interactive ? 'pointer' : 'default',
                        transition: 'transform 0.15s',
                        transform: interactive && hover === s ? 'scale(1.2)' : 'scale(1)',
                    }}
                    onClick={() => interactive && onChange?.(s)}
                    onMouseEnter={() => interactive && setHover(s)}
                    onMouseLeave={() => interactive && setHover(0)}
                />
            ))}
        </div>
    );
};

// Review Card
export const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="glass-panel" style={{ padding: 'var(--sp-3) var(--sp-4)', display: 'flex', gap: 'var(--sp-3)' }}>
        <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontSize: '0.7rem', fontWeight: 700, color: 'white',
        }}>{review.userName.charAt(0)}</div>
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{review.userName}</span>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>{review.date}</span>
            </div>
            <StarRating rating={review.rating} size={12} />
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginTop: 'var(--sp-1)', lineHeight: 1.5 }}>{review.text}</p>
        </div>
    </div>
);

// ReviewForm
export const ReviewForm: React.FC<{ onSubmit: (rating: number, text: string) => void }> = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (rating > 0 && text.trim()) {
            onSubmit(rating, text);
            setRating(0);
            setText('');
        }
    };

    return (
        <div className="glass-panel" style={{ padding: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
                <MessageSquare size={14} style={{ color: 'var(--accent-tertiary)' }} />
                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Write a Review</span>
            </div>
            <StarRating rating={rating} interactive onChange={setRating} size={20} />
            <textarea
                placeholder="Share your thoughts..."
                value={text} onChange={e => setText(e.target.value)}
                style={{
                    width: '100%', marginTop: 'var(--sp-2)', padding: 'var(--sp-2)',
                    background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                    fontSize: 'var(--fs-sm)', resize: 'vertical', minHeight: 60,
                    fontFamily: 'inherit',
                }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--sp-2)' }}>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={!rating || !text.trim()}
                    style={{ fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-3)' }}>
                    <Send size={13} /> Submit
                </button>
            </div>
        </div>
    );
};
