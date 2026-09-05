import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  Settings, 
  Server,
  LogOut,
  ShieldAlert
} from "@/components/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-50 border-r border-slate-800 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <ShieldAlert className="text-red-500" />
          <span className="text-xl font-bold tracking-tight">AdminPanel</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Button variant="secondary" className="justify-start gap-3 w-full bg-slate-800 text-slate-50 hover:bg-slate-700" asChild>
            <Link href="/admin">
              <BarChart3 size={18} />
              Overview
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 w-full text-slate-400 hover:text-slate-50 hover:bg-slate-800" asChild>
            <Link href="/admin/users">
              <Users size={18} />
              Users
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 w-full text-slate-400 hover:text-slate-50 hover:bg-slate-800" asChild>
            <Link href="/admin/system">
              <Server size={18} />
              System Health
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3 w-full text-slate-400 hover:text-slate-50 hover:bg-slate-800" asChild>
            <Link href="/admin/settings">
              <Settings size={18} />
              Settings
            </Link>
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3">
            <Avatar>
              <AvatarFallback className="bg-red-500/20 text-red-500">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Super Admin</p>
              <p className="text-xs text-slate-500 truncate">System Access</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 mt-2">
            <LogOut size={18} />
            Exit Admin
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
            <ShieldAlert className="text-red-500" size={20} />
            AdminPanel
          </div>
          <Button variant="ghost" size="icon">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AD</AvatarFallback>
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
