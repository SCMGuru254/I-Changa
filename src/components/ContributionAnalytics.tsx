import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

export function ContributionAnalytics() {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    async function fetchAnalyticsData() {
      const { data, error } = await supabase
        .from('contributions')
        .select('created_at, amount')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching analytics data:', error);
      } else {
        const formattedData = data.map((item) => ({
          date: new Date(item.created_at).toLocaleDateString(),
          amount: item.amount,
        }));
        setAnalyticsData(formattedData);
      }
    }

    fetchAnalyticsData();
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Contribution Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analyticsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
