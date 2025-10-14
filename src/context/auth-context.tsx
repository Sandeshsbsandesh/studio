
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean | null;
  userName: string;
  userType: string;
  login: (name: string, type: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedType = localStorage.getItem('userType');
    if (storedName && storedType) {
      setIsLoggedIn(true);
      setUserName(storedName);
      setUserType(storedType);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (name: string, type: string) => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userType', type);
    setUserName(name);
    setUserType(type);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    setUserName('');
    setUserType('');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, userType, login, logout }}>
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
