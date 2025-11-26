
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTrips, mockVehicles, WeighbridgeTrip } from "@/lib/logisticsMockData";
import { toast } from "sonner";
import { ArrowLeft, Scale, Truck, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Weighment() {
  const [_, params] = useRoute("/logistics/weighment/:id");
  const [__, setLocation] = useLocation();
  const [trip, setTrip] = useState<WeighbridgeTrip | null>(null);
  const [weightInput, setWeightInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const foundTrip = mockTrips.find(t => t.id === params.id);
      if (foundTrip) {
        setTrip(foundTrip);
      } else {
        toast.error("Trip not found");
        setLocation("/logistics");
      }
    }
  }, [params?.id, setLocation]);

  if (!trip) return <div>Loading...</div>;

  const vehicle = mockVehicles.find(v => v.id === trip.vehicle_id);

  const isFirstWeighment = trip.status === "gate_in";
  const isSecondWeighment = trip.status === "yard" || trip.status === "weigh_in_1"; // Simplified flow: yard -> weigh_in_2
  // In real scenario, status usually goes gate_in -> weigh_in_1 -> yard -> weigh_in_2 -> gate_out
  // Let's assume if status is gate_in, we do Weigh-In 1.
  // If status is weigh_in_1 or yard, we do Weigh-In 2.
  
  const currentStep = trip.status === "gate_in" ? 1 : 2;
  
  // Calculate potential net weight if this is step 2
  const simulatedNetWeight = currentStep === 2 && weightInput && trip.status !== "gate_out" 
    ? Math.abs(parseFloat(weightInput) - (currentStep === 2 && trip.status !== "gate_in" ? (trip.movement_type === 'inward' ? trip.gross_weight! : trip.tare_weight!) : 0))
    : 0;

  const handleWeighment = () => {
    if (!weightInput || isNaN(parseFloat(weightInput))) {
      toast.error("Please enter a valid weight");
      return;
    }

    setIsSubmitting(true);
    const weight = parseFloat(weightInput);

    setTimeout(() => {
      // In mock, we mutate the object directly for simplicity. In React/Redux we'd dispatch action.
      if (currentStep === 1) {
        // First Weighment
        if (trip.movement_type === 'inward') {
          trip.gross_weight = weight; // Inward: Loaded first (Gross)
        } else {
          trip.tare_weight = weight; // Outward: Empty first (Tare)
        }
        trip.status = "weigh_in_1";
        trip.weigh_in_time = new Date().toISOString();
        
        // Auto-move to yard/ready for next step for demo purposes
        // In real life, it stays in yard until ready for second weighment
        trip.status = "yard"; 
        
        toast.success("First Weighment Recorded", {
          description: `Weight: ${weight} MT recorded. Vehicle moved to Yard.`
        });
      } else {
        // Second Weighment
        if (trip.movement_type === 'inward') {
          trip.tare_weight = weight; // Inward: Empty second (Tare)
          trip.net_weight = trip.gross_weight! - weight;
        } else {
          trip.gross_weight = weight; // Outward: Loaded second (Gross)
          trip.net_weight = weight - trip.tare_weight!;
        }
        trip.status = "weigh_in_2";
        trip.weigh_out_time = new Date().toISOString();

        toast.success("Second Weighment Recorded", {
            description: `Net Weight: ${trip.net_weight?.toFixed(2)} MT calculated.`
        });
      }

      setIsSubmitting(false);
      setTrip({...trip}); // Trigger re-render
    }, 800);
  };

  const handleGateOut = () => {
      setIsSubmitting(true);
      setTimeout(() => {
          trip.status = "gate_out";
          trip.gate_out_time = new Date().toISOString();
          toast.success("Trip Completed", { description: "Vehicle gated out successfully." });
          setLocation("/logistics");
      }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/logistics")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Weighbridge Operation</h1>
          <p className="text-muted-foreground">Trip #{trip.trip_no} • {trip.movement_type === 'inward' ? 'Inbound' : 'Outbound'}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Vehicle Info */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Vehicle Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="text-xs text-muted-foreground uppercase font-bold">Vehicle No</span>
                        <div className="flex items-center gap-2 mt-1">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-lg font-medium">{vehicle?.vehicle_no}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground uppercase font-bold">Transporter</span>
                        <p className="mt-1">{mockVehicles.find(v => v.id === trip.vehicle_id)?.owner_name}</p>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground uppercase font-bold">Document Ref</span>
                         <div className="flex items-center gap-2 mt-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{trip.linked_document_ref}</span>
                        </div>
                    </div>
                     <div>
                        <span className="text-xs text-muted-foreground uppercase font-bold">Material</span>
                        <Badge variant="outline" className="mt-1">{trip.document_type}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="relative pl-4 border-l-2 border-muted space-y-6 ml-2">
                    <div className="relative">
                         <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500" />
                         <p className="text-sm font-medium">Gate In</p>
                         <p className="text-xs text-muted-foreground">{format(new Date(trip.gate_in_time), 'dd MMM HH:mm')}</p>
                    </div>
                    {trip.weigh_in_time && (
                         <div className="relative">
                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500" />
                            <p className="text-sm font-medium">First Weighment</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(trip.weigh_in_time), 'dd MMM HH:mm')}</p>
                        </div>
                    )}
                    {trip.weigh_out_time && (
                         <div className="relative">
                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500" />
                            <p className="text-sm font-medium">Second Weighment</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(trip.weigh_out_time), 'dd MMM HH:mm')}</p>
                        </div>
                    )}
                     {trip.gate_out_time && (
                         <div className="relative">
                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500" />
                            <p className="text-sm font-medium">Gate Out</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(trip.gate_out_time), 'dd MMM HH:mm')}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Weighing Interface */}
        <div className="md:col-span-2 space-y-6">
            {/* Weighing Cards */}
            <div className="grid grid-cols-2 gap-4">
                 <Card className={trip.gross_weight ? "bg-muted/50" : "border-dashed"}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Gross Weight (Loaded)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{trip.gross_weight ? `${trip.gross_weight} MT` : "--"}</div>
                    </CardContent>
                 </Card>
                 <Card className={trip.tare_weight ? "bg-muted/50" : "border-dashed"}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tare Weight (Empty)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{trip.tare_weight ? `${trip.tare_weight} MT` : "--"}</div>
                    </CardContent>
                 </Card>
            </div>

            {/* Net Weight Display */}
             <Card className="bg-slate-900 text-white border-none">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Net Weight</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-mono font-bold tracking-tighter">
                        {trip.net_weight ? trip.net_weight.toFixed(2) : "0.00"} <span className="text-2xl text-slate-500">MT</span>
                    </div>
                </CardContent>
             </Card>

             {/* Action Area */}
             {trip.status !== 'gate_out' && (
                <Card className="border-2 border-primary/20">
                    <CardHeader>
                        <CardTitle>
                            {currentStep === 1 ? "Record First Weighment" : 
                             trip.status === 'weigh_in_2' ? "Finalize & Gate Out" : "Record Second Weighment"}
                        </CardTitle>
                        <CardDescription>
                             {currentStep === 1 ? "Vehicle is at the bridge. Capture weight." :
                              trip.status === 'weigh_in_2' ? "Weighing complete. Issue gate pass." : "Vehicle returned to bridge."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {trip.status !== 'weigh_in_2' && (
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input 
                                        type="number" 
                                        placeholder="Enter reading from scale (MT)..." 
                                        className="text-lg h-12"
                                        value={weightInput}
                                        onChange={(e) => setWeightInput(e.target.value)}
                                    />
                                </div>
                                <Button size="lg" onClick={handleWeighment} disabled={isSubmitting} className="h-12 px-8">
                                    <Scale className="mr-2 h-4 w-4" />
                                    Capture Weight
                                </Button>
                            </div>
                        )}
                        
                        {trip.status === 'weigh_in_2' && (
                             <Button size="lg" onClick={handleGateOut} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                                <Truck className="mr-2 h-4 w-4" />
                                Complete Trip & Gate Out
                            </Button>
                        )}
                    </CardContent>
                </Card>
             )}
        </div>
      </div>
    </div>
  );
}
