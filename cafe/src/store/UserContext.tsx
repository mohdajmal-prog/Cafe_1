import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, MOCK_USER } from "../services/types";
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          const userData = await api.getUserProfile();
          setUserState(userData);
        }
      } catch (error) {
        console.debug('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  const setUser = useCallback((newUser: User) => {
    setUserState(newUser);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await api.getUserProfile();
      setUserState(userData);
    } catch (error) {
      console.debug('Failed to refresh user:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUserState(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, setUser, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
