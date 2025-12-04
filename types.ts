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
  plan: 'Starter' | 'Growth' | 'Enterprise';
  nextBillingDate: string;
  logo: string;
  primaryColor: string; // Main accent color
  secondaryColor?: string; // Secondary accent color
  backgroundColor?: string; // Background color
  textColor?: string; // Text color
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
  plan: string;
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