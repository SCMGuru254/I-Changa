import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Placeholder logic for fetching audit logs
    const fetchLogs = async () => {
      const mockLogs = [
        { id: 1, action: 'Contribution Approved', user: 'Admin', timestamp: new Date().toLocaleString() },
        { id: 2, action: 'Contribution Rejected', user: 'Admin', timestamp: new Date().toLocaleString() },
      ];
      setLogs(mockLogs);
    };

    fetchLogs();
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Audit Logs</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
