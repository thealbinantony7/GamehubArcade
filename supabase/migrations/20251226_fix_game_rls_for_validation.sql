-- Fix RLS policy to allow reading games for room validation
-- Users need to be able to check game type before joining a room

DROP POLICY IF EXISTS "Users can view their own games" ON public.games;

CREATE POLICY "Users can view games for validation"
ON public.games
FOR SELECT
TO authenticated
USING (
  -- Can view own games
  user_id = auth.uid() OR 
  -- Can view games they're participating in
  room_code IN (
    SELECT room_code FROM public.game_rooms 
    WHERE host_id = auth.uid()::text OR guest_id = auth.uid()::text
  ) OR
  -- Can view games from rooms that are waiting (for validation before joining)
  room_code IN (
    SELECT room_code FROM public.game_rooms 
    WHERE status = 'waiting'
  )
);
