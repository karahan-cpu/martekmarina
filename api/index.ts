import express from "express";

const app = express();
app.use(express.json());

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
  res.json([]);
});

// POST /api/bookings
app.post("/api/bookings", (req, res) => {
  const booking = {
    id: String(Date.now()),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(booking);
});

// GET /api/service-requests
app.get("/api/service-requests", (_req, res) => {
  res.json([]);
});

// POST /api/service-requests
app.post("/api/service-requests", (req, res) => {
  const request = {
    id: String(Date.now()),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(request);
});

export default app;
