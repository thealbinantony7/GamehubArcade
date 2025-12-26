import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Smile, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { soundManager } from '@/utils/sounds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
}

interface GameChatProps {
    roomCode: string;
    playerName: string;
}

const EMOJIS = ['😊', '😂', '😎', '🤔', '👍', '👎', '🔥', '🎉', '💩', '👻', '🥶', '🤬'];

export const GameChat = ({ roomCode, playerName }: GameChatProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only subscribe to broadcast events for chat
        const channel = supabase.channel(`chat_${roomCode}`)
            .on('broadcast', { event: 'chat-message' }, (payload) => {
                const msg = payload.payload as Message;
                // Only add if it's from someone else (we add our own locally for speed)
                if (msg.sender !== playerName) {
                    setMessages(prev => [...prev, msg]);
                    soundManager.playMessage();
                    if (!isOpen) {
                        setUnreadCount(prev => prev + 1);
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomCode, playerName, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
            scrollToBottom();
        }
    }, [isOpen, messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const sendMessage = async (text: string = newMessage) => {
        if (!text.trim()) return;

        const msg: Message = {
            id: crypto.randomUUID(),
            sender: playerName,
            text: text.trim(),
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, msg]);
        setNewMessage('');
        setShowEmojis(false);

        // Smooth scroll to bottom after sending
        scrollToBottom();

        await supabase.channel(`chat_${roomCode}`).send({
            type: 'broadcast',
            event: 'chat-message',
            payload: msg,
        });
    };

    const handleEmojiClick = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
    };

    return (
        <>
            <div className="fixed bottom-4 right-4 z-40">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => { setIsOpen(true); soundManager.playClick(); }}
                            className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                            <MessageSquare className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-background">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-4 right-4 z-50 w-[90vw] max-w-sm h-[500px] max-h-[80vh] flex flex-col bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <span className="font-semibold">Game Chat</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full w-8 h-8 hover:bg-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm opacity-50 space-y-2">
                                    <MessageSquare className="w-8 h-8 opacity-20" />
                                    <p>No messages yet</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender === playerName;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isMe ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                                                    {msg.sender[0].toUpperCase()}
                                                </div>
                                                <div
                                                    className={`rounded-2xl px-4 py-2 text-sm ${isMe
                                                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                            : 'bg-muted text-foreground rounded-bl-sm'
                                                        }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground mt-1 px-9 opacity-50">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-card border-t border-border/10">
                            <div className="relative flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`shrink-0 rounded-xl ${showEmojis ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                                    onClick={() => setShowEmojis(!showEmojis)}
                                >
                                    <Smile className="w-5 h-5" />
                                </Button>

                                {showEmojis && (
                                    <div className="absolute bottom-12 left-0 w-64 bg-popover border border-border rounded-xl shadow-xl p-2 grid grid-cols-6 gap-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        {EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                className="p-2 hover:bg-muted rounded-lg text-lg transition-colors"
                                                onClick={() => handleEmojiClick(emoji)}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    className="rounded-xl border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary/50"
                                    autoFocus
                                />

                                <Button
                                    onClick={() => sendMessage()}
                                    size="icon"
                                    disabled={!newMessage.trim()}
                                    className="shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
