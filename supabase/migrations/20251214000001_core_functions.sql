-- Core Database Functions and Triggers
-- Timestamp: 2025-12-14 00:00:01

-- 1. Handle New User (Auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', NEW.phone)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Update Group Total Contributions
CREATE OR REPLACE FUNCTION public.update_group_total()
RETURNS trigger AS $$
BEGIN
    UPDATE public.groups
    SET total_contributions = (
        SELECT COALESCE(SUM(amount), 0)
        FROM public.contributions
        WHERE group_id = NEW.group_id AND status = 'confirmed'
    )
    WHERE id = NEW.group_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_contribution_added ON public.contributions;
CREATE TRIGGER on_contribution_added
  AFTER INSERT OR UPDATE OR DELETE ON public.contributions
  FOR EACH ROW EXECUTE FUNCTION public.update_group_total();

-- 3. Get Group Statistics (JSON)
CREATE OR REPLACE FUNCTION public.get_group_statistics(group_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_contributions', total_contributions,
        'member_count', (SELECT COUNT(*) FROM public.group_members WHERE group_members.group_id = groups.id),
        'target_amount', target_amount,
        'progress_percentage', CASE WHEN target_amount > 0 THEN (total_contributions / target_amount) * 100 ELSE 0 END
    ) INTO result
    FROM public.groups
    WHERE id = group_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
