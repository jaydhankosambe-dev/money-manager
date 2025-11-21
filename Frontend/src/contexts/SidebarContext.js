import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSidebarState();
  }, []);

  const loadSidebarState = async () => {
    try {
      const collapsed = await AsyncStorage.getItem('sidebarCollapsed');
      if (collapsed !== null) {
        setIsCollapsed(collapsed === 'true');
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = async () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    try {
      await AsyncStorage.setItem('sidebarCollapsed', String(collapsed));
    } catch (error) {
      // Silent fail
    }
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isLoading }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
