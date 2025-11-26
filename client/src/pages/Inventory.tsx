import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Warehouse, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Sugar Factory Inventory Data
const inventoryData = [
  { id: "INV-001", item: "White Sugar S-30", location: "Godown A", stock: 15000, unit: "Quintal", capacity: 20000, status: "Good" },
  { id: "INV-002", item: "White Sugar M-30", location: "Godown B", stock: 8500, unit: "Quintal", capacity: 15000, status: "Good" },
  { id: "INV-003", item: "Brown Sugar", location: "Godown C", stock: 2000, unit: "Quintal", capacity: 5000, status: "Low Stock" },
  { id: "INV-004", item: "Molasses", location: "Steel Tank 1", stock: 450, unit: "MT", capacity: 500, status: "Near Full" },
  { id: "INV-005", item: "Ethanol", location: "Storage Tank E1", stock: 12000, unit: "Liters", capacity: 50000, status: "Good" },
  { id: "INV-006", item: "Bagasse", location: "Open Yard 1", stock: 5000, unit: "MT", capacity: 10000, status: "Good" },
  { id: "INV-007", item: "Sulphur", location: "Chemical Store", stock: 150, unit: "Bags", capacity: 500, status: "Reorder" },
];

const recentMovements = [
  { id: "MOV-101", date: "2025-11-26", type: "Inward", item: "Sugarcane", quantity: "50 MT", source: "Gate 1", reference: "TRIP-8892" },
  { id: "MOV-102", date: "2025-11-26", type: "Production", item: "White Sugar S-30", quantity: "500 Quintal", source: "Plant", reference: "BATCH-2025-45" },
  { id: "MOV-103", date: "2025-11-25", type: "Outward", item: "Molasses", quantity: "20 MT", source: "Tank 1", reference: "SO-9921" },
  { id: "MOV-104", date: "2025-11-25", type: "Outward", item: "White Sugar M-30", quantity: "200 Quintal", source: "Godown B", reference: "SO-9918" },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = inventoryData.filter(
    (item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track stock levels across Godowns, Tanks, and Yards.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">
            Stock Adjustment
          </Button>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" /> Inward Entry
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sugar Stock</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25,500 Qtl</div>
            <p className="text-xs text-muted-foreground">
              Across 3 Godowns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Molasses Stock</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450 MT</div>
            <p className="text-xs text-muted-foreground">
              90% Capacity Used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,400 Qtl</div>
            <p className="text-xs text-muted-foreground">
              +5% vs yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Dispatches</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 Orders</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Current Stock Levels</CardTitle>
              <CardDescription>
                Real-time inventory status across all storage locations
              </CardDescription>
              <div className="flex items-center py-2">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{item.stock.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{item.unit}</span></div>
                      </TableCell>
                      <TableCell>
                        <div className="w-full max-w-[100px]">
                           <Progress value={(item.stock / item.capacity) * 100} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge 
                            variant="outline" 
                            className={
                                item.status === "Good" ? "bg-green-50 text-green-700 border-green-200" :
                                item.status === "Near Full" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                "bg-red-50 text-red-700 border-red-200"
                            }
                         >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Movements</CardTitle>
              <CardDescription>Latest stock in/out logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentMovements.map((move) => (
                  <div key={move.id} className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${move.type === 'Inward' || move.type === 'Production' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {move.type === 'Inward' || move.type === 'Production' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {move.type}: {move.item}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {move.quantity} • {move.source}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ref: {move.reference} • {move.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
