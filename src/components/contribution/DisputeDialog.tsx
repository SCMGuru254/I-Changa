
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

interface DisputeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    contributionId: string;
    currentAmount: number;
}

export function DisputeDialog({
    isOpen,
    onClose,
    contributionId,
    currentAmount,
}: DisputeDialogProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [reason, setReason] = useState("");

    const submitDispute = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from("contributions")
                .update({
                    status: "disputed",
                    notes: `Disputed: ${reason}`, // In a real app, create a separate 'disputes' table
                })
                .eq("id", contributionId);

            if (error) throw error;
        },
        onSuccess: () => {
            toast({
                title: "Dispute Submitted",
                description: "The contribution has been flagged for admin review.",
            });
            queryClient.invalidateQueries({ queryKey: ["groupContributions"] });
            onClose();
            setReason("");
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Dispute Contribution
                    </DialogTitle>
                    <DialogDescription>
                        Flag this contribution of <strong>{currentAmount}</strong> as incorrect.
                        Admins will be notified.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for dispute</Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g., I did not make this payment, Amount is wrong..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => submitDispute.mutate()}
                        disabled={!reason.trim() || submitDispute.isPending}
                    >
                        {submitDispute.isPending ? "Submitting..." : "Submit Dispute"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
