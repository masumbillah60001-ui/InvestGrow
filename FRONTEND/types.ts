
export interface NavItem {
  label: string;
  path: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minInvestment: string;
  risk: 'Low' | 'Moderate' | 'High';
  suitableFor: string;
  features: string[];
}

export interface DashboardPlan {
  id: string;
  productName: string;
  investAmount: number;
  dailyReturn: number;
  image: string;
  isLocked?: boolean;
}

export interface InvestmentOrder {
  id: string;
  productName: string;
  productImage: string;
  investAmount: number;
  dailyReturn: number;
  totalReturn: number;
  duration: number;
  currentDay: number;
  daysCollected: number;
  lastCollectedDate?: string | null;
  status: 'Active' | 'Completed' | 'Pending';
  startDate: string;
  activationTime?: number;
  lastCollectionTimestamp?: number;
}

export interface WithdrawalRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}
