-- 1. Create friendships table
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- 2. RLS for friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own friendships" ON public.friendships;
CREATE POLICY "Users can view their own friendships"
ON public.friendships FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can insert friend requests" ON public.friendships;
CREATE POLICY "Users can insert friend requests"
ON public.friendships FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own friendships" ON public.friendships;
CREATE POLICY "Users can update their own friendships"
ON public.friendships FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can delete their own friendships" ON public.friendships;
CREATE POLICY "Users can delete their own friendships"
ON public.friendships FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- 3. Fix update_profile_stats to use auth.uid() (Security Fix & Bug Fix)
-- Drop the old one first if signature is different (Postgres might complain if we change params)
DROP FUNCTION IF EXISTS public.update_profile_stats(UUID, TEXT);
DROP FUNCTION IF EXISTS public.update_profile_stats(TEXT);

CREATE OR REPLACE FUNCTION public.update_profile_stats(
  p_result TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    wins = CASE WHEN p_result = 'win' THEN wins + 1 ELSE wins END,
    losses = CASE WHEN p_result = 'loss' THEN losses + 1 ELSE losses END,
    draws = CASE WHEN p_result = 'draw' THEN draws + 1 ELSE draws END,
    games_played = games_played + 1,
    updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;
