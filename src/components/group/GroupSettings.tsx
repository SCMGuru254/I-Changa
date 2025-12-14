
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Shield, ShieldCheck } from "lucide-react";

interface GroupSettingsProps {
    groupId: string;
    isOwner: boolean;
}

export function GroupSettings({ groupId, isOwner }: GroupSettingsProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [targetAmount, setTargetAmount] = useState("");

    // 1. Fetch Group Details
    const { data: group, isLoading: isGroupLoading } = useQuery({
        queryKey: ["group", groupId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("groups")
                .select("*")
                .eq("id", groupId)
                .single();
            if (error) throw error;
            return data;
        },
    });

    // 2. Fetch Members for Management
    const { data: members, isLoading: isMembersLoading } = useQuery({
        queryKey: ["group-residents", groupId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("group_members")
                .select(`
          id,
          role,
          user_id,
          profiles:member_id (
            id,
            full_name,
            email: id, 
            phone_number
          )
        `)
                .eq("group_id", groupId);
            if (error) throw error;
            return data;
        },
    });

    // Update Group Mutation
    const updateGroup = useMutation({
        mutationFn: async (details: any) => {
            const { error } = await supabase
                .from("groups")
                .update(details)
                .eq("id", groupId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Group details updated." });
            queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        },
        onError: (error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    // Update Member Role Mutation
    const updateMemberRole = useMutation({
        mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
            const { error } = await supabase
                .from("group_members")
                .update({ role })
                .eq("id", memberId); // memberId is the row ID in group_members
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Member role updated." });
            queryClient.invalidateQueries({ queryKey: ["group-residents", groupId] });
        },
    });

    // Remove Member Mutation
    const removeMember = useMutation({
        mutationFn: async (memberId: string) => {
            const { error } = await supabase
                .from("group_members")
                .delete()
                .eq("id", memberId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Member removed from group." });
            queryClient.invalidateQueries({ queryKey: ["group-residents", groupId] });
        },
    });

    if (isGroupLoading || isMembersLoading) {
        return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
    }

    // Pre-fill form
    if (group && name === "") {
        setName(group.name);
        setDescription(group.description || "");
        setTargetAmount(group.target_amount?.toString() || "");
    }

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Group Administration</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="details">Edit Details</TabsTrigger>
                        <TabsTrigger value="members">Manage Members</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Group Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Target Amount (KES)</Label>
                            <Input
                                type="number"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() =>
                                updateGroup.mutate({
                                    name,
                                    description,
                                    target_amount: parseFloat(targetAmount),
                                })
                            }
                            disabled={updateGroup.isPending}
                        >
                            {updateGroup.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </TabsContent>

                    <TabsContent value="members">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Current Role</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members?.map((member: any) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="font-medium">{member.profiles?.full_name || "Unknown"}</div>
                                            <div className="text-sm text-muted-foreground">{member.profiles?.phone_number}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={member.role}
                                                onValueChange={(val) =>
                                                    updateMemberRole.mutate({ memberId: member.id, role: val })
                                                }
                                                disabled={!isOwner && member.role === 'admin'} // Only owners can demote admins
                                            >
                                                <SelectTrigger className="w-[140px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="member">Member</SelectItem>
                                                    <SelectItem value="treasurer">Treasurer</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to remove this member?")) {
                                                        removeMember.mutate(member.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
