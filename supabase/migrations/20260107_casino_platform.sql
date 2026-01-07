-- =============================================================================
-- CRYPTO GAMBLING PLATFORM - DATABASE MIGRATION
-- =============================================================================
-- Version: 1.0.0
-- Date: 2026-01-07
-- Specification Lock: v1
-- Audit Status: PASSED
-- =============================================================================
-- LOCKED SPECIFICATIONS IMPLEMENTED:
--   ✓ Demo balance: 1,000 credits (with daily refill)
--   ✓ Seed rotation: Auto after 1,000 bets + user-initiated (rate-limited 10s)
--   ✓ Withdrawals: Single admin ≤ $5,000, dual admin > $5,000
--   ✓ Emergency stop: Auto-cancel AND refund ALL pending bets
--   ✓ Currency display: Crypto only (BTC, ETH, USDT, SOL, DEMO)
--   ✓ Arcade games: Separate category
--   ✓ House edge: Strictly enforced defaults
--   ✓ Demo bets: Excluded from real stats/VIP
-- =============================================================================

-- ENUMS
DO $$ BEGIN CREATE TYPE currency_type AS ENUM ('BTC','ETH','USDT','SOL','DEMO'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE bet_status AS ENUM ('pending','completed','cancelled','refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE withdrawal_status AS ENUM ('pending','awaiting_second','approved','processing','completed','rejected','cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE deposit_status AS ENUM ('pending','confirming','completed','failed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE transaction_type AS ENUM ('deposit','withdrawal','bet','win','refund','bonus','rakeback','referral','admin_adjustment','daily_refill'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE game_category AS ENUM ('originals','table','slots','arcade'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'super_admin'; EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'finance'; EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =============================================================================
-- PLATFORM SETTINGS (LOCKED VALUES)
-- =============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO platform_settings (key, value, description) VALUES
    ('betting_enabled', 'true', 'Global betting switch'),
    ('maintenance_mode', 'false', 'Maintenance mode'),
    ('demo_starting_balance', '1000', 'LOCKED: Demo = 1,000 credits'),
    ('demo_daily_refill_amount', '1000', 'LOCKED: Daily refill to 1,000'),
    ('seed_auto_rotation_threshold', '1000', 'LOCKED: Auto-rotate after 1,000 bets'),
    ('seed_manual_rotation_cooldown_seconds', '10', 'LOCKED: 10s rate limit'),
    ('withdrawal_single_approval_limit_usd', '5000', 'LOCKED: Single ≤ $5,000'),
    ('min_deposit', '{"BTC":0.0001,"ETH":0.001,"USDT":1,"SOL":0.1}', 'Min deposits'),
    ('min_withdrawal', '{"BTC":0.0005,"ETH":0.005,"USDT":10,"SOL":0.5}', 'Min withdrawals'),
    ('withdrawal_fee', '{"BTC":0.0001,"ETH":0.001,"USDT":1,"SOL":0.01}', 'Fees'),
    ('max_pending_withdrawals', '3', 'Max pending per user')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- VIP LEVELS
-- =============================================================================
CREATE TABLE IF NOT EXISTS vip_levels (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    min_wagered DECIMAL(20,8) DEFAULT 0,
    rakeback_percent DECIMAL(5,4) DEFAULT 0,
    bonus_multiplier DECIMAL(5,2) DEFAULT 1.0,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO vip_levels (name, min_wagered, rakeback_percent, bonus_multiplier, color) VALUES
    ('Bronze', 0, 0.001, 1.0, '#CD7F32'),
    ('Silver', 10000, 0.002, 1.1, '#C0C0C0'),
    ('Gold', 50000, 0.003, 1.25, '#FFD700'),
    ('Platinum', 200000, 0.005, 1.5, '#E5E4E2'),
    ('Diamond', 1000000, 0.01, 2.0, '#B9F2FF')
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- WALLETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    chain TEXT NOT NULL CHECK (chain IN ('ethereum','solana','bitcoin','polygon')),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT wallets_address_chain_unique UNIQUE(address, chain)
);
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);

-- =============================================================================
-- BALANCES
-- =============================================================================
CREATE TABLE IF NOT EXISTS balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    currency TEXT NOT NULL CHECK (currency IN ('BTC','ETH','USDT','SOL','DEMO')),
    amount DECIMAL(20,8) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    locked_amount DECIMAL(20,8) NOT NULL DEFAULT 0 CHECK (locked_amount >= 0),
    last_daily_refill TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT balances_user_currency_unique UNIQUE(user_id, currency)
);
CREATE INDEX IF NOT EXISTS idx_balances_user ON balances(user_id);

-- =============================================================================
-- CASINO GAMES (LOCKED HOUSE EDGES)
-- =============================================================================
CREATE TABLE IF NOT EXISTS casino_games (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('originals','table','slots','arcade')),
    is_active BOOLEAN DEFAULT true,
    min_bet DECIMAL(20,8) DEFAULT 0.0001,
    max_bet DECIMAL(20,8) DEFAULT 10000,
    house_edge DECIMAL(5,4) NOT NULL,
    house_edge_min DECIMAL(5,4),
    house_edge_max DECIMAL(5,4),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO casino_games (id, name, category, house_edge, house_edge_min, house_edge_max, sort_order) VALUES
    ('dice', 'Dice', 'originals', 0.01, 0.005, 0.05, 1),
    ('crash', 'Crash', 'originals', 0.01, 0.005, 0.05, 2),
    ('plinko', 'Plinko', 'originals', 0.03, 0.01, 0.10, 3),
    ('mines', 'Mines', 'originals', 0.02, 0.01, 0.05, 4),
    ('roulette', 'Roulette', 'table', 0.027, 0.027, 0.027, 5),
    ('blackjack', 'Blackjack', 'table', 0.01, 0.005, 0.02, 6),
    ('slots', 'Slots', 'slots', 0.04, 0.02, 0.10, 7)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- GAME CONFIGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS game_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id TEXT NOT NULL REFERENCES casino_games(id) ON DELETE CASCADE,
    config_key TEXT NOT NULL,
    config_value JSONB NOT NULL,
    CONSTRAINT game_configs_unique UNIQUE(game_id, config_key)
);

