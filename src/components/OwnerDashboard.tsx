import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function OwnerDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalGroups: 0,
    totalUsers: 0,
    monthlyRevenue: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total contributions
        const { data: contributions, error: contribError } = await supabase
          .from('contributions')
          .select('amount, created_at');
        
        if (contribError) throw contribError;

        // Calculate total revenue (assuming 1% fee)
        const totalRevenue = contributions?.reduce((sum, c) => sum + (Number(c.amount) * 0.01), 0) || 0;

        // Get monthly revenue data
        const monthlyData = contributions?.reduce((acc: any[], c) => {
          const month = new Date(c.created_at).toLocaleString('default', { month: 'short' });
          const existing = acc.find(item => item.month === month);
          const revenue = Number(c.amount) * 0.01;

          if (existing) {
            existing.revenue += revenue;
          } else {
            acc.push({ month, revenue });
          }
          return acc;
        }, []) || [];

        // Fetch total groups
        const { count: groupCount, error: groupError } = await supabase
          .from('groups')
          .select('*', { count: 'exact' });

        if (groupError) throw groupError;

        // Fetch total users
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });

        if (userError) throw userError;

        setStats({
          totalRevenue,
          totalGroups: groupCount || 0,
          totalUsers: userCount || 0,
          monthlyRevenue: monthlyData,
        });
      } catch (error: any) {
        toast({
          title: "Error fetching stats",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchStats();
  }, [toast]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Owner Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">KES {stats.totalRevenue.toLocaleString()}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Groups</h3>
          <p className="text-2xl font-bold">{stats.totalGroups}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </Card>
      </div>

      <div className="h-[300px]">
        <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}