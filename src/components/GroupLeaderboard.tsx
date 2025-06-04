import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

export function GroupLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    async function fetchLeaderboardData() {
      const { data, error } = await supabase
        .from('groups')
        .select('id, name, total_contributions, member_count')
        .order('total_contributions', { ascending: false });

      if (error) {
        console.error('Error fetching leaderboard data:', error);
      } else {
        setLeaderboardData(data);
      }
    }

    fetchLeaderboardData();
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Group Competition Leaderboard</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group Name</TableHead>
            <TableHead>Total Contributions</TableHead>
            <TableHead>Average Contribution per Member</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>KES {group.total_contributions?.toLocaleString()}</TableCell>
              <TableCell>
                KES {(group.total_contributions / group.member_count).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
