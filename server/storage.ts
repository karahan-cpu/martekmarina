import { 
  type User, 
  type InsertUser,
  type Pedestal,
  type InsertPedestal,
  type Booking,
  type InsertBooking,
  type ServiceRequest,
  type InsertServiceRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getPedestals(): Promise<Pedestal[]>;
  getPedestal(id: string): Promise<Pedestal | undefined>;
  createPedestal(pedestal: InsertPedestal): Promise<Pedestal>;
  updatePedestal(id: string, pedestal: Partial<InsertPedestal>): Promise<Pedestal | undefined>;

  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined>;

  getServiceRequests(): Promise<ServiceRequest[]>;
  getServiceRequest(id: string): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: string, request: Partial<InsertServiceRequest>): Promise<ServiceRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pedestals: Map<string, Pedestal>;
  private bookings: Map<string, Booking>;
  private serviceRequests: Map<string, ServiceRequest>;

  constructor() {
    this.users = new Map();
    this.pedestals = new Map();
    this.bookings = new Map();
    this.serviceRequests = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const samplePedestals: InsertPedestal[] = [
      { berthNumber: "A-101", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 100 },
      { berthNumber: "A-102", status: "occupied", waterEnabled: true, electricityEnabled: true, waterUsage: 245, electricityUsage: 12, currentUserId: "demo-user-id", locationX: 150, locationY: 100 },
      { berthNumber: "A-103", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 100 },
      { berthNumber: "B-201", status: "occupied", waterEnabled: true, electricityEnabled: false, waterUsage: 180, electricityUsage: 0, currentUserId: "demo-user-id", locationX: 100, locationY: 200 },
      { berthNumber: "B-202", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 200 },
      { berthNumber: "B-203", status: "maintenance", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 200 },
      { berthNumber: "C-301", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 300 },
      { berthNumber: "C-302", status: "offline", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 150, locationY: 300 },
      { berthNumber: "C-303", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 200, locationY: 300 },
      { berthNumber: "D-401", status: "available", waterEnabled: false, electricityEnabled: false, waterUsage: 0, electricityUsage: 0, currentUserId: null, locationX: 100, locationY: 400 },
    ];

    samplePedestals.forEach((p) => {
      const id = randomUUID();
      this.pedestals.set(id, { ...p, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPedestals(): Promise<Pedestal[]> {
    return Array.from(this.pedestals.values());
  }

  async getPedestal(id: string): Promise<Pedestal | undefined> {
    return this.pedestals.get(id);
  }

  async createPedestal(insertPedestal: InsertPedestal): Promise<Pedestal> {
    const id = randomUUID();
    const pedestal: Pedestal = { ...insertPedestal, id };
    this.pedestals.set(id, pedestal);
    return pedestal;
  }

  async updatePedestal(id: string, update: Partial<InsertPedestal>): Promise<Pedestal | undefined> {
    const pedestal = this.pedestals.get(id);
    if (!pedestal) return undefined;

    const updated = { ...pedestal, ...update };
    this.pedestals.set(id, updated);
    return updated;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, update: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updated = { ...booking, ...update };
    this.bookings.set(id, updated);
    return updated;
  }

  async getServiceRequests(): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values());
  }

  async getServiceRequest(id: string): Promise<ServiceRequest | undefined> {
    return this.serviceRequests.get(id);
  }

  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const id = randomUUID();
    const request: ServiceRequest = { 
      ...insertRequest, 
      id,
      createdAt: new Date(),
    };
    this.serviceRequests.set(id, request);
    return request;
  }

  async updateServiceRequest(id: string, update: Partial<InsertServiceRequest>): Promise<ServiceRequest | undefined> {
    const request = this.serviceRequests.get(id);
    if (!request) return undefined;

    const updated = { ...request, ...update };
    this.serviceRequests.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
