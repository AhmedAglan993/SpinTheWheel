import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Prize, Tenant, Invoice } from '../types';
import { authAPI, prizesAPI, usersAPI, subscriptionAPI, tenantAPI } from '../src/services/api';

interface DataContextType {
  // Auth State
  currentTenant: Tenant | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { businessName: string; email: string; password: string; plan?: string }) => Promise<boolean>;
  updateTenantSettings: (updates: Partial<Tenant>) => Promise<void>;

  // Data getters
  prizes: Prize[];
  users: User[];
  invoices: Invoice[];

  // Actions
  addPrize: (prize: Omit<Prize, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deletePrize: (id: string) => Promise<void>;
  updatePrize: (id: string, updates: Partial<Prize>) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'dateJoined'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Refresh functions
  refreshPrizes: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const tenant = await authAPI.getMe();
          setCurrentTenant(tenant);
          await loadTenantData();
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('current_tenant');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Load tenant-specific data
  const loadTenantData = async () => {
    try {
      const [prizesData, usersData] = await Promise.all([
        prizesAPI.getAll(),
        usersAPI.getAll()
      ]);
      setPrizes(prizesData);
      setUsers(usersData);

      // Load invoices
      try {
        const subscriptionData = await subscriptionAPI.get();
        setInvoices(subscriptionData.invoices || []);
      } catch (error) {
        console.error('Failed to load invoices:', error);
      }
    } catch (error) {
      console.error('Failed to load tenant data:', error);
    }
  };

  // Auth Functions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { tenant, token } = await authAPI.login(email, password);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_tenant', JSON.stringify(tenant));
      setCurrentTenant(tenant);
      await loadTenantData();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_tenant');
    setCurrentTenant(null);
    setPrizes([]);
    setUsers([]);
    setInvoices([]);
  };

  const register = async (data: { businessName: string; email: string; password: string; plan?: string }): Promise<boolean> => {
    try {
      const { tenant, token } = await authAPI.signup(data);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_tenant', JSON.stringify(tenant));
      setCurrentTenant(tenant);
      await loadTenantData();
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const updateTenantSettings = async (updates: Partial<Tenant>) => {
    try {
      const updatedTenant = await tenantAPI.update(updates);
      setCurrentTenant(updatedTenant);
      localStorage.setItem('current_tenant', JSON.stringify(updatedTenant));
    } catch (error) {
      console.error('Failed to update tenant settings:', error);
      throw error;
    }
  };

  // Prize Actions
  const refreshPrizes = async () => {
    try {
      const prizesData = await prizesAPI.getAll();
      setPrizes(prizesData);
    } catch (error) {
      console.error('Failed to refresh prizes:', error);
    }
  };

  const addPrize = async (prize: Omit<Prize, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await prizesAPI.create(prize);
      await refreshPrizes();
    } catch (error) {
      console.error('Failed to add prize:', error);
      throw error;
    }
  };

  const deletePrize = async (id: string) => {
    try {
      await prizesAPI.delete(id);
      await refreshPrizes();
    } catch (error) {
      console.error('Failed to delete prize:', error);
      throw error;
    }
  };

  const updatePrize = async (id: string, updates: Partial<Prize>) => {
    try {
      await prizesAPI.update(id, updates);
      await refreshPrizes();
    } catch (error) {
      console.error('Failed to update prize:', error);
      throw error;
    }
  };

  // User Actions
  const refreshUsers = async () => {
    try {
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to refresh users:', error);
    }
  };

  const addUser = async (user: Omit<User, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'dateJoined'>) => {
    try {
      await usersAPI.create(user);
      await refreshUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersAPI.delete(id);
      await refreshUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      currentTenant,
      isLoading,
      login,
      logout,
      register,
      updateTenantSettings,
      prizes,
      users,
      invoices,
      addPrize,
      deletePrize,
      updatePrize,
      addUser,
      deleteUser,
      refreshPrizes,
      refreshUsers
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