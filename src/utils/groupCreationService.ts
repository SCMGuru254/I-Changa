
import { supabase } from "@/integrations/supabase/client";
import { GroupFormData } from "@/types/GroupFormData";

export async function verifyUserProfile(userId: string) {
  const { data: profile, error: profileCheckError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();
    
  if (profileCheckError) {
    console.error("Profile check error:", profileCheckError);
    throw new Error("Unable to verify user profile. Please refresh the page and try again.");
  }
  
  console.log("Profile verified:", profile);
  return profile;
}

export async function createGroup(formData: GroupFormData, userId: string) {
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: formData.name,
      description: formData.description,
      target_amount: formData.targetAmount,
      end_date: formData.endDate.toISOString(),
      creator_id: userId,
      status: "active",
    })
    .select('id')
    .single();
  
  if (groupError) {
    console.error("Group creation error:", groupError);
    throw groupError;
  }
  
  console.log("Group created successfully:", group);
  return group;
}

export async function addUserAsAdmin(groupId: string, userId: string) {
  const { error: memberError } = await supabase
    .from("group_members")
    .insert({
      group_id: groupId,
      member_id: userId,
      role: "admin",
    });
  
  if (memberError) {
    console.error("Member insertion error:", memberError);
    throw memberError;
  }
  
  console.log("User added as admin member");
}
