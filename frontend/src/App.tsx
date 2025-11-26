import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/layout/MainLayout";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import HRMS from "@/pages/HRMS";
import Customers from "@/pages/Customers";
import Accounting from "@/pages/Accounting";
import LogisticsDashboard from "@/pages/logistics/LogisticsDashboard";
import NewTrip from "@/pages/logistics/NewTrip";
import Weighment from "@/pages/logistics/Weighment";
import TripHistory from "@/pages/logistics/TripHistory";

import Inventory from "@/pages/Inventory";
import Products from "@/pages/Products";
import Sales from "@/pages/Sales";
import UsersRoles from "@/pages/UsersRoles";
import MyAccount from "@/pages/MyAccount";

import CRM from "@/pages/CRM";
import PerformanceDashboard from "@/pages/PerformanceDashboard";

// Placeholder pages for other modules
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
      <span className="text-3xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    <p className="text-muted-foreground mt-2 max-w-md">
      This module is currently under development. Check back later for updates.
    </p>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Protected Routes wrapped in MainLayout */}
      <Route path="/">
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </Route>
      
      <Route path="/hrms">
        <MainLayout>
          <HRMS />
        </MainLayout>
      </Route>

      <Route path="/products">
        <MainLayout>
          <Products />
        </MainLayout>
      </Route>

      <Route path="/inventory">
        <MainLayout>
          <Inventory />
        </MainLayout>
      </Route>

      <Route path="/sales">
        <MainLayout>
          <Sales />
        </MainLayout>
      </Route>

      <Route path="/purchases">
        <MainLayout>
          <PlaceholderPage title="Purchases & Vendors" />
        </MainLayout>
      </Route>

      <Route path="/customers">
        <MainLayout>
          <CRM />
        </MainLayout>
      </Route>
      
      <Route path="/crm">
        <MainLayout>
          <CRM />
        </MainLayout>
      </Route>
      
      <Route path="/accounting">
        <MainLayout>
          <Accounting />
        </MainLayout>
      </Route>

      {/* Logistics Module Routes */}
      <Route path="/logistics">
        <MainLayout>
          <LogisticsDashboard />
        </MainLayout>
      </Route>
      
      <Route path="/logistics/new-trip">
        <MainLayout>
          <NewTrip />
        </MainLayout>
      </Route>

      <Route path="/logistics/weighment/:id">
        <MainLayout>
          <Weighment />
        </MainLayout>
      </Route>

      <Route path="/logistics/history">
        <MainLayout>
          <TripHistory />
        </MainLayout>
      </Route>

      <Route path="/settings">
        <MainLayout>
          <UsersRoles />
        </MainLayout>
      </Route>

      <Route path="/my-account">
        <MainLayout>
          <MyAccount />
        </MainLayout>
      </Route>

      <Route path="/performance">
        <MainLayout>
          <PerformanceDashboard />
        </MainLayout>
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
