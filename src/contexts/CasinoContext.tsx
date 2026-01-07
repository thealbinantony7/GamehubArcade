import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// =============================================================================
// TYPES
// =============================================================================

export type CurrencyType = 'BTC' | 'ETH' | 'USDT' | 'SOL' | 'DEMO';

export interface Balance {
    currency: CurrencyType;
    amount: number;
    locked_amount: number;
}

export interface CasinoState {
    mode: 'demo' | 'real';
    currency: CurrencyType;
    balances: Balance[];
    bettingEnabled: boolean;
    loading: boolean;
}

export interface CasinoContextType extends CasinoState {
    setMode: (mode: 'demo' | 'real') => void;
    setCurrency: (currency: CurrencyType) => void;
    refreshBalances: () => Promise<void>;
    getBalance: (currency: CurrencyType) => number;
}

// =============================================================================
// CONTEXT
// =============================================================================

const CasinoContext = createContext<CasinoContextType | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

export function CasinoProvider({ children }: { children: ReactNode }) {
    const { user, session } = useAuth();

    const [mode, setMode] = useState<'demo' | 'real'>('demo');
    const [currency, setCurrency] = useState<CurrencyType>('DEMO');
    const [balances, setBalances] = useState<Balance[]>([]);
    const [bettingEnabled, setBettingEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    // Sync mode with currency
    const handleSetMode = (newMode: 'demo' | 'real') => {
        setMode(newMode);
        if (newMode === 'demo') {
            setCurrency('DEMO');
        } else if (currency === 'DEMO') {
            setCurrency('USDT'); // Default real currency
        }
    };

    const handleSetCurrency = (newCurrency: CurrencyType) => {
        setCurrency(newCurrency);
        if (newCurrency === 'DEMO') {
            setMode('demo');
        } else {
            setMode('real');
        }
    };

    // Fetch balances from DB
    const refreshBalances = async () => {
        if (!user) {
            setBalances([]);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('balances')
                .select('currency, amount, locked_amount')
                .eq('user_id', user.id);

            if (error) throw error;
            setBalances(data || []);
        } catch (error) {
            console.error('Error fetching balances:', error);
        }
    };

    // Fetch platform settings
    const fetchPlatformSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('platform_settings')
                .select('key, value')
                .eq('key', 'betting_enabled')
                .single();

            if (error) throw error;
            setBettingEnabled(data?.value === true || data?.value === 'true');
        } catch (error) {
            console.error('Error fetching platform settings:', error);
            setBettingEnabled(true); // Default to enabled
        }
    };

    // Subscribe to realtime system events
    useEffect(() => {
        const channel = supabase.channel('system')
            .on('broadcast', { event: 'emergency_stop' }, () => {
                setBettingEnabled(false);
            })
            .on('broadcast', { event: 'resume_betting' }, () => {
                setBettingEnabled(true);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Load data when user changes
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([refreshBalances(), fetchPlatformSettings()]);
            setLoading(false);
        };

        if (user) {
            loadData();
        } else {
            setBalances([]);
            setLoading(false);
        }
    }, [user]);

    // Helper to get balance for a currency
    const getBalance = (curr: CurrencyType): number => {
        const balance = balances.find(b => b.currency === curr);
        return balance ? balance.amount - balance.locked_amount : 0;
    };

    return (
        <CasinoContext.Provider
            value={{
                mode,
                currency,
                balances,
                bettingEnabled,
                loading,
                setMode: handleSetMode,
                setCurrency: handleSetCurrency,
                refreshBalances,
                getBalance,
            }}
        >
            {children}
        </CasinoContext.Provider>
    );
}

// =============================================================================
// HOOK
// =============================================================================

export function useCasino() {
    const context = useContext(CasinoContext);
    if (!context) {
        throw new Error('useCasino must be used within a CasinoProvider');
    }
    return context;
}
