
-- First, let's create the missing profile for the current user
-- Using a simpler approach to get the current user's data
INSERT INTO public.profiles (id, full_name)
SELECT auth.uid(), 'User'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
AND auth.uid() IS NOT NULL;

-- Create a trigger function to automatically create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that runs when a new user is inserted
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also add the foreign key constraint for groups to reference profiles (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'groups_creator_id_fkey'
  ) THEN
    ALTER TABLE public.groups 
    ADD CONSTRAINT groups_creator_id_fkey 
    FOREIGN KEY (creator_id) REFERENCES public.profiles(id);
  END IF;
END $$;
