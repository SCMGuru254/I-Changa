
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface ContributionsTableProps {
  contributions: any[];
}

export function ContributionsTable({ contributions }: ContributionsTableProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Recent Contributions</h3>
      {contributions && contributions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions?.map((contribution) => (
              <TableRow key={contribution.transaction_id}>
                <TableCell>{contribution.profiles?.full_name || 'Unknown'}</TableCell>
                <TableCell>KES {contribution.amount?.toLocaleString() || '0'}</TableCell>
                <TableCell>{contribution.transaction_id}</TableCell>
                <TableCell>
                  {contribution.created_at ? new Date(contribution.created_at).toLocaleDateString() : 'Unknown date'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-muted-foreground">No contributions yet</p>
      )}
    </Card>
  );
}
