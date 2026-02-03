
import React from 'react';
import { NavItem, InvestmentPlan, BlogPost, StatItem, Testimonial, DashboardPlan, InvestmentOrder, WithdrawalRecord } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Plans', path: '/plans' },
  { label: 'Learn', path: '/learn' },
  { label: 'Contact', path: '/contact' },
];

export const PLANS: InvestmentPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    minInvestment: '₹500 / month',
    risk: 'Low',
    suitableFor: 'Students & First-time Investors',
    features: [
      'Automated Monthly SIP',
      'Diversified Index Funds',
      'Easy Liquidity',
      'Basic Portfolio Tracker'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    minInvestment: '₹2,000 / month',
    risk: 'Moderate',
    suitableFor: 'Young Professionals',
    features: [
      'Mix of Equity & Debt',
      'Market-Beating Returns',
      'Tax-Saving (ELSS) Options',
      'Quarterly Expert Review'
    ]
  },
  {
    id: 'wealth',
    name: 'Wealth Plan',
    minInvestment: 'Custom Amount',
    risk: 'High',
    suitableFor: 'Long-term Wealth Builders',
    features: [
      'Concentrated Mid-cap Portfolio',
      'Direct Stock Opportunities',
      'Personal Wealth Manager',
      'Legacy Planning Advisory'
    ]
  }
];

export const DASHBOARD_PLANS: DashboardPlan[] = [
  {
    id: 'd1',
    productName: 'Nifty 50 Growth Fund',
    investAmount: 250,
    dailyReturn: 50,
    image: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'd2',
    productName: 'Bluechip Technology Fund',
    investAmount: 500,
    dailyReturn: 100,
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'd3',
    productName: 'Midcap Opportunities Fund',
    investAmount: 1000,
    dailyReturn: 200,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'd4',
    productName: 'Infrastructure Alpha Index',
    investAmount: 2000,
    dailyReturn: 410,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'd5',
    productName: 'Global Digital Assets Fund',
    investAmount: 5000,
    dailyReturn: 1050,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'd6',
    productName: 'NextGen FinTech Index',
    investAmount: 10000,
    dailyReturn: 2200,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    isLocked: true,
  },
];

export const ACTIVE_ORDERS: InvestmentOrder[] = [
  {
    id: 'ORD-7721',
    productName: 'Bluechip Technology Fund',
    productImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    investAmount: 500,
    dailyReturn: 100,
    totalReturn: 3000,
    duration: 30,
    currentDay: 10,
    // FIX: Added missing required property 'daysCollected'
    daysCollected: 10,
    status: 'Active',
    startDate: '2024-03-01'
  },
  {
    id: 'ORD-6542',
    productName: 'Nifty 50 Growth Fund',
    productImage: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=800',
    investAmount: 250,
    dailyReturn: 50,
    totalReturn: 1500,
    duration: 30,
    currentDay: 30,
    // FIX: Added missing required property 'daysCollected'
    daysCollected: 30,
    status: 'Completed',
    startDate: '2024-02-01'
  }
];

export const WITHDRAWAL_HISTORY: WithdrawalRecord[] = [
  {
    id: 'WTH-101',
    date: '2024-03-05',
    amount: 1500,
    method: 'Bank Transfer',
    status: 'Approved'
  },
  {
    id: 'WTH-102',
    date: '2024-03-10',
    amount: 500,
    method: 'UPI',
    status: 'Pending'
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'SIP vs Lumpsum: Which is better?',
    excerpt: 'Understand the power of Rupee Cost Averaging and how it helps beginners.',
    date: 'Oct 12, 2023',
    image: 'https://images.unsplash.com/photo-1579621973595-43068696b83d?auto=format&fit=crop&q=80&w=800',
    category: 'SIP'
  },
  {
    id: '2',
    title: 'The Magic of Compounding',
    excerpt: 'How starting early can turn ₹1,000 into a fortune over 30 years.',
    date: 'Oct 15, 2023',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    category: 'Education'
  },
  {
    id: '3',
    title: 'Common Stock Market Myths',
    excerpt: 'Busting the top 5 myths that stop Indians from investing in equity.',
    date: 'Oct 20, 2023',
    image: 'https://images.unsplash.com/photo-1611974717483-3600997e57ad?auto=format&fit=crop&q=80&w=800',
    category: 'Stocks'
  }
];

export const STATS: StatItem[] = [
  { value: '₹10Cr+', label: 'Assets Managed', icon: 'TrendingUp' },
  { value: '5,000+', label: 'Investors', icon: 'Users' },
  { value: '8+', label: 'Years Experience', icon: 'ShieldCheck' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'IT Professional, Bangalore',
    content: "InvestGrow made my SIP journey so simple. I started with ₹500 and now I'm managing a significant portfolio.",
    rating: 5
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Architect, Delhi',
    content: "The transparency and expert guidance provided by the team is unmatched. Highly recommended for beginners.",
    rating: 5
  },
  {
    id: '3',
    name: 'Ankit Mehta',
    role: 'Business Owner, Mumbai',
    content: "Trustworthy advice without aggressive sales. They really care about my long-term financial goals.",
    rating: 4
  }
];
