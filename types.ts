export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Basic' | 'Premium';
  status: 'Active' | 'Inactive' | 'Pending';
  dateJoined: string;
  tenantId: string; // Link user to a specific tenant
}

export interface Prize {
  id: string;
  tenantId: string; // Link prize to a specific tenant
  projectId?: string; // Optional: link to specific project
  name: string;
  type: 'Food Item' | 'Discount' | 'Merchandise' | 'Voucher';
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  password?: string; // For mock auth
  status: 'Active' | 'Trial' | 'Suspended';
  logo: string;
  primaryColor: string; // Main accent color
  secondaryColor?: string; // Secondary accent color
  backgroundColor?: string; // Background color
  textColor?: string; // Text color
}

export interface ContactRequest {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  requestType: string;
  status: string;
  estimatedCost?: number;
  estimatedTimeframe?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  slug?: string;
  status: string;
  isPaid: boolean;
  price?: number;
  startDate?: string;
  endDate?: string;
  spinLimit?: number;
  currentSpins: number;
  createdAt: string;
  updatedAt: string;
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface RecentActivity {
  id: string;
  type: 'signup' | 'redeem' | 'upgrade';
  title: string;
  time: string;
  icon: string;
  color: string;
}