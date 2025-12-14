
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function PaymentMethods() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newType, setNewType] = useState<"mpesa" | "bank">("mpesa");
    const [detail, setDetail] = useState("");

    const { data: methods, isLoading } = useQuery({
        queryKey: ["paymentMethods", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("payment_methods")
                .select("*")
                .eq("user_id", user.id);
            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

    const addMethod = useMutation({
        mutationFn: async () => {
            if (!user) return;
            const { error } = await supabase.from("payment_methods").insert({
                user_id: user.id,
                payment_type: newType,
                // Store in phone_number or account_number based on type
                phone_number: newType === "mpesa" ? detail : null,
                account_number: newType === "bank" ? detail : null,
                is_default: (methods?.length || 0) === 0, // First one is default
            });
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Payment method added." });
            queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
            setIsAdding(false);
            setDetail("");
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        },
    });

    const deleteMethod = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("payment_methods").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Payment method removed." });
            queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
        },
    });

    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Saved Payment Methods
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? "Cancel" : <><Plus className="h-4 w-4 mr-1" /> Add New</>}
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {isAdding && (
                    <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                                    <SelectItem value="bank">Bank Account</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{newType === "mpesa" ? "Phone Number" : "Account Number"}</Label>
                            <Input
                                value={detail}
                                onChange={(e) => setDetail(e.target.value)}
                                placeholder={newType === "mpesa" ? "07..." : "Account Number"}
                            />
                        </div>
                        <Button
                            onClick={() => addMethod.mutate()}
                            disabled={!detail || addMethod.isPending}
                        >
                            {addMethod.isPending ? "Saving..." : "Save Method"}
                        </Button>
                    </div>
                )}

                <div className="space-y-2">
                    {methods?.length === 0 && !isAdding && (
                        <p className="text-muted-foreground text-sm">No saved payment methods.</p>
                    )}
                    {methods?.map((method: any) => (
                        <div key={method.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full text-primary font-bold text-xs uppercase">
                                    {method.payment_type}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {method.payment_type === 'mpesa' ? 'M-Pesa' : 'Bank Account'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {method.payment_type === 'mpesa' ? method.phone_number : method.account_number}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => deleteMethod.mutate(method.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