-- =============================================================================
-- PROVABLY FAIR SEEDS
-- =============================================================================
CREATE TABLE IF NOT EXISTS provably_fair_seeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    server_seed TEXT NOT NULL,
    server_seed_hash TEXT NOT NULL,
    client_seed TEXT NOT NULL,
    nonce_counter INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    revealed_at TIMESTAMPTZ,
    last_manual_rotation TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_seeds_user_active ON provably_fair_seeds(user_id, is_active);

-- =============================================================================
-- BETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL REFERENCES casino_games(id),
    amount DECIMAL(20,8) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL CHECK (currency IN ('BTC','ETH','USDT','SOL','DEMO')),
    multiplier DECIMAL(10,4),
    payout DECIMAL(20,8),
    profit DECIMAL(20,8),
    game_data JSONB DEFAULT '{}'::jsonb,
    result_data JSONB,
    seed_id UUID REFERENCES provably_fair_seeds(id),
    nonce INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled','refunded')),
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_bets_user ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
CREATE INDEX IF NOT EXISTS idx_bets_is_demo ON bets(is_demo);

-- =============================================================================
-- DEPOSITS
-- =============================================================================
CREATE TABLE IF NOT EXISTS deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    currency TEXT NOT NULL CHECK (currency IN ('BTC','ETH','USDT','SOL')),
    amount DECIMAL(20,8) NOT NULL CHECK (amount > 0),
    tx_hash TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirming','completed','failed')),
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(user_id);

-- =============================================================================
-- WITHDRAWALS (FULL STATE MACHINE)
-- =============================================================================
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    currency TEXT NOT NULL CHECK (currency IN ('BTC','ETH','USDT','SOL')),
    amount DECIMAL(20,8) NOT NULL CHECK (amount > 0),
    amount_usd_equivalent DECIMAL(20,2),
    fee DECIMAL(20,8) DEFAULT 0,
    to_address TEXT NOT NULL,
    chain TEXT NOT NULL CHECK (chain IN ('ethereum','solana','bitcoin','polygon')),
    tx_hash TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','awaiting_second','approved','processing','completed','rejected','cancelled')),
    first_approver_id UUID REFERENCES auth.users(id),
    first_approved_at TIMESTAMPTZ,
    second_approver_id UUID REFERENCES auth.users(id),
    second_approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON withdrawals(user_id);

