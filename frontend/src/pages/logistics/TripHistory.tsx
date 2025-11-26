
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTrips, mockVehicles, mockTransporters } from "@/lib/logisticsMockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Download, Search } from "lucide-react";
import { Link } from "wouter";

export default function TripHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredTrips = mockTrips.filter(trip => {
    const matchesSearch = 
        trip.trip_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mockVehicles.find(v => v.id === trip.vehicle_id)?.vehicle_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.linked_document_ref.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || trip.document_type === filterType;

    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ["Date", "Trip No", "Vehicle No", "Transporter", "Reference", "Material", "Movement", "Gross Weight", "Tare Weight", "Net Weight", "Status"];
    const rows = filteredTrips.map(trip => {
      const vehicle = mockVehicles.find(v => v.id === trip.vehicle_id);
      const transporter = mockTransporters.find(t => t.id === trip.transporter_id);
      return [
        format(new Date(trip.gate_in_time), 'yyyy-MM-dd HH:mm'),
        trip.trip_no,
        vehicle?.vehicle_no || "",
        transporter?.name || "",
        trip.linked_document_ref,
        trip.document_type,
        trip.movement_type,
        trip.gross_weight || "",
        trip.tare_weight || "",
        trip.net_weight || "",
        trip.status
      ].map(field => `"${field}"`).join(","); // Quote fields to handle commas in data
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `trips_export_${format(new Date(), "yyyyMMdd_HHmm")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Link href="/logistics">
                <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold">Trip History</h1>
                <p className="text-muted-foreground">Archives of all vehicle movements and weighments.</p>
            </div>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search trip no, vehicle..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Material" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Materials</SelectItem>
                        <SelectItem value="cane">Cane</SelectItem>
                        <SelectItem value="sugar">Sugar</SelectItem>
                        <SelectItem value="molasses">Molasses</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Trip No</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Gross</TableHead>
                        <TableHead className="text-right">Tare</TableHead>
                        <TableHead className="text-right">Net</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTrips.map(trip => {
                        const vehicle = mockVehicles.find(v => v.id === trip.vehicle_id);
                        return (
                            <TableRow key={trip.id}>
                                <TableCell className="font-medium">{format(new Date(trip.gate_in_time), 'dd MMM yyyy')}</TableCell>
                                <TableCell>{trip.trip_no}</TableCell>
                                <TableCell>{vehicle?.vehicle_no}</TableCell>
                                <TableCell>{trip.linked_document_ref}</TableCell>
                                <TableCell className="capitalize">{trip.document_type.replace('_', ' ')}</TableCell>
                                <TableCell className="text-right">{trip.gross_weight || '-'}</TableCell>
                                <TableCell className="text-right">{trip.tare_weight || '-'}</TableCell>
                                <TableCell className="text-right font-bold">{trip.net_weight || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{trip.status}</Badge>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
