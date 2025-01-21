import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Contribution } from "@/types";

// Dummy data for demonstration
const dummyContributions: Contribution[] = [
  {
    id: "1",
    amount: 1000,
    contributorName: "John Doe",
    phoneNumber: "+254712345678",
    date: "2024-02-20",
    transactionId: "QWE123456",
    groupId: "1",
  },
  {
    id: "2",
    amount: 2000,
    contributorName: "Jane Smith",
    phoneNumber: "+254723456789",
    date: "2024-02-19",
    transactionId: "ASD789012",
    groupId: "1",
  },
];

export function ContributionsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contributions] = useState<Contribution[]>(dummyContributions);

  const filteredContributions = contributions.filter(
    (contribution) =>
      contribution.contributorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contribution.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or transaction ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <div className="space-y-4">
        {filteredContributions.map((contribution) => (
          <Card key={contribution.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{contribution.contributorName}</h3>
                <p className="text-sm text-gray-500">{contribution.phoneNumber}</p>
                <p className="text-sm text-gray-500">
                  Transaction ID: {contribution.transactionId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-secondary">
                  KES {contribution.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(contribution.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}