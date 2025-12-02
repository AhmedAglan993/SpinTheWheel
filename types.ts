export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Basic' | 'Premium';
  status: 'Active' | 'Inactive' | 'Pending';
  dateJoined: string;
}

export interface Prize {
  id: string;
  name: string;
  type: 'Food Item' | 'Discount' | 'Merchandise' | 'Voucher';
  description: string;
  status: 'Active' | 'Inactive';
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
