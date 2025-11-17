import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Keypad, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Pedestal } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function PedestalAccess() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/pedestal/:code");
  const [code, setCode] = useState(params?.code || "");
  const [mode, setMode] = useState<"scan" | "enter">("scan");

  const { data: pedestals } = useQuery<Pedestal[]>({
    queryKey: ["/api/pedestals"],
  });

  const handleCodeSubmit = () => {
    if (!code.trim()) return;
    
    // Try to find pedestal by berth number or ID
    const pedestal = pedestals?.find(
      p => p.berthNumber.toLowerCase() === code.trim().toLowerCase() || 
           p.id === code.trim()
    );

    if (pedestal) {
      // Navigate to pedestals page with the selected pedestal
      setLocation(`/pedestals?pedestal=${pedestal.id}`);
    } else {
      alert(`Pedestal "${code}" not found. Please check the code and try again.`);
    }
  };

  const handleQRScan = () => {
    // In a real app, this would open the camera for QR scanning
    // For now, we'll show an alert and allow manual entry
    alert("QR Scanner would open here. For now, please use manual code entry.");
    setMode("enter");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/pedestals")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Access Pedestal</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Choose Access Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={mode === "scan" ? "default" : "outline"}
                className="h-24 flex-col gap-2"
                onClick={() => setMode("scan")}
              >
                <QrCode className="w-8 h-8" />
                <span>QR Scan</span>
              </Button>
              <Button
                variant={mode === "enter" ? "default" : "outline"}
                className="h-24 flex-col gap-2"
                onClick={() => setMode("enter")}
              >
                <Keypad className="w-8 h-8" />
                <span>Enter Code</span>
              </Button>
            </div>

            {mode === "scan" && (
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center space-y-2">
                    <QrCode className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Point camera at QR code
                    </p>
                  </div>
                </div>
                <Button onClick={handleQRScan} className="w-full">
                  Start QR Scanner
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setMode("enter")}
                  className="w-full"
                >
                  Or Enter Code Manually
                </Button>
              </div>
            )}

            {mode === "enter" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pedestal-code">Pedestal Code</Label>
                  <Input
                    id="pedestal-code"
                    placeholder="Enter berth number (e.g., A-101)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCodeSubmit();
                      }
                    }}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the berth number or pedestal ID
                  </p>
                </div>
                <Button
                  onClick={handleCodeSubmit}
                  className="w-full"
                  disabled={!code.trim()}
                >
                  Access Pedestal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {pedestals && pedestals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Available Pedestals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {pedestals.slice(0, 9).map((pedestal) => (
                  <Button
                    key={pedestal.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCode(pedestal.berthNumber);
                      handleCodeSubmit();
                    }}
                    className="text-xs"
                  >
                    {pedestal.berthNumber}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

