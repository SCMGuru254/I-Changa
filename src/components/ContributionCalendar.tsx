import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function ContributionCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Dummy data for demonstration
  const contributionDates = [
    new Date(2024, 1, 15),
    new Date(2024, 1, 20),
    new Date(2024, 2, 5),
  ];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Contribution Schedule</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        modifiers={{
          contribution: contributionDates,
        }}
        modifiersStyles={{
          contribution: {
            fontWeight: 'bold',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            color: 'rgb(147, 51, 234)',
          }
        }}
      />
      <div className="mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-100"></div>
          <span>Contribution dates</span>
        </div>
      </div>
    </Card>
  );
}