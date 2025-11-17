import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Droplets, Zap, MapPin } from "lucide-react";
import type { Pedestal } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import adBanner from "@assets/generated_images/Marina_equipment_ad_banner_d7c1fc9b.png";

const DEMO_PEDESTALS = [
  { berthNumber: "G-701", locationX: 100, locationY: 700 },
  { berthNumber: "G-702", locationX: 140, locationY: 700 },
  { berthNumber: "G-703", locationX: 180, locationY: 700 },
  { berthNumber: "H-801", locationX: 100, locationY: 820 },
  { berthNumber: "H-802", locationX: 140, locationY: 820 },
  { berthNumber: "H-803", locationX: 180, locationY: 820 },
  { berthNumber: "I-901", locationX: 100, locationY: 940 },
  { berthNumber: "I-902", locationX: 140, locationY: 940 },
  { berthNumber: "I-903", locationX: 180, locationY: 940 },
  { berthNumber: "J-1001", locationX: 120, locationY: 1020 },
] as const;

export default function Pedestals() {
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [newBerthNumber, setNewBerthNumber] = useState("");
  const [newLocationX, setNewLocationX] = useState("0");
  const [newLocationY, setNewLocationY] = useState("0");
  const { toast } = useToast();

  const { data: pedestals, isLoading } = useQuery<Pedestal[]>({
    queryKey: ["/api/pedestals"],
  });

  const updatePedestalMutation = useMutation({
    mutationFn: async (data: { id: string; waterEnabled?: boolean; electricityEnabled?: boolean }) => {
      const res = await apiRequest("PATCH", `/api/pedestals/${data.id}`, data);
      return (await res.json()) as Pedestal;
    },
    onSuccess: (updatedPedestal) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pedestals"] });
      setSelectedPedestal(updatedPedestal);
      toast({
        title: "Pedestal Updated",
        description: "Service settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update pedestal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createPedestalMutation = useMutation({
    mutationFn: async (data: { berthNumber: string; locationX: number; locationY: number }) => {
      const res = await apiRequest("POST", "/api/pedestals", {
        berthNumber: data.berthNumber,
        status: "available",
        waterEnabled: false,
        electricityEnabled: false,
        waterUsage: 0,
        electricityUsage: 0,
        currentUserId: null,
        locationX: data.locationX,
        locationY: data.locationY,
      });
      return (await res.json()) as Pedestal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pedestals"] });
      toast({
        title: "Pedestal Created",
        description: "New pedestal is now available for booking.",
      });
      setNewBerthNumber("");
      setNewLocationX("0");
      setNewLocationY("0");
      setCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error?.message || "Failed to create pedestal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generatePedestalsMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        DEMO_PEDESTALS.map(async (template) => {
          const res = await apiRequest("POST", "/api/pedestals", {
            berthNumber: template.berthNumber,
            status: "available",
            waterEnabled: false,
            electricityEnabled: false,
            waterUsage: 0,
            electricityUsage: 0,
            currentUserId: null,
            locationX: template.locationX,
            locationY: template.locationY,
          });
          await res.json();
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pedestals"] });
      toast({
        title: "Demo Pedestals Created",
        description: "10 available pedestals were added for testing.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error?.message || "Unable to create demo pedestals.",
        variant: "destructive",
      });
    },
  });

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "available":
        return "default";
      case "occupied":
        return "secondary";
      case "maintenance":
        return "outline";
      case "offline":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    if (!status || typeof status !== 'string') return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleCreatePedestal = () => {
    if (!newBerthNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a berth number.",
        variant: "destructive",
      });
      return;
    }

    createPedestalMutation.mutate({
      berthNumber: newBerthNumber.trim().toUpperCase(),
      locationX: Number(newLocationX) || 0,
      locationY: Number(newLocationY) || 0,
    });
  };

  const handleToggleService = (service: "water" | "electricity", enabled: boolean) => {
    if (!selectedPedestal) return;
    
    updatePedestalMutation.mutate({
      id: selectedPedestal.id,
      [service === "water" ? "waterEnabled" : "electricityEnabled"]: enabled,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-32" />
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-6 bg-muted animate-pulse rounded w-24" />
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold" data-testid="text-page-title">
              Smart Pedestals
            </h1>
            <Badge variant="outline" data-testid="badge-pedestal-count">
              {pedestals?.length || 0} Total
            </Badge>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Button
              variant="ghost"
              className="w-full md:w-auto"
              onClick={() => generatePedestalsMutation.mutate()}
              disabled={generatePedestalsMutation.isPending}
              data-testid="button-generate-demo"
            >
              {generatePedestalsMutation.isPending ? "Generating…" : "Generate 10 Available Pedestals"}
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full md:w-auto" data-testid="button-add-pedestal">
                  Add Pedestal
                </Button>
              </DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Pedestal</DialogTitle>
                <DialogDescription>
                  Create a new available pedestal with default services disabled.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input-berth-number">Berth Number</Label>
                  <Input
                    id="input-berth-number"
                    placeholder="e.g. G-701"
                    value={newBerthNumber}
                    onChange={(event) => setNewBerthNumber(event.target.value)}
                    data-testid="input-berth-number"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="input-location-x">Map Position X</Label>
                    <Input
                      id="input-location-x"
                      type="number"
                      value={newLocationX}
                      onChange={(event) => setNewLocationX(event.target.value)}
                      data-testid="input-location-x"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="input-location-y">Map Position Y</Label>
                    <Input
                      id="input-location-y"
                      type="number"
                      value={newLocationY}
                      onChange={(event) => setNewLocationY(event.target.value)}
                      data-testid="input-location-y"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)} data-testid="button-cancel-create">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePedestal}
                  disabled={createPedestalMutation.isPending}
                  data-testid="button-confirm-create"
                >
                  {createPedestalMutation.isPending ? "Creating..." : "Create Pedestal"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {!pedestals || pedestals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground" data-testid="text-empty-state">
                No pedestals available.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pedestals.map((pedestal, index) => (
            <div key={pedestal.id}>
              <Card 
                className="hover-elevate cursor-pointer"
                onClick={() => setSelectedPedestal(pedestal)}
                data-testid={`card-pedestal-${pedestal.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold" data-testid={`text-berth-${pedestal.id}`}>
                          Berth {pedestal.berthNumber}
                        </h3>
                        <Badge 
                          variant={getStatusVariant(pedestal.status)}
                          data-testid={`badge-status-${pedestal.id}`}
                        >
                          {getStatusLabel(pedestal.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-4 h-4" />
                          <span data-testid={`text-water-${pedestal.id}`}>
                            {pedestal.waterUsage}L
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          <span data-testid={`text-electricity-${pedestal.id}`}>
                            {pedestal.electricityUsage} kWh
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>Map Position</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid={`button-control-${pedestal.id}`}
                    >
                      Control
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {index === 4 && (
                <Card className="my-4" data-testid="card-advertisement-interstitial">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={adBanner} 
                        alt="Advertisement" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <span className="absolute top-1 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded">
                        Advertisement
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedPedestal} onOpenChange={() => setSelectedPedestal(null)}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-pedestal-control">
          <DialogHeader>
            <DialogTitle data-testid="text-dialog-title">
              Berth {selectedPedestal?.berthNumber} Control
            </DialogTitle>
          </DialogHeader>
          {selectedPedestal && (
            <div className="space-y-6">
              <div>
                <Badge variant={getStatusVariant(selectedPedestal.status)}>
                  {getStatusLabel(selectedPedestal.status)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Label htmlFor="water-toggle" className="text-base font-medium cursor-pointer">
                        Water Service
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedPedestal.waterUsage}L used
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="water-toggle"
                    checked={selectedPedestal.waterEnabled}
                    onCheckedChange={(checked) => handleToggleService("water", checked)}
                    disabled={updatePedestalMutation.isPending}
                    data-testid="switch-water-service"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <Label htmlFor="electricity-toggle" className="text-base font-medium cursor-pointer">
                        Electricity Service
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedPedestal.electricityUsage} kWh used
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="electricity-toggle"
                    checked={selectedPedestal.electricityEnabled}
                    onCheckedChange={(checked) => handleToggleService("electricity", checked)}
                    disabled={updatePedestalMutation.isPending}
                    data-testid="switch-electricity-service"
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current Session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Water Cost:</span>
                    <span className="font-medium">
                      ${(selectedPedestal.waterUsage * 0.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Electricity Cost:</span>
                    <span className="font-medium">
                      ${(selectedPedestal.electricityUsage * 0.15).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span data-testid="text-session-total">
                      ${((selectedPedestal.waterUsage * 0.05) + (selectedPedestal.electricityUsage * 0.15)).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
