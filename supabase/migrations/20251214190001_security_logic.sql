-- Security & Logic Improvements
-- Timestamp: 2025-12-14

-- 1. RATE LIMITING (via RLS)
-- Prevent users from inserting more than 5 contributions per minute to prevent spam scripts.
CREATE OR REPLACE FUNCTION check_contribution_rate_limit()
RETURNS BOOLEAN AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.contributions
  WHERE contributor_id = auth.uid()
  AND created_at > NOW() - INTERVAL '1 minute';

  IF recent_count >= 5 THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Policy to include rate limit check
DROP POLICY IF EXISTS "Members can add contributions" ON public.contributions;
CREATE POLICY "Members can add contributions" ON public.contributions FOR INSERT WITH CHECK (
  auth.uid() = contributor_id AND
  check_contribution_rate_limit()
);


-- 2. GAMIFICATION: STREAKS LOGIC
-- Calculate streak: Count of consecutive months with at least one contribution.
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  current_streak INTEGER := 0;
  last_contribution_date TIMESTAMP;
  month_diff INTEGER;
BEGIN
  -- Logic simplified: If user contributed last month, increment. If this month, ignore. Else reset.
  -- This is a complex calculation usually better done in application code or batch jobs, 
  -- but here is a simple implementation for the "Streaks" feature.
  
  -- Check existing streak for this group
  SELECT streak, last_contribution INTO current_streak, last_contribution_date
  FROM public.user_streaks
  WHERE user_id = NEW.contributor_id AND group_id = NEW.group_id;
  
  -- If no record, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, group_id, current_streak, last_contribution_date)
    VALUES (NEW.contributor_id, NEW.group_id, 1, NEW.created_at);
    RETURN NEW;
  END IF;

  -- Calculate months between last contribution and now
  -- Note: This is a robust way to check "Next Month"
  month_diff := (DATE_PART('year', NEW.created_at) - DATE_PART('year', last_contribution_date)) * 12 +
                (DATE_PART('month', NEW.created_at) - DATE_PART('month', last_contribution_date));

  IF month_diff = 0 THEN
    -- Same month, do nothing to streak, just update date
    UPDATE public.user_streaks 
    SET last_contribution_date = NEW.created_at 
    WHERE user_id = NEW.contributor_id AND group_id = NEW.group_id;
  ELSIF month_diff = 1 THEN
    -- Consecutive month! Increment streak
    UPDATE public.user_streaks 
    SET current_streak = current_streak + 1, last_contribution_date = NEW.created_at 
    WHERE user_id = NEW.contributor_id AND group_id = NEW.group_id;
  ELSE
    -- Missed a month (or more), reset to 1
    UPDATE public.user_streaks 
    SET current_streak = 1, last_contribution_date = NEW.created_at 
    WHERE user_id = NEW.contributor_id AND group_id = NEW.group_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run after contribution is confirmed
DROP TRIGGER IF EXISTS trigger_update_streak ON public.contributions;
CREATE TRIGGER trigger_update_streak
AFTER INSERT ON public.contributions
FOR EACH ROW
WHEN (NEW.status = 'confirmed')
EXECUTE FUNCTION update_user_streak();

