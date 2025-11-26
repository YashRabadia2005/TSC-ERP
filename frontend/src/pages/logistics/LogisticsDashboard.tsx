
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Truck, Scale, ArrowRightLeft, Clock, FileText } from "lucide-react";
import { Link } from "wouter";
import { mockTrips, mockVehicles, mockTransporters, WeighbridgeTrip } from "@/lib/logisticsMockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export default function LogisticsDashboard() {
  const [trips, setTrips] = useState<WeighbridgeTrip[]>(mockTrips);
  
  // Derived stats
  const activeTrips = trips.filter(t => t.status !== "gate_out" && t.status !== "cancelled");
  const gateInCount = trips.filter(t => t.status === "gate_in").length;
  const weighingCount = trips.filter(t => t.status.startsWith("weigh_in")).length;
  const completedToday = trips.filter(t => t.status === "gate_out" && new Date(t.gate_out_time!).toDateString() === new Date().toDateString()).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "gate_in": return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">At Gate</Badge>;
      case "weigh_in_1": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Weigh-In 1</Badge>;
      case "yard": return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">In Yard</Badge>;
      case "weigh_in_2": return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">Weigh-In 2</Badge>;
      case "gate_out": return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weighbridge & Logistics</h1>
          <p className="text-muted-foreground">Manage vehicle movements, weighments, and gate operations.</p>
        </div>
        <Link href="/logistics/new-trip">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Gate Entry
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles On Site</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrips.length}</div>
            <p className="text-xs text-muted-foreground">Currently inside premises</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Weighment</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weighingCount}</div>
            <p className="text-xs text-muted-foreground">Waiting at bridge</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Trips</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">Total movements today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnaround</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45m</div>
            <p className="text-xs text-muted-foreground">Gate-In to Gate-Out</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Active Vehicles List */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Active Vehicles</CardTitle>
            <CardDescription>Vehicles currently processing through the facility</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {activeTrips.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <Truck className="h-8 w-8 mb-2 opacity-50" />
                    <p>No vehicles currently on site</p>
                  </div>
                ) : (
                  activeTrips.map((trip) => {
                    const vehicle = mockVehicles.find(v => v.id === trip.vehicle_id);
                    const transporter = mockTransporters.find(t => t.id === trip.transporter_id);
                    
                    return (
                      <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{trip.vehicle_id && vehicle?.vehicle_no}</span>
                            <Badge variant="outline" className="uppercase text-[10px]">{trip.document_type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transporter?.name} • {trip.movement_type === 'inward' ? 'Inbound' : 'Outbound'}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Gate In: {format(new Date(trip.gate_in_time), 'HH:mm')}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(trip.status)}
                          <Link href={`/logistics/weighment/${trip.id}`}>
                            <Button size="sm" variant="outline">Process</Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent History */}
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/logistics/new-trip">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  New Gate Entry
                </Button>
              </Link>
              <Link href="/logistics/history">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Trip History
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Completions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trips.filter(t => t.status === "gate_out").slice(0, 3).map(trip => {
                   const vehicle = mockVehicles.find(v => v.id === trip.vehicle_id);
                   return (
                    <div key={trip.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{vehicle?.vehicle_no}</p>
                        <p className="text-xs text-muted-foreground">Net: {trip.net_weight} MT</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-muted-foreground">{format(new Date(trip.gate_out_time!), 'HH:mm')}</p>
                      </div>
                    </div>
                   );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
