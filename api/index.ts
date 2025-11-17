import express from "express";

const app = express();
app.use(express.json());

// Simple in-memory storage for bookings
const bookings: any[] = [];

// Simple in-memory storage for pedestals
const pedestals = [
  { id: "1", berthNumber: "A-101", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 100 },
  { id: "2", berthNumber: "A-102", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 100 },
  { id: "3", berthNumber: "A-103", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 100 },
  { id: "4", berthNumber: "B-201", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 200 },
  { id: "5", berthNumber: "B-202", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 200 },
  { id: "6", berthNumber: "B-203", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 200 },
  { id: "7", berthNumber: "C-301", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 300 },
  { id: "8", berthNumber: "C-302", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 300 },
  { id: "9", berthNumber: "C-303", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 300 },
  { id: "10", berthNumber: "D-401", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 400 },
  { id: "11", berthNumber: "D-402", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 400 },
  { id: "12", berthNumber: "D-403", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 400 },
  { id: "13", berthNumber: "E-501", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 500 },
  { id: "14", berthNumber: "E-502", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 500 },
  { id: "15", berthNumber: "E-503", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 500 },
  { id: "16", berthNumber: "F-601", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 600 },
  { id: "17", berthNumber: "F-602", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 600 },
  { id: "18", berthNumber: "F-603", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 600 },
  { id: "19", berthNumber: "G-701", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 700 },
  { id: "20", berthNumber: "G-702", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 700 },
];

// GET /api/pedestals
app.get("/api/pedestals", (_req, res) => {
  res.json(pedestals);
});

// GET /api/pedestals/:id
app.get("/api/pedestals/:id", (req, res) => {
  const pedestal = pedestals.find(p => p.id === req.params.id);
  if (!pedestal) {
    return res.status(404).json({ error: "Pedestal not found" });
  }
  res.json(pedestal);
});

// PATCH /api/pedestals/:id
app.patch("/api/pedestals/:id", (req, res) => {
  const index = pedestals.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Pedestal not found" });
  }
  pedestals[index] = { ...pedestals[index], ...req.body };
  res.json(pedestals[index]);
});

// POST /api/pedestals
app.post("/api/pedestals", (req, res) => {
  const newPedestal = {
    id: String(pedestals.length + 1),
    ...req.body,
  };
  pedestals.push(newPedestal);
  res.status(201).json(newPedestal);
});

// GET /api/bookings
app.get("/api/bookings", (_req, res) => {
  res.json(bookings);
});

// GET /api/bookings/:id
app.get("/api/bookings/:id", (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json(booking);
});

// POST /api/bookings
app.post("/api/bookings", (req, res) => {
  const booking = {
    id: String(Date.now()),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  
  // Update pedestal status to occupied
  const pedestalIndex = pedestals.findIndex(p => p.id === req.body.pedestalId);
  if (pedestalIndex !== -1) {
    pedestals[pedestalIndex] = {
      ...pedestals[pedestalIndex],
      status: "occupied",
      currentUserId: req.body.userId || null,
    };
  }
  
  res.status(201).json(booking);
});

// PATCH /api/bookings/:id
app.patch("/api/bookings/:id", (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }
  bookings[index] = { ...bookings[index], ...req.body };
  res.json(bookings[index]);
});

// Simple in-memory storage for service requests
const serviceRequests: any[] = [];

// GET /api/service-requests
app.get("/api/service-requests", (_req, res) => {
  res.json(serviceRequests);
});

// GET /api/service-requests/:id
app.get("/api/service-requests/:id", (req, res) => {
  const request = serviceRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ error: "Service request not found" });
  }
  res.json(request);
});

// POST /api/service-requests
app.post("/api/service-requests", (req, res) => {
  const request = {
    id: String(Date.now()),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  serviceRequests.push(request);
  res.status(201).json(request);
});

// PATCH /api/service-requests/:id
app.patch("/api/service-requests/:id", (req, res) => {
  const index = serviceRequests.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Service request not found" });
  }
  serviceRequests[index] = { ...serviceRequests[index], ...req.body };
  res.json(serviceRequests[index]);
});

export default app;
