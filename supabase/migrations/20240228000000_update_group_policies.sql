-- Drop the existing policy that allows anyone to view active groups
DROP POLICY IF EXISTS "Anyone can view active groups" ON "public"."groups";

-- Create a new policy that only allows group members to view their groups
CREATE POLICY "Members can view their groups" ON "public"."groups"
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM group_members
    WHERE group_members.group_id = groups.id
    AND group_members.member_id = auth.uid()
  )
);