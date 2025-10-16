
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  uid: string;
  email: string;
  name: string;
  userType: string;
  phone?: string;
}

interface AuthContextType {
  isLoggedIn: boolean | null;
  userName: string;
  userType: string;
  user: User | null;
  login: (name: string, type: string, userData?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedType = localStorage.getItem('userType');
    const storedUser = localStorage.getItem('userData');
    
    console.log('Auth initialization - storedName:', storedName, 'storedType:', storedType, 'storedUser:', storedUser);
    
    if (storedName && storedType) {
      setUserName(storedName);
      setUserType(storedType);
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Parsed user data:', parsedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (e) {
          console.error('Error parsing stored user data:', e);
          // If user data is corrupted, clear storage and require re-login
          localStorage.clear();
          setIsLoggedIn(false);
        }
      } else {
        // Old session without full user data - require re-login
        console.warn('No userData in localStorage - clearing session and requiring re-login');
        localStorage.clear();
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (name: string, type: string, userData?: User) => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userType', type);
    
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }
    
    setUserName(name);
    setUserType(type);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    setUserName('');
    setUserType('');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, userType, user, login, logout }}>
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