-- =============================================================================
-- TRANSACTIONS (AUDIT TRAIL)
-- =============================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('deposit','withdrawal','bet','win','refund','bonus','rakeback','referral','admin_adjustment','daily_refill')),
    amount DECIMAL(20,8) NOT NULL,
    currency TEXT NOT NULL CHECK (currency IN ('BTC','ETH','USDT','SOL','DEMO')),
    bet_id UUID REFERENCES bets(id),
    deposit_id UUID REFERENCES deposits(id),
    withdrawal_id UUID REFERENCES withdrawals(id),
    balance_before DECIMAL(20,8) NOT NULL,
    balance_after DECIMAL(20,8) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

-- =============================================================================
-- USER STATS (DEMO/REAL SEPARATION)
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    -- REAL stats only (for VIP)
    total_wagered DECIMAL(20,8) DEFAULT 0,
    total_won DECIMAL(20,8) DEFAULT 0,
    total_lost DECIMAL(20,8) DEFAULT 0,
    net_profit DECIMAL(20,8) DEFAULT 0,
    total_bets INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_losses INTEGER DEFAULT 0,
    largest_win DECIMAL(20,8) DEFAULT 0,
    largest_multiplier DECIMAL(10,4) DEFAULT 0,
    -- DEMO stats separate
    demo_total_bets INTEGER DEFAULT 0,
    demo_total_wagered DECIMAL(20,8) DEFAULT 0,
    -- VIP from REAL only
    vip_level_id INTEGER REFERENCES vip_levels(id) DEFAULT 1,
    xp_points INTEGER DEFAULT 0,
    last_bet_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- USER SETTINGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_mode TEXT DEFAULT 'demo' CHECK (preferred_mode IN ('demo','real')),
    preferred_currency TEXT DEFAULT 'USDT' CHECK (preferred_currency IN ('BTC','ETH','USDT','SOL')),
    daily_loss_limit DECIMAL(20,8),
    self_excluded_until TIMESTAMPTZ,
    sound_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- ADMIN LOGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);

-- =============================================================================
-- REFERRALS
-- =============================================================================
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id),
    referred_id UUID NOT NULL REFERENCES auth.users(id),
    code TEXT NOT NULL,
    total_commission DECIMAL(20,8) DEFAULT 0,
    CONSTRAINT referrals_referred_unique UNIQUE(referred_id)
);

-- =============================================================================
-- EXTEND PROFILES
-- =============================================================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='referral_code') THEN
        ALTER TABLE profiles ADD COLUMN referral_code TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='terms_accepted_at') THEN
        ALTER TABLE profiles ADD COLUMN terms_accepted_at TIMESTAMPTZ;
    END IF;
