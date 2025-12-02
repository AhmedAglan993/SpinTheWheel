import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Prize, Tenant, Invoice } from '../types';

interface DataContextType {
  // Global Data
  tenants: Tenant[];
  
  // Auth State
  currentTenant: Tenant | null;
  login: (email: string) => boolean;
  logout: () => void;
  register: (tenant: Tenant) => void;
  updateTenantSettings: (id: string, updates: Partial<Tenant>) => void;

  // Tenant Specific Data getters
  getTenantPrizes: (tenantId: string) => Prize[];
  getTenantUsers: (tenantId: string) => User[];
  
  // Actions
  addPrize: (prize: Prize) => void;
  deletePrize: (id: string) => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  invoices: Invoice[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock Initial Data
const initialTenants: Tenant[] = [
  { id: 'demo', name: 'The Grand Eatery', ownerName: 'John Doe', email: 'demo@example.com', status: 'Active', plan: 'Growth', nextBillingDate: 'Oct 24, 2023', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFdq24kBzGT70B2mU4hnGiMLSSS_7-bOVcC0XCUz7JUlscw6Znhe1JgRqeAmpApyE41WV-78xKOju3C0OGwpzvTfSEVT-DEZ6zuAoi4BnaUQuIRC_UYEyz0uyueOHe1HH5eKSTInthr7QJAOpbTWbt8iHATRu3bRk9N3N3wVXxX_7_LMqLO2aGdFfK3knW7ZUhUAfb0g9nCRQxIulNWBSduu57hQiclDYePyxhRc4eoN5wcfiEjE1cFo2uzaLFBMlPzzGw3Bz4Vso', primaryColor: '#2bbdee' },
];

const initialPrizes: Prize[] = [
  { id: '1', tenantId: 'demo', name: 'Free Appetizer', type: 'Food Item', description: 'Any appetizer up to $10 value', status: 'Active' },
  { id: '2', tenantId: 'demo', name: '15% Off Total', type: 'Discount', description: 'Valid on orders over $50', status: 'Active' },
  { id: '3', tenantId: 'demo', name: 'Free Drink', type: 'Food Item', description: 'Soft drink or iced tea', status: 'Active' },
  { id: '4', tenantId: 'demo', name: '$5 Voucher', type: 'Voucher', description: 'For next visit', status: 'Active' },
];

const initialUsers: User[] = [
  { id: '1', tenantId: 'demo', name: 'Eleanor Pena', email: 'eleanor.p@example.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtnCHce-ubLphotiHHzNBj0H7xPkfLTErc7Sn9LY5WFsDklBE5x3x4tyA9Eb5sUNzbA5t4B5BCf2ZJSUnPCiTQm9L2Qp5k2jyolET2irZFXEV4jK22cZe6bR1VLqGl3epR0Jbgm78wdygZjhA8G1QYNmBYFGEqdlfT-2K6AWJqNwgdbxhDDBBOowD2Q2-B4QgmISKRuvKAF_Yd8K2OMJSSGz9IUHEcDUtrZPee28fkqaZKijBxZPcIOvVWrE_VQGfyHqkkOEfK7Vo', plan: 'Basic', status: 'Active', dateJoined: '2023-05-12' },
];

const initialInvoices: Invoice[] = [
  { id: 'INV-001', date: 'Oct 01, 2023', amount: '$49.00', status: 'Paid', plan: 'Growth Plan' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [prizes, setPrizes] = useState<Prize[]>(initialPrizes);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  // Auth Functions
  const login = (email: string) => {
    const tenant = tenants.find(t => t.email === email);
    if (tenant) {
      setCurrentTenant(tenant);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentTenant(null);

  const register = (tenant: Tenant) => {
    setTenants([...tenants, tenant]);
    setCurrentTenant(tenant);
  };

  const updateTenantSettings = (id: string, updates: Partial<Tenant>) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, ...updates } : t));
    if (currentTenant?.id === id) {
      setCurrentTenant({ ...currentTenant, ...updates });
    }
  };

  // Data Accessors
  const getTenantPrizes = (tenantId: string) => prizes.filter(p => p.tenantId === tenantId);
  const getTenantUsers = (tenantId: string) => users.filter(u => u.tenantId === tenantId);

  // Actions
  const addPrize = (prize: Prize) => setPrizes([...prizes, prize]);
  const deletePrize = (id: string) => setPrizes(prizes.filter(p => p.id !== id));
  
  const addUser = (user: User) => setUsers([...users, user]);
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  return (
    <DataContext.Provider value={{ 
      tenants, currentTenant, login, logout, register, updateTenantSettings,
      getTenantPrizes, getTenantUsers,
      addPrize, deletePrize, addUser, deleteUser,
      invoices: initialInvoices
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};