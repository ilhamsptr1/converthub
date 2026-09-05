import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, FileDown, DollarSign } from "@/components/icons";

export default function AdminDashboardPage() {
  const recentUsers = [
    { id: "1", email: "john@example.com", plan: "Pro", joined: "Today" },
    { id: "2", email: "sarah@company.com", plan: "Business", joined: "Yesterday" },
    { id: "3", email: "mike@gmail.com", plan: "Free", joined: "Jul 25" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
        <p className="text-slate-500 mt-1">Platform metrics and system health monitoring.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12,450</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              +180 this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Conversions</CardTitle>
            <FileDown className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1.2M</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              +45,000 this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$24,500</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">System Health</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">99.99%</div>
            <p className="text-xs text-slate-500 mt-1">
              All services operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-slate-700">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.plan === "Free" ? "secondary" : "default"}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">{user.joined}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Worker Queue Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Active Jobs</span>
                <span className="text-sm font-bold text-slate-900">42</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-slate-700">Pending Jobs</span>
                <span className="text-sm font-bold text-slate-900">12</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-slate-700">Failed Jobs (24h)</span>
                <span className="text-sm font-bold text-red-600">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