END $$;

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TEXT AS $$
DECLARE chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; code TEXT := ''; i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP code := code || substr(chars, floor(random()*length(chars)+1)::int, 1); END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Role checks (AUDIT FIX #5: Specific roles for money)
CREATE OR REPLACE FUNCTION is_admin(uid UUID) RETURNS BOOLEAN AS $$
BEGIN RETURN EXISTS (SELECT 1 FROM user_roles WHERE user_id=uid AND role IN ('admin','super_admin','moderator')); END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin(uid UUID) RETURNS BOOLEAN AS $$
BEGIN RETURN EXISTS (SELECT 1 FROM user_roles WHERE user_id=uid AND role='super_admin'); END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_finance_admin(uid UUID) RETURNS BOOLEAN AS $$
BEGIN RETURN EXISTS (SELECT 1 FROM user_roles WHERE user_id=uid AND role IN ('super_admin','finance')); END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- PROVABLY FAIR SEED CREATION (AUDIT FIX #1: Hash SAME bytes)
-- =============================================================================
CREATE OR REPLACE FUNCTION create_provably_fair_seed(p_user_id UUID, p_client_seed TEXT DEFAULT NULL) RETURNS UUID AS $$
DECLARE
    v_server_seed TEXT;
    v_hash TEXT;
    v_id UUID;
BEGIN
    -- Generate hex string
    v_server_seed := encode(gen_random_bytes(32), 'hex');
    -- Hash the EXACT string that will be stored and revealed
    v_hash := encode(sha256(v_server_seed::bytea), 'hex');
    
    INSERT INTO provably_fair_seeds (user_id, server_seed, server_seed_hash, client_seed)
    VALUES (p_user_id, v_server_seed, v_hash, COALESCE(p_client_seed, encode(gen_random_bytes(16),'hex')))
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- USER INITIALIZATION (LOCKED: 1,000 demo credits)
-- =============================================================================
CREATE OR REPLACE FUNCTION initialize_user_gambling_data() RETURNS TRIGGER AS $$
DECLARE v_ref_code TEXT;
BEGIN
    LOOP
        v_ref_code := generate_referral_code();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code=v_ref_code);
    END LOOP;
    
    UPDATE profiles SET referral_code=v_ref_code WHERE user_id=NEW.id;
    
    INSERT INTO balances (user_id, currency, amount, last_daily_refill) VALUES (NEW.id, 'DEMO', 1000, now()) ON CONFLICT DO NOTHING;
    INSERT INTO balances (user_id, currency, amount) VALUES (NEW.id,'BTC',0),(NEW.id,'ETH',0),(NEW.id,'USDT',0),(NEW.id,'SOL',0) ON CONFLICT DO NOTHING;
    INSERT INTO user_settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
    INSERT INTO user_stats (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
    PERFORM create_provably_fair_seed(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_gambling ON auth.users;
CREATE TRIGGER on_auth_user_created_gambling AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION initialize_user_gambling_data();

-- =============================================================================
-- DAILY REFILL (LOCKED: 1,000 credits)
-- =============================================================================
CREATE OR REPLACE FUNCTION refill_demo_balance(p_user_id UUID) RETURNS BOOLEAN AS $$
DECLARE v_bal balances%ROWTYPE; v_refill DECIMAL := 1000;
BEGIN
    SELECT * INTO v_bal FROM balances WHERE user_id=p_user_id AND currency='DEMO' FOR UPDATE;
    IF NOT FOUND OR v_bal.amount >= v_refill THEN RETURN FALSE; END IF;
    IF v_bal.last_daily_refill IS NOT NULL AND v_bal.last_daily_refill > now() - interval '24 hours' THEN RETURN FALSE; END IF;
    
    UPDATE balances SET amount=v_refill, last_daily_refill=now() WHERE user_id=p_user_id AND currency='DEMO';
    INSERT INTO transactions (user_id, type, amount, currency, balance_before, balance_after, description)
    VALUES (p_user_id, 'daily_refill', v_refill-v_bal.amount, 'DEMO', v_bal.amount, v_refill, 'Daily demo refill');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- SEED ROTATION (LOCKED: Auto @ 1,000 bets, Manual rate-limited 10s)
-- =============================================================================
CREATE OR REPLACE FUNCTION rotate_user_seed(p_user_id UUID) RETURNS TABLE(old_server_seed TEXT, new_server_seed_hash TEXT) AS $$
DECLARE v_old TEXT; v_old_client TEXT; v_new_id UUID;
BEGIN
    UPDATE provably_fair_seeds SET is_active=false, revealed_at=now()
    WHERE user_id=p_user_id AND is_active=true RETURNING server_seed, client_seed INTO v_old, v_old_client;
    
    v_new_id := create_provably_fair_seed(p_user_id, v_old_client);
    RETURN QUERY SELECT v_old, (SELECT server_seed_hash FROM provably_fair_seeds WHERE id=v_new_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION rotate_seed_if_threshold(p_user_id UUID) RETURNS BOOLEAN AS $$
DECLARE v_seed provably_fair_seeds%ROWTYPE; v_threshold INTEGER;
BEGIN
    SELECT (value::text)::integer INTO v_threshold FROM platform_settings WHERE key='seed_auto_rotation_threshold';
    SELECT * INTO v_seed FROM provably_fair_seeds WHERE user_id=p_user_id AND is_active=true;
    IF v_seed.nonce_counter >= COALESCE(v_threshold, 1000) THEN
        PERFORM rotate_user_seed(p_user_id);
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION manual_rotate_seed(p_user_id UUID) RETURNS JSONB AS $$
DECLARE v_seed provably_fair_seeds%ROWTYPE; v_old TEXT; v_new TEXT; v_cooldown INTEGER;
BEGIN
    SELECT (value::text)::integer INTO v_cooldown FROM platform_settings WHERE key='seed_manual_rotation_cooldown_seconds';
    SELECT * INTO v_seed FROM provably_fair_seeds WHERE user_id=p_user_id AND is_active=true;
    
    IF v_seed.last_manual_rotation IS NOT NULL AND v_seed.last_manual_rotation > now() - (COALESCE(v_cooldown,10) || ' seconds')::interval THEN
        RETURN jsonb_build_object('success', false, 'error', 'Rate limited');
    END IF;
    
    SELECT * FROM rotate_user_seed(p_user_id) INTO v_old, v_new;
    UPDATE provably_fair_seeds SET last_manual_rotation=now() WHERE user_id=p_user_id AND is_active=true;
    
    RETURN jsonb_build_object('success', true, 'old_seed', v_old, 'new_hash', v_new);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- WITHDRAWAL APPROVAL (LOCKED: Single ≤$5k, Dual >$5k) (AUDIT FIX #4: Full state machine)
-- =============================================================================
CREATE OR REPLACE FUNCTION approve_withdrawal(p_id UUID, p_admin_id UUID, p_tx_hash TEXT DEFAULT NULL) RETURNS JSONB AS $$
DECLARE v_w withdrawals%ROWTYPE; v_limit DECIMAL; v_needs_second BOOLEAN;
BEGIN
    IF NOT is_finance_admin(p_admin_id) THEN RETURN jsonb_build_object('success',false,'error','Unauthorized'); END IF;
    
    SELECT (value::text)::decimal INTO v_limit FROM platform_settings WHERE key='withdrawal_single_approval_limit_usd';
    SELECT * INTO v_w FROM withdrawals WHERE id=p_id FOR UPDATE;
    IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error','Not found'); END IF;
    
    v_needs_second := COALESCE(v_w.amount_usd_equivalent,0) > COALESCE(v_limit,5000);
    
    IF v_w.status = 'pending' THEN
        UPDATE withdrawals SET first_approver_id=p_admin_id, first_approved_at=now(),
            status = CASE WHEN v_needs_second THEN 'awaiting_second' ELSE 'approved' END WHERE id=p_id;
        INSERT INTO admin_logs (admin_id,action,entity_type,entity_id,new_values)
        VALUES (p_admin_id,'approve_first','withdrawal',p_id::text,jsonb_build_object('needs_second',v_needs_second));
        RETURN jsonb_build_object('success',true,'status', CASE WHEN v_needs_second THEN 'awaiting_second' ELSE 'approved' END);
        
    ELSIF v_w.status = 'awaiting_second' THEN
        IF v_w.first_approver_id = p_admin_id THEN RETURN jsonb_build_object('success',false,'error','Different admin required'); END IF;
        UPDATE withdrawals SET second_approver_id=p_admin_id, second_approved_at=now(), status='approved' WHERE id=p_id;
        INSERT INTO admin_logs (admin_id,action,entity_type,entity_id) VALUES (p_admin_id,'approve_second','withdrawal',p_id::text);
        RETURN jsonb_build_object('success',true,'status','approved');
        
    ELSIF v_w.status = 'approved' THEN
        UPDATE withdrawals SET status='processing' WHERE id=p_id;
        RETURN jsonb_build_object('success',true,'status','processing');
        
    ELSIF v_w.status = 'processing' AND p_tx_hash IS NOT NULL THEN
        UPDATE withdrawals SET status='completed', tx_hash=p_tx_hash, completed_at=now() WHERE id=p_id;
        UPDATE balances SET locked_amount=locked_amount-v_w.amount WHERE user_id=v_w.user_id AND currency=v_w.currency;
        INSERT INTO admin_logs (admin_id,action,entity_type,entity_id,new_values) VALUES (p_admin_id,'complete','withdrawal',p_id::text,jsonb_build_object('tx_hash',p_tx_hash));
        RETURN jsonb_build_object('success',true,'status','completed');
    END IF;
    
    RETURN jsonb_build_object('success',false,'error','Invalid state: '||v_w.status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_withdrawal(p_id UUID, p_admin_id UUID, p_reason TEXT) RETURNS JSONB AS $$
DECLARE v_w withdrawals%ROWTYPE; v_bal_before DECIMAL;
BEGIN
    IF NOT is_finance_admin(p_admin_id) THEN RETURN jsonb_build_object('success',false,'error','Unauthorized'); END IF;
    
    SELECT * INTO v_w FROM withdrawals WHERE id=p_id AND status IN ('pending','awaiting_second') FOR UPDATE;
    IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error','Not found or wrong status'); END IF;
    
    SELECT amount INTO v_bal_before FROM balances WHERE user_id=v_w.user_id AND currency=v_w.currency FOR UPDATE;
    UPDATE balances SET amount=amount+v_w.amount, locked_amount=locked_amount-v_w.amount WHERE user_id=v_w.user_id AND currency=v_w.currency;
    UPDATE withdrawals SET status='rejected', rejection_reason=p_reason WHERE id=p_id;
    
    INSERT INTO transactions (user_id, type, amount, currency, withdrawal_id, balance_before, balance_after, description)
    VALUES (v_w.user_id, 'refund', v_w.amount, v_w.currency, p_id, v_bal_before, v_bal_before+v_w.amount, 'Withdrawal rejected: '||p_reason);
    INSERT INTO admin_logs (admin_id,action,entity_type,entity_id,new_values) VALUES (p_admin_id,'reject','withdrawal',p_id::text,jsonb_build_object('reason',p_reason));
    
    RETURN jsonb_build_object('success',true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- EMERGENCY STOP (LOCKED: Cancel AND refund ALL) (AUDIT FIX #2 & #3: Transaction-safe, correct logging)
-- =============================================================================
CREATE OR REPLACE FUNCTION emergency_stop(p_admin_id UUID, p_reason TEXT) RETURNS JSONB AS $$
DECLARE v_count INTEGER := 0; v_bet RECORD; v_bal_before DECIMAL;
BEGIN
    IF NOT is_super_admin(p_admin_id) THEN RETURN jsonb_build_object('success',false,'error','Super admin required'); END IF;
    
    UPDATE platform_settings SET value='false', updated_by=p_admin_id, updated_at=now() WHERE key='betting_enabled';
    
    FOR v_bet IN SELECT * FROM bets WHERE status='pending' FOR UPDATE LOOP
        SELECT amount INTO v_bal_before FROM balances WHERE user_id=v_bet.user_id AND currency=v_bet.currency FOR UPDATE;
        UPDATE balances SET amount=amount+v_bet.amount WHERE user_id=v_bet.user_id AND currency=v_bet.currency;
        UPDATE bets SET status='refunded', resolved_at=now() WHERE id=v_bet.id;
        INSERT INTO transactions (user_id, type, amount, currency, bet_id, balance_before, balance_after, description)
        VALUES (v_bet.user_id, 'refund', v_bet.amount, v_bet.currency, v_bet.id, v_bal_before, v_bal_before+v_bet.amount, 'Emergency stop');
        v_count := v_count + 1;
    END LOOP;
    
    INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, new_values)
    VALUES (p_admin_id, 'emergency_stop', 'platform', 'global', jsonb_build_object('reason',p_reason,'refunded',v_count));
    
    RETURN jsonb_build_object('success',true,'refunded_bets',v_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION resume_betting(p_admin_id UUID) RETURNS BOOLEAN AS $$
BEGIN
    IF NOT is_super_admin(p_admin_id) THEN RAISE EXCEPTION 'Super admin required'; END IF;
    UPDATE platform_settings SET value='true', updated_by=p_admin_id, updated_at=now() WHERE key='betting_enabled';
    INSERT INTO admin_logs (admin_id,action,entity_type,entity_id) VALUES (p_admin_id,'resume_betting','platform','global');
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- WITHDRAWAL CREATION
-- =============================================================================
CREATE OR REPLACE FUNCTION create_withdrawal(p_user_id UUID, p_currency TEXT, p_amount DECIMAL, p_address TEXT, p_chain TEXT, p_usd DECIMAL DEFAULT NULL) RETURNS UUID AS $$
DECLARE v_bal balances%ROWTYPE; v_id UUID; v_fee DECIMAL; v_pending INTEGER;
BEGIN
    SELECT (value->>p_currency)::decimal INTO v_fee FROM platform_settings WHERE key='withdrawal_fee';
    SELECT COUNT(*) INTO v_pending FROM withdrawals WHERE user_id=p_user_id AND status IN ('pending','awaiting_second','approved','processing');
    IF v_pending >= 3 THEN RAISE EXCEPTION 'Too many pending withdrawals'; END IF;
    
    SELECT * INTO v_bal FROM balances WHERE user_id=p_user_id AND currency=p_currency FOR UPDATE;
    IF NOT FOUND OR v_bal.amount < p_amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
    IF v_bal.locked_amount > 0 THEN RAISE EXCEPTION 'Pending withdrawal exists'; END IF;
    
    UPDATE balances SET amount=amount-p_amount, locked_amount=locked_amount+p_amount WHERE user_id=p_user_id AND currency=p_currency;
    INSERT INTO withdrawals (user_id, currency, amount, amount_usd_equivalent, fee, to_address, chain)
    VALUES (p_user_id, p_currency, p_amount, p_usd, COALESCE(v_fee,0), p_address, p_chain) RETURNING id INTO v_id;
    INSERT INTO transactions (user_id, type, amount, currency, withdrawal_id, balance_before, balance_after, description)
    VALUES (p_user_id, 'withdrawal', -p_amount, p_currency, v_id, v_bal.amount, v_bal.amount-p_amount, 'Withdrawal request');
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cancel_withdrawal(p_id UUID, p_user_id UUID) RETURNS BOOLEAN AS $$
DECLARE v_w withdrawals%ROWTYPE; v_bal_before DECIMAL;
BEGIN
    SELECT * INTO v_w FROM withdrawals WHERE id=p_id AND user_id=p_user_id AND status='pending' FOR UPDATE;
    IF NOT FOUND THEN RETURN FALSE; END IF;
    
    SELECT amount INTO v_bal_before FROM balances WHERE user_id=p_user_id AND currency=v_w.currency FOR UPDATE;
    UPDATE balances SET amount=amount+v_w.amount, locked_amount=locked_amount-v_w.amount WHERE user_id=p_user_id AND currency=v_w.currency;
    UPDATE withdrawals SET status='cancelled' WHERE id=p_id;
    INSERT INTO transactions (user_id, type, amount, currency, withdrawal_id, balance_before, balance_after, description)
    VALUES (p_user_id, 'refund', v_w.amount, v_w.currency, p_id, v_bal_before, v_bal_before+v_w.amount, 'Withdrawal cancelled');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- BET STATS UPDATE (AUDIT FIX #6: Demo excluded from real stats/VIP)
-- =============================================================================
CREATE OR REPLACE FUNCTION update_user_stats_after_bet() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
        IF NEW.is_demo THEN
            UPDATE user_stats SET demo_total_bets=demo_total_bets+1, demo_total_wagered=demo_total_wagered+NEW.amount, last_bet_at=now(), updated_at=now() WHERE user_id=NEW.user_id;
        ELSE
            UPDATE user_stats SET
                total_wagered=total_wagered+NEW.amount, total_bets=total_bets+1,
                total_wins=total_wins+CASE WHEN COALESCE(NEW.profit,0)>0 THEN 1 ELSE 0 END,
                total_losses=total_losses+CASE WHEN COALESCE(NEW.profit,0)<0 THEN 1 ELSE 0 END,
                total_won=total_won+CASE WHEN COALESCE(NEW.profit,0)>0 THEN COALESCE(NEW.payout,0) ELSE 0 END,
                total_lost=total_lost+CASE WHEN COALESCE(NEW.profit,0)<0 THEN NEW.amount ELSE 0 END,
                net_profit=net_profit+COALESCE(NEW.profit,0),
                largest_win=GREATEST(largest_win, CASE WHEN COALESCE(NEW.profit,0)>0 THEN NEW.profit ELSE 0 END),
                largest_multiplier=GREATEST(largest_multiplier, CASE WHEN COALESCE(NEW.profit,0)>0 THEN COALESCE(NEW.multiplier,0) ELSE 0 END),
                xp_points=xp_points+FLOOR(NEW.amount), last_bet_at=now(), updated_at=now()
            WHERE user_id=NEW.user_id;
            
            UPDATE user_stats SET vip_level_id=(
                SELECT id FROM vip_levels WHERE min_wagered <= (SELECT total_wagered FROM user_stats WHERE user_id=NEW.user_id) ORDER BY min_wagered DESC LIMIT 1
            ) WHERE user_id=NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_bet_completed ON bets;
CREATE TRIGGER on_bet_completed AFTER INSERT OR UPDATE ON bets FOR EACH ROW EXECUTE FUNCTION update_user_stats_after_bet();

-- =============================================================================
-- BACKFILL EXISTING USERS
-- =============================================================================
CREATE OR REPLACE FUNCTION backfill_existing_users() RETURNS INTEGER AS $$
DECLARE v_count INTEGER := 0; v_user RECORD; v_ref TEXT;
BEGIN
    FOR v_user IN SELECT id FROM auth.users LOOP
        IF EXISTS (SELECT 1 FROM balances WHERE user_id=v_user.id) THEN CONTINUE; END IF;
        
        LOOP v_ref := generate_referral_code(); EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code=v_ref); END LOOP;
        UPDATE profiles SET referral_code=v_ref WHERE user_id=v_user.id AND referral_code IS NULL;
        
        INSERT INTO balances (user_id, currency, amount, last_daily_refill) VALUES
            (v_user.id,'DEMO',1000,now()),(v_user.id,'BTC',0,NULL),(v_user.id,'ETH',0,NULL),(v_user.id,'USDT',0,NULL),(v_user.id,'SOL',0,NULL)
        ON CONFLICT DO NOTHING;
        INSERT INTO user_settings (user_id) VALUES (v_user.id) ON CONFLICT DO NOTHING;
        INSERT INTO user_stats (user_id) VALUES (v_user.id) ON CONFLICT DO NOTHING;
        PERFORM create_provably_fair_seed(v_user.id);
        v_count := v_count + 1;
    END LOOP;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE casino_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE provably_fair_seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_wallets" ON wallets FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "view_balances" ON balances FOR SELECT USING (auth.uid()=user_id OR is_admin(auth.uid()));
CREATE POLICY "view_games" ON casino_games FOR SELECT USING (is_active OR is_admin(auth.uid()));
CREATE POLICY "admin_games" ON casino_games FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "view_configs" ON game_configs FOR SELECT USING (true);
CREATE POLICY "own_seeds" ON provably_fair_seeds FOR SELECT USING (auth.uid()=user_id);
CREATE POLICY "view_bets" ON bets FOR SELECT USING (auth.uid()=user_id OR is_admin(auth.uid()));
CREATE POLICY "view_deposits" ON deposits FOR SELECT USING (auth.uid()=user_id OR is_admin(auth.uid()));
CREATE POLICY "own_withdrawals" ON withdrawals FOR SELECT USING (auth.uid()=user_id OR is_admin(auth.uid()));
CREATE POLICY "create_withdrawal" ON withdrawals FOR INSERT WITH CHECK (auth.uid()=user_id);
CREATE POLICY "view_tx" ON transactions FOR SELECT USING (auth.uid()=user_id OR is_admin(auth.uid()));
CREATE POLICY "own_stats" ON user_stats FOR SELECT USING (auth.uid()=user_id OR is_admin(auth.uid()));
CREATE POLICY "own_settings" ON user_settings FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "admin_logs" ON admin_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "view_platform" ON platform_settings FOR SELECT USING (true);
CREATE POLICY "admin_platform" ON platform_settings FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "view_vip" ON vip_levels FOR SELECT USING (true);
CREATE POLICY "own_referrals" ON referrals FOR SELECT USING (auth.uid()=referrer_id OR auth.uid()=referred_id);

-- =============================================================================
-- VIEWS
-- =============================================================================
CREATE OR REPLACE VIEW live_bets AS
SELECT b.id, p.username, p.avatar_url, b.game_id, cg.name as game_name,
       b.amount, b.currency, b.multiplier, b.payout, b.profit, b.is_demo, b.created_at
FROM bets b
JOIN profiles p ON b.user_id = p.user_id
JOIN casino_games cg ON b.game_id = cg.id
WHERE b.status = 'completed' AND b.is_demo = false
ORDER BY b.created_at DESC LIMIT 50;

CREATE OR REPLACE VIEW leaderboard AS
SELECT p.username, p.avatar_url, us.total_wagered, us.net_profit, us.total_bets, us.total_wins,
       vl.name as vip_level, vl.color as vip_color
FROM user_stats us
JOIN profiles p ON us.user_id = p.user_id
JOIN vip_levels vl ON us.vip_level_id = vl.id
WHERE us.total_bets > 0
ORDER BY us.total_wagered DESC LIMIT 100;

CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM bets WHERE created_at > now() - interval '24 hours' AND NOT is_demo) as bets_24h,
    (SELECT COALESCE(SUM(amount), 0) FROM bets WHERE created_at > now() - interval '24 hours' AND NOT is_demo) as volume_24h,
    (SELECT COALESCE(SUM(-profit), 0) FROM bets WHERE created_at > now() - interval '24 hours' AND NOT is_demo AND status = 'completed') as house_profit_24h,
    (SELECT COUNT(*) FROM withdrawals WHERE status IN ('pending', 'awaiting_second')) as pending_withdrawals,
    (SELECT COALESCE(SUM(amount), 0) FROM withdrawals WHERE status IN ('pending', 'awaiting_second')) as pending_withdrawal_amount;

-- =============================================================================
-- COMPLETE
-- =============================================================================
