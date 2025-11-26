import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/store";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Briefcase, 
  Settings, 
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Box,
  Truck,
  FileText,
  UserPlus,
  TrendingUp,
  LogIn,
  LogOutIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [location] = useLocation();
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    {
      title: "Core Modules",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/", permission: "dashboard_view" },
        { name: "HRMS & Payroll", icon: Users, path: "/hrms", permission: "hrms_view" },
        { name: "Products & Items", icon: Box, path: "/products", permission: "products_view" },
        { name: "Inventory", icon: Package, path: "/inventory", permission: "inventory_view" },
        { name: "Sales & Invoices", icon: ShoppingCart, path: "/sales", permission: "sales_view" },
        { name: "Purchases & Vendors", icon: CreditCard, path: "/purchases", permission: "purchases_view" },
        { name: "CRM & Clients", icon: UserPlus, path: "/crm", permission: "customers_view" },
      ]
    },
    {
      title: "Optional Modules",
      items: [
        { name: "Accounting", icon: FileText, path: "/accounting", permission: "accounting_view" },
        { name: "Logistics", icon: Truck, path: "/logistics", permission: "logistics_view" },
        { name: "Performance Dashboard", icon: TrendingUp, path: "/performance", permission: "dashboard_view" },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Users & Roles", icon: Settings, path: "/settings", permission: "system_view" },
      ]
    }
  ];

  return (
    <div className={`flex h-full flex-col border-r bg-sidebar text-sidebar-foreground ${className}`}>
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <img 
          src="https://tassosconsultancy.com/wp-content/uploads/2025/11/TCS-LOGO-TRACED-PNG.webp" 
          alt="Tassos ERP" 
          className="h-8 w-auto object-contain brightness-0 invert" 
        />
        <span className="ml-3 font-semibold text-lg hidden lg:block">ERP System</span>
      </div>
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="flex flex-col gap-4">
          {menuItems.map((group, index) => {
            // Filter items based on permission
            const visibleItems = group.items.filter(item => hasPermission(item.permission) || user?.role === "Admin");
            
            if (visibleItems.length === 0) return null;

            return (
              <div key={index} className="flex flex-col gap-2">
                <h3 className="px-2 text-xs font-medium uppercase text-sidebar-foreground/50 tracking-wider">
                  {group.title}
                </h3>
                <div className="flex flex-col gap-1">
                  {visibleItems.map((item) => {
                    const isActive = location === item.path;
                    return (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={`w-full justify-start gap-3 ${
                            isActive 
                              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="truncate">{item.name}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3 text-sidebar-accent-foreground">
          <Avatar className="h-9 w-9 rounded-md border border-sidebar-border">
            <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">{user?.name || "Guest"}</span>
            <span className="truncate text-xs text-sidebar-foreground/70">{user?.email || "Not logged in"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, logout, checkIn, checkOut, attendance } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const handleCheckIn = () => {
    checkIn();
    toast({
      title: "Check-in Successful",
      description: "You have been checked in successfully",
    });
  };

  const handleCheckOut = () => {
    checkOut();
    toast({
      title: "Check-out Successful",
      description: "You have been checked out successfully",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const empId = user ? `EMP${String(user.id).padStart(3, "0")}` : "";
  const todayRecord = attendance.find(a => a.employeeId === empId && a.date === today);
  const isCheckedIn = todayRecord?.checkIn;
  const isCheckedOut = todayRecord?.checkOut;

  return (
    <div className="flex w-full bg-background">
      <div className="hidden w-64 lg:block h-screen sticky top-0">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col min-h-screen">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-sidebar-border bg-sidebar text-sidebar-foreground">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <img 
              src="https://tassosconsultancy.com/wp-content/uploads/2025/11/TCS-LOGO-TRACED-PNG.webp" 
              alt="Tassos ERP" 
              className="h-6 w-auto" 
            />
          </div>
          
          <div className="flex flex-1 items-center gap-4 px-4 md:px-8">
            <div className="relative w-full max-w-sm hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search modules, records..."
                className="w-full rounded-lg bg-muted pl-9 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            {user?.role !== "Admin" && (
              <>
                <Button 
                  size="sm" 
                  variant={isCheckedIn && !isCheckedOut ? "default" : "outline"}
                  onClick={handleCheckIn}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  {isCheckedIn && !isCheckedOut ? "Checked In" : "Check In"}
                </Button>
                <Button 
                  size="sm"
                  variant={isCheckedOut ? "secondary" : "outline"}
                  onClick={handleCheckOut}
                  disabled={!isCheckedIn}
                  className="gap-2"
                >
                  <LogOutIcon className="h-4 w-4" />
                  {isCheckedOut ? "Checked Out" : "Check Out"}
                </Button>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start text-sm md:flex">
                    <span className="font-medium">{user?.name || "Guest"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/my-account")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/my-account")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 bg-muted/30 p-6">
          {children}
        </main>
        <footer className="border-t bg-background px-6 py-4 text-center text-xs text-muted-foreground mt-auto">
          <p>Tassos Consultancy Services | Govt IT Solutions | Ahmedabad</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Tassos Consultancy Services. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
