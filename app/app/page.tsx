import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Bot, Zap } from "@/components/icons";
import Link from "next/link";

export default function DashboardPage() {
  // In a real implementation, fetch this data from Prisma based on user session
  const recentConversions = [
    { id: "1", filename: "Quarterly_Report_2026.pdf", tool: "PDF to Word", status: "completed", date: "Today, 10:45 AM", size: "2.4 MB" },
    { id: "2", filename: "hero-image-raw.png", tool: "PNG to JPG", status: "completed", date: "Yesterday", size: "8.1 MB" },
    { id: "3", filename: "meeting_recording.mp4", tool: "MP4 to MP3", status: "failed", date: "Jul 25", size: "150 MB" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your recent activity and usage.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Conversions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 / 500</div>
            <p className="text-xs text-muted-foreground mt-1">
              Reset in 14 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 GB</div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-deletes after 1 hour
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Conversions</CardTitle>
              <CardDescription>Your latest converted files.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tools">New Conversion</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Tool</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentConversions.map((conv) => (
                  <TableRow key={conv.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{conv.filename}</span>
                        <span className="text-xs text-muted-foreground">{conv.size} • {conv.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>{conv.tool}</TableCell>
                    <TableCell>
                      {conv.status === "completed" ? (
                        <Badge variant="default" className="bg-success text-success-foreground hover:bg-success/90">Completed</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" disabled={conv.status !== "completed"}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>You are on the Free plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 border text-center">
              <div className="mb-2 text-sm font-medium">Upgrade to Pro</div>
              <p className="text-xs text-muted-foreground mb-4">
                Get unlimited conversions, 2GB file uploads, and 200 AI credits.
              </p>
              <Button className="w-full" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
