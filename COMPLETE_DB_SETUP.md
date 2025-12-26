# 🔧 Complete Database Setup - Run This in Supabase SQL Editor

Go to Supabase Dashboard → SQL Editor → New Query, then copy and paste this ENTIRE script:

```sql
-- ============================================
-- COMPLETE DATABASE SETUP FOR GAMEHUB ARCADE
-- ============================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create high_scores table
CREATE TABLE IF NOT EXISTS public.high_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  username TEXT NOT NULL,
  game_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on all tables
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.high_scores ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view games for validation" ON public.games;
DROP POLICY IF EXISTS "Authenticated users can create games" ON public.games;
DROP POLICY IF EXISTS "Participants can update their games" ON public.games;
DROP POLICY IF EXISTS "Users can view available or own rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Participants can update their rooms" ON public.game_rooms;
DROP POLICY IF EXISTS "Host can delete their room" ON public.game_rooms;

-- 5. Create RLS policies for games (WITH FIX FOR VALIDATION)
CREATE POLICY "Users can view games for validation"
ON public.games
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR 
  room_code IN (
    SELECT room_code FROM public.game_rooms 
    WHERE host_id = auth.uid()::text OR guest_id = auth.uid()::text
  ) OR
  room_code IN (
    SELECT room_code FROM public.game_rooms 
    WHERE status = 'waiting'
  )
);

CREATE POLICY "Authenticated users can create games"
ON public.games
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Participants can update their games"
ON public.games
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() OR
  room_code IN (
    SELECT room_code FROM public.game_rooms 
    WHERE host_id = auth.uid()::text OR guest_id = auth.uid()::text
  )
);

-- 6. Create RLS policies for game_rooms
CREATE POLICY "Users can view available or own rooms"
ON public.game_rooms
FOR SELECT
TO authenticated
USING (
  status = 'waiting' OR 
  host_id = auth.uid()::text OR 
  guest_id = auth.uid()::text
);

CREATE POLICY "Authenticated users can create rooms"
ON public.game_rooms
FOR INSERT
TO authenticated
WITH CHECK (host_id = auth.uid()::text);

CREATE POLICY "Participants can update their rooms"
ON public.game_rooms
FOR UPDATE
TO authenticated
USING (host_id = auth.uid()::text OR guest_id = auth.uid()::text);

CREATE POLICY "Host can delete their room"
ON public.game_rooms
FOR DELETE
TO authenticated
USING (host_id = auth.uid()::text);

-- 7. Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- 8. Create RLS policies for high_scores
CREATE POLICY "High scores are viewable by everyone" 
ON public.high_scores FOR SELECT USING (true);

CREATE POLICY "Anyone can submit scores" 
ON public.high_scores FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own scores" 
ON public.high_scores FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own scores" 
ON public.high_scores FOR DELETE 
USING (user_id = auth.uid());

-- 9. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$;

-- 10. Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Create function to update profile stats
CREATE OR REPLACE FUNCTION public.update_profile_stats(
  p_user_id UUID,
  p_result TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    wins = CASE WHEN p_result = 'win' THEN wins + 1 ELSE wins END,
    losses = CASE WHEN p_result = 'loss' THEN losses + 1 ELSE losses END,
    draws = CASE WHEN p_result = 'draw' THEN draws + 1 ELSE draws END,
    games_played = games_played + 1,
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;
```

**After running this, your multiplayer will work!** ✅
