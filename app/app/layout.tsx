import Link from "next/link";
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  CreditCard,
  LogOut,
  FolderOpen
} from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Link href="/" className="text-xl font-bold tracking-tight">Iconvert</Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Button variant="secondary" className="justify-start gap-3 w-full" asChild>
            <Link href="/app">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 w-full text-muted-foreground" asChild>
            <Link href="/app/files">
              <FolderOpen size={18} />
              My Files
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 w-full text-muted-foreground" asChild>
            <Link href="/app/history">
              <History size={18} />
              History
            </Link>
          </Button>
          
          <div className="mt-8 mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </div>
          
          <Button variant="ghost" className="justify-start gap-3 w-full text-muted-foreground" asChild>
            <Link href="/app/billing">
              <CreditCard size={18} />
              Billing & Plan
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 w-full text-muted-foreground" asChild>
            <Link href="/app/settings">
              <Settings size={18} />
              Settings
            </Link>
          </Button>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2 py-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary">US</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">User Name</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 mt-2">
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b bg-background flex items-center justify-between px-6 md:hidden">
          <Link href="/" className="font-bold tracking-tight">Iconvert</Link>
          <Button variant="ghost" size="icon">
            <Avatar className="h-8 w-8">
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </Button>
        </header>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
