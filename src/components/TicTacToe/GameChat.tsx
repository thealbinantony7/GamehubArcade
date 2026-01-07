import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Smile, Music, Zap, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { soundManager } from '@/utils/sounds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RealtimeChannel } from '@supabase/supabase-js';
import { toast } from 'sonner';

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

const EMOJIS = ['😊', '😂', '😎', '🤔', '👍', '👎', '🔥', '🎉', '💩', '👻', '🥶', '❤️'];

const FUN_SOUNDS = [
    { id: 'cheer', icon: '🎉', label: 'Cheer', color: 'bg-yellow-500/20 text-yellow-500' },
    { id: 'laugh', icon: '😂', label: 'Laugh', color: 'bg-blue-500/20 text-blue-500' },
    { id: 'sad', icon: '😢', label: 'Sad', color: 'bg-indigo-500/20 text-indigo-500' },
    { id: 'drum', icon: '🥁', label: 'Drum', color: 'bg-red-500/20 text-red-500' },
];

export const GameChat = ({ roomCode, playerName }: GameChatProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'fun'>('chat');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Effects state
    const [floatingEffects, setFloatingEffects] = useState<{ id: string, emoji: string, x: number }[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const channelRef = useRef<RealtimeChannel | null>(null);

    useEffect(() => {
        const channel = supabase.channel(`chat_${roomCode}`, {
            config: {
                broadcast: { self: false }
            }
        });

        channel
            .on('broadcast', { event: 'chat-message' }, (payload) => {
                const msg = payload.payload as Message;
                setMessages(prev => [...prev, msg]);
                soundManager.playMessage();
                if (!isOpen) {
                    setUnreadCount(prev => prev + 1);
                }
            })
            .on('broadcast', { event: 'play-sound' }, (payload) => {
                const { id } = payload.payload;
                switch (id) {
                    case 'cheer': soundManager.playCheer(); break;
                    case 'laugh': soundManager.playLaugh(); break;
                    case 'sad': soundManager.playSad(); break;
                    case 'drum': soundManager.playDrum(); break;
                }
                toast(`Opponent played: ${id.toUpperCase()}!`, { icon: '🎵' });
            })
            .on('broadcast', { event: 'emoji-effect' }, (payload) => {
                const { emoji } = payload.payload;
                triggerFloatingEffect(emoji);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Connected to chat channel');
                }
            });

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomCode, isOpen]);

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

        // Add locally immediately
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
        setShowEmojis(false);
        scrollToBottom();

        // Send via subscribed channel
        channelRef.current?.send({
            type: 'broadcast',
            event: 'chat-message',
            payload: msg,
        });
    };

    const sendSound = (soundId: string) => {
        soundManager.playClick();
        channelRef.current?.send({
            type: 'broadcast',
            event: 'play-sound',
            payload: { id: soundId },
        });
        toast.success(`Sent sound!`);
    };

    const sendEmojiEffect = (emoji: string) => {
        soundManager.playClick();
        triggerFloatingEffect(emoji); // Show locally too
        channelRef.current?.send({
            type: 'broadcast',
            event: 'emoji-effect',
            payload: { emoji },
        });
        toast.success(`Sent effect!`);
    };

    const triggerFloatingEffect = (emoji: string) => {
        // Spawn multiple particles
        const count = 10;
        for (let i = 0; i < count; i++) {
            const id = crypto.randomUUID();
            const x = Math.random() * 80 + 10; // 10% to 90% screen width
            setFloatingEffects(prev => [...prev, { id, emoji, x }]);

            // Cleanup
            setTimeout(() => {
                setFloatingEffects(prev => prev.filter(e => e.id !== id));
            }, 3000);
        }
    };

    const handleEmojiClick = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
    };

    return (
        <>
            {/* Floating Effects Layer */}
            <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                <AnimatePresence>
                    {floatingEffects.map(effect => (
                        <motion.div
                            key={effect.id}
                            initial={{ y: '100vh', opacity: 1, x: `${effect.x}vw` }}
                            animate={{ y: '-10vh', opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2 + Math.random(), ease: 'easeOut' }}
                            className="absolute text-4xl"
                        >
                            {effect.emoji}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

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
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-background animate-bounce">
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
                            <div className="flex gap-1 p-1 bg-black/20 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Chat
                                </button>
                                <button
                                    onClick={() => setActiveTab('fun')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${activeTab === 'fun' ? 'bg-secondary text-secondary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Zap className="w-3 h-3" />
                                    Fun
                                </button>
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

                        {/* Content */}
                        {activeTab === 'chat' ? (
                            <>
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
                            </>
                        ) : (
                            /* Fun Tab Content */
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-black/5">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Volume2 className="w-4 h-4" />
                                        Sound Effects
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {FUN_SOUNDS.map(sound => (
                                            <motion.button
                                                key={sound.id}
                                                onClick={() => sendSound(sound.id)}
                                                className={`p-4 rounded-xl flex items-center justify-center gap-3 transition-colors ${sound.color} border border-transparent hover:border-white/10`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="text-2xl">{sound.icon}</span>
                                                <span className="font-medium">{sound.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        Visual Effects
                                    </h3>
                                    <div className="grid grid-cols-4 gap-2">
                                        {EMOJIS.map(emoji => (
                                            <motion.button
                                                key={emoji}
                                                onClick={() => sendEmojiEffect(emoji)}
                                                className="aspect-square rounded-xl bg-card border border-border/20 flex items-center justify-center text-2xl hover:bg-primary/10 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {emoji}
                                            </motion.button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground pt-2">
                                        Tap an emoji to send a shower of particles!
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
