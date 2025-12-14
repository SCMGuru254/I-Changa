-- Notifications System
-- Timestamp: 2025-12-14

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    link TEXT, -- Optional action link (e.g. /group/123)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- System can insert (or users via triggers - tricky, usually server side)
-- For now, allow authenticated users to insert (e.g. inviting someone) 
-- But ideally this is done via Database Triggers.

-- Trigger: Notify when added to group
CREATE OR REPLACE FUNCTION notify_group_add()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
        NEW.member_id, 
        'Welcome to the Group!', 
        'You have been added to a new chama group.',
        'success',
        '/group/' || NEW.group_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_member_added
AFTER INSERT ON public.group_members
FOR EACH ROW EXECUTE FUNCTION notify_group_add();

-- Trigger: Notify on Contribution Approval (if status changes to confirmed)
-- (Skipping trigger for now to avoid complexity, but table is ready)
