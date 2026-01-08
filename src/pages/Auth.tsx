/**
 * AUTH — Sign In / Sign Up
 * Minimal, no frills.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Loader2, Diamond } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email');
const passwordSchema = z.string().min(6, 'Min 6 characters');
const usernameSchema = z.string().min(2, 'Min 2 characters').max(20, 'Max 20 characters');

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; username?: string }>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const validate = () => {
    const newErrors: typeof errors = {};
    try { emailSchema.parse(email); } catch (e) { if (e instanceof z.ZodError) newErrors.email = e.errors[0].message; }
    try { passwordSchema.parse(password); } catch (e) { if (e instanceof z.ZodError) newErrors.password = e.errors[0].message; }
    if (mode === 'signup') {
      try { usernameSchema.parse(username); } catch (e) { if (e instanceof z.ZodError) newErrors.username = e.errors[0].message; }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) toast.error('Invalid credentials');
        else navigate('/');
      } else {
        const { error } = await signUp(email, password, username);
        if (error) toast.error(error.message);
        else { toast.success('Account created'); navigate('/'); }
      }
    } catch { toast.error('Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,5%)] flex flex-col items-center justify-center p-5">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(0,70%,42%)] to-[hsl(0,75%,32%)] flex items-center justify-center">
            <Diamond className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-white/90">GameHub</span>
        </Link>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-white/90">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
          </div>

          {mode === 'signup' && (
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-[hsl(0,0%,10%)] border border-white/6 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[hsl(0,70%,42%,0.5)] transition-colors"
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>
          )}

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-[hsl(0,0%,10%)] border border-white/6 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[hsl(0,70%,42%,0.5)] transition-colors"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[hsl(0,0%,10%)] border border-white/6 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[hsl(0,70%,42%,0.5)] transition-colors"
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[hsl(0,70%,42%)] hover:bg-[hsl(0,70%,48%)] text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-white/35 text-sm mt-6">
          {mode === 'login' ? "No account? " : "Have an account? "}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}); }}
            className="text-white/60 hover:text-white/80 transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {/* Back */}
        <Link
          to="/"
          className="flex items-center justify-center gap-1.5 text-white/25 hover:text-white/50 transition-colors text-sm mt-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </motion.div>
    </div>
  );
}
