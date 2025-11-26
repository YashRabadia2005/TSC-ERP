
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mockTransporters, mockVehicles, mockTrips } from "@/lib/logisticsMockData";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  transporter_id: z.string().min(1, "Transporter is required"),
  movement_type: z.enum(["inward", "outward"]),
  document_type: z.enum(["cane", "sugar", "molasses", "bagasse", "press_mud", "raw_material", "fuel", "chemicals", "other"]),
  linked_document_ref: z.string().min(1, "Reference document is required"),
});

export default function NewTrip() {
  const [_, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movement_type: "inward",
      document_type: "cane",
    },
  });

  // Auto-select transporter when vehicle is selected
  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      form.setValue("transporter_id", vehicle.transporter_id);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTrip = {
        id: `trip-${Date.now()}`,
        trip_no: `TRIP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        status: "gate_in" as const,
        gate_in_time: new Date().toISOString(),
        ...values,
      };
      
      // In a real app, we would post to backend. Here we just push to mock array for this session (it won't persist refresh)
      mockTrips.push(newTrip as any); 
      
      toast.success("Gate Entry Created", {
        description: `Trip ${newTrip.trip_no} started successfully.`,
      });
      
      setIsSubmitting(false);
      setLocation("/logistics");
    }, 1000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/logistics")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Gate Entry</h1>
          <p className="text-muted-foreground">Register a new vehicle entry at the gate.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
          <CardDescription>Enter vehicle and shipment information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicle_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle No</FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleVehicleChange(val);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockVehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>{v.vehicle_no} ({v.vehicle_type})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transporter_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transporter</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Transporter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockTransporters.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="movement_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movement Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Movement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="inward">Inward (Purchase/Return)</SelectItem>
                          <SelectItem value="outward">Outward (Sales/Dispatch)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cane">Sugar Cane</SelectItem>
                          <SelectItem value="sugar">Sugar</SelectItem>
                          <SelectItem value="molasses">Molasses</SelectItem>
                          <SelectItem value="bagasse">Bagasse</SelectItem>
                          <SelectItem value="press_mud">Press Mud</SelectItem>
                          <SelectItem value="raw_material">Raw Material</SelectItem>
                          <SelectItem value="fuel">Fuel</SelectItem>
                          <SelectItem value="chemicals">Chemicals</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="linked_document_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Document</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. PO-1234, SO-5678, Ticket-90" {...field} />
                    </FormControl>
                    <CardDescription>Purchase Order, Sales Order, or Cane Ticket No.</CardDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/logistics")}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Gate Entry"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
