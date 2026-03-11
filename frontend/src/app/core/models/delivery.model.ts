export interface DeliveryRoute {
  id?: string;
  driverId: string;
  driverName: string;
  vehicleType: string;
  vehicleNumber: string;
  stops: DeliveryStop[];
  status: RouteStatus;
  scheduledDate: Date | string;
  startedAt?: Date | string;
  completedAt?: Date | string;
  totalDistance?: number;
  totalOrders?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export enum RouteStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface DeliveryStop {
  orderId: string;
  customerName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  sequenceNumber: number;
  status: StopStatus;
  estimatedArrival?: Date | string;
  actualArrival?: Date | string;
  notes?: string;
  signature?: string;
}

export enum StopStatus {
  PENDING = 'PENDING',
  EN_ROUTE = 'EN_ROUTE',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RESCHEDULED = 'RESCHEDULED'
}
