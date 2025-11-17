import express, { type Request, type Response } from "express";

// Initialize modules lazily to handle import errors
let storage: any = null;
let insertPedestalSchema: any = null;
let insertBookingSchema: any = null;
let insertServiceRequestSchema: any = null;

async function initializeModules() {
  if (storage !== null) return; // Already initialized
  
  try {
    const storageModule = await import("../server/storage");
    storage = storageModule.storage;
    const schemaModule = await import("../shared/schema");
    insertPedestalSchema = schemaModule.insertPedestalSchema;
    insertBookingSchema = schemaModule.insertBookingSchema;
    insertServiceRequestSchema = schemaModule.insertServiceRequestSchema;
    console.log("[API] Modules initialized successfully");
  } catch (error: any) {
    console.error("[API] CRITICAL: Failed to import modules:", error);
    console.error("[API] Error message:", error?.message);
    console.error("[API] Error stack:", error?.stack);
    
    // Create fallback storage to prevent complete failure
    storage = {
      getPedestals: async () => {
        console.error("[API] Using fallback storage - returning empty array");
        return [];
      },
      getPedestal: async () => undefined,
      updatePedestal: async () => undefined,
      createPedestal: async () => ({ id: "error", berthNumber: "ERROR" }),
      getBookings: async () => [],
      getBooking: async () => undefined,
      createBooking: async () => ({ id: "error" }),
      updateBooking: async () => undefined,
      getServiceRequests: async () => [],
      getServiceRequest: async () => undefined,
      createServiceRequest: async () => ({ id: "error" }),
      updateServiceRequest: async () => undefined,
    };
  }
}

// Initialize immediately
const initPromise = initializeModules();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all API routes (handle both /api/pedestals and /pedestals)
app.get("/api/pedestals", async (_req, res) => {
  try {
    await initPromise;
    if (!storage) {
      return res.status(500).json({ error: "Storage not initialized" });
    }
    const pedestals = await storage.getPedestals();
    res.json(pedestals || []);
  } catch (error: any) {
    console.error("[API] Error fetching pedestals:", error);
    console.error("[API] Error stack:", error?.stack);
    res.status(500).json({ 
      error: "Failed to fetch pedestals",
      message: error?.message || "Unknown error"
    });
  }
});

app.get("/api/pedestals/:id", async (req, res) => {
  try {
    await initPromise;
    const pedestal = await storage.getPedestal(req.params.id);
    if (!pedestal) {
      return res.status(404).json({ error: "Pedestal not found" });
    }
    res.json(pedestal);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pedestal" });
  }
});

app.patch("/api/pedestals/:id", async (req, res) => {
  try {
    await initPromise;
    const updated = await storage.updatePedestal(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Pedestal not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update pedestal" });
  }
});

app.post("/api/pedestals", async (req, res) => {
  try {
    await initPromise;
    const validatedData = insertPedestalSchema.parse(req.body);
    const pedestal = await storage.createPedestal(validatedData);
    res.status(201).json(pedestal);
  } catch (error) {
    res.status(400).json({ error: "Invalid pedestal data" });
  }
});

app.get("/api/bookings", async (_req, res) => {
  try {
    await initPromise;
    const bookings = await storage.getBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    await initPromise;
    const booking = await storage.getBooking(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    await initPromise;
    const validatedData = insertBookingSchema.parse(req.body);
    const booking = await storage.createBooking(validatedData);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Invalid booking data" });
  }
});

app.patch("/api/bookings/:id", async (req, res) => {
  try {
    await initPromise;
    const updated = await storage.updateBooking(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

app.get("/api/service-requests", async (_req, res) => {
  try {
    await initPromise;
    const requests = await storage.getServiceRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
});

app.get("/api/service-requests/:id", async (req, res) => {
  try {
    await initPromise;
    const request = await storage.getServiceRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Service request not found" });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch service request" });
  }
});

app.post("/api/service-requests", async (req, res) => {
  try {
    await initPromise;
    const validatedData = insertServiceRequestSchema.parse(req.body);
    const request = await storage.createServiceRequest(validatedData);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: "Invalid service request data" });
  }
});

app.patch("/api/service-requests/:id", async (req, res) => {
  try {
    await initPromise;
    const updated = await storage.updateServiceRequest(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Service request not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update service request" });
  }
});

// Add error handler middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[API] Unhandled error:", err);
  console.error("[API] Error stack:", err?.stack);
  if (!res.headersSent) {
    res.status(500).json({ 
      error: "Internal server error",
      message: err?.message || "Unknown error"
    });
  }
});

// Export the Express app as a serverless function
export default app;

