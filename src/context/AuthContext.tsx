"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useProviders } from '@/components/uniswap/useProviders';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  connectWallet: () => Promise<any>;
  disconnectWallet: () => void;
  account: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isConnected, connectWallet, disconnectWallet, account } = useProviders();
  const [isLoggedIn, setIsLoggedIn] = useState(isConnected);

  // Синхронізуємо стан isLoggedIn з isConnected
  useEffect(() => {
    setIsLoggedIn(isConnected);
  }, [isConnected]);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn, 
      connectWallet, 
      disconnectWallet,
      account 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};