
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Target, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export function InsightsDashboard() {
  const monthlyData = [
    { month: 'Jan', contributions: 45000, members: 12 },
    { month: 'Feb', contributions: 52000, members: 15 },
    { month: 'Mar', contributions: 48000, members: 18 },
    { month: 'Apr', contributions: 61000, members: 20 },
    { month: 'May', contributions: 55000, members: 22 },
    { month: 'Jun', contributions: 67000, members: 25 },
  ];

  const groupPerformance = [
    { name: 'Family Savings', amount: 125000, progress: 83 },
    { name: 'Office Chama', amount: 89000, progress: 67 },
    { name: 'Emergency Fund', amount: 45000, progress: 45 },
    { name: 'Investment Club', amount: 78000, progress: 92 },
  ];

  const contributionTypes = [
    { name: 'Monthly Regular', value: 65, color: '#3b82f6' },
    { name: 'One-time', value: 25, color: '#10b981' },
    { name: 'Emergency', value: 10, color: '#f59e0b' },
  ];

  const insights = [
    {
      title: 'Average Monthly Growth',
      value: '+12.3%',
      icon: TrendingUp,
      color: 'text-green-600',
      description: 'Contribution growth over last 6 months'
    },
    {
      title: 'Active Members',
      value: '25',
      icon: Users,
      color: 'text-blue-600',
      description: 'Total contributing members'
    },
    {
      title: 'Goals Achieved',
      value: '3/5',
      icon: Target,
      color: 'text-purple-600',
      description: 'Groups that reached their targets'
    },
    {
      title: 'Avg. Days to Goal',
      value: '45',
      icon: Calendar,
      color: 'text-orange-600',
      description: 'Average time to reach group goals'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </p>
                <p className={`text-2xl font-bold ${insight.color}`}>
                  {insight.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </div>
              <insight.icon className={`h-8 w-8 ${insight.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Contribution Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="contributions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Contributions (KES)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Group Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#10b981" name="Amount (KES)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contribution Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contributionTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {contributionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
