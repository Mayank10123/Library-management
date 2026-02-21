import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const BOT_RESPONSES: Record<string, string> = {
    'hello': 'Hello! 👋 Welcome to Koha Library. How can I help you today?',
    'hi': 'Hi there! 📚 I\'m your AI library assistant. What do you need help with?',
    'hours': 'The library is open Monday–Friday 8:00 AM – 8:00 PM, Saturday 9:00 AM – 5:00 PM. Closed on Sundays.',
    'fine': 'Fines are $1.00 per day for overdue books. You can check your fines in the Fines section or pay at the front desk.',
    'renew': 'You can renew a book by going to your borrowed books and clicking the Renew button. Books can be renewed up to 2 times.',
    'reserve': 'To reserve a book, go to the Books page, find the book you want, and click Reserve. You\'ll be notified when it\'s ready.',
    'help': 'I can help with:\n• Library hours\n• Fine information\n• Book renewals\n• Reservations\n• Finding books\n• Account questions\n\nJust ask!',
    'book': 'You can browse all books in the Books section. Use the search bar or filters to find specific titles, authors, or categories.',
    'account': 'You can view your account details, borrowed books, and fines in the Members section. Click on your profile for full details.',
    'thanks': 'You\'re welcome! 😊 Don\'t hesitate to ask if you need anything else.',
    'bye': 'Goodbye! 👋 Happy reading!',
};

function getBotResponse(text: string): string {
    const lower = text.toLowerCase();
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
        if (lower.includes(key)) return response;
    }
    return 'I\'m not sure about that. Try asking about:\n• Library hours\n• Fines\n• Renewing books\n• Reservations\n• Finding books\n\nOr type "help" for all options!';
}

const ChatWidget: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '0', text: 'Hello! 👋 I\'m Koha AI, your library assistant. How can I help you today?', sender: 'bot', timestamp: new Date() },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const unreadCount = 0;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate bot typing delay
        setTimeout(() => {
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(input),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    };

    return (
        <>
            {/* Floating button */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        onClick={() => setOpen(true)}
                        style={{
                            position: 'fixed', bottom: 24, right: 24, zIndex: 8000,
                            width: 56, height: 56, borderRadius: '50%',
                            background: 'var(--accent-gradient)', border: 'none',
                            color: 'white', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MessageCircle size={24} />
                        {unreadCount > 0 && (
                            <div style={{
                                position: 'absolute', top: -4, right: -4,
                                width: 20, height: 20, borderRadius: '50%',
                                background: 'var(--danger)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.6rem', fontWeight: 700,
                            }}>{unreadCount}</div>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        style={{
                            position: 'fixed', bottom: 24, right: 24, zIndex: 8001,
                            width: 360, height: minimized ? 52 : 480,
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            display: 'flex', flexDirection: 'column',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                            transition: 'height 0.3s ease',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: 'var(--sp-3) var(--sp-4)',
                            background: 'var(--accent-gradient)',
                            display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                            color: 'white', cursor: 'pointer',
                        }} onClick={() => setMinimized(!minimized)}>
                            <Bot size={18} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Koha AI Assistant</div>
                                <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>Online · Always here to help</div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setMinimized(!minimized); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <Minimize2 size={14} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={14} />
                            </button>
                        </div>

                        {!minimized && (
                            <>
                                {/* Messages */}
                                <div ref={scrollRef} style={{
                                    flex: 1, overflowY: 'auto', padding: 'var(--sp-3)',
                                    display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)',
                                }}>
                                    {messages.map(msg => (
                                        <div key={msg.id} style={{
                                            display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        }}>
                                            <div style={{
                                                maxWidth: '80%', padding: 'var(--sp-2) var(--sp-3)',
                                                borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                                                background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-glass)',
                                                color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                                                fontSize: 'var(--fs-sm)', lineHeight: 1.5,
                                                whiteSpace: 'pre-line',
                                            }}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div style={{ display: 'flex', gap: 4, padding: 'var(--sp-2)' }}>
                                            {[0, 1, 2].map(i => (
                                                <div key={i} style={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    background: 'var(--text-tertiary)',
                                                    animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
                                                }} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <div style={{
                                    padding: 'var(--sp-2) var(--sp-3)',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex', gap: 'var(--sp-2)',
                                }}>
                                    <input
                                        value={input} onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                        placeholder="Ask me anything..."
                                        style={{
                                            flex: 1, border: 'none', outline: 'none',
                                            background: 'var(--bg-glass)', color: 'var(--text-primary)',
                                            padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--fs-sm)', fontFamily: 'inherit',
                                        }}
                                    />
                                    <button className="btn btn-primary" onClick={sendMessage} disabled={!input.trim()}
                                        style={{ padding: 'var(--sp-2)', borderRadius: 'var(--radius-md)' }}>
                                        <Send size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
