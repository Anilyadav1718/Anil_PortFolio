'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AdminContextType {
  saveStatus: string | null;
  showSaveSuccess: (msg?: string) => void;
  getAdminHeaders: () => Record<string, string>;
}

const AdminContext = createContext<AdminContextType>({
  saveStatus: null,
  showSaveSuccess: () => {},
  getAdminHeaders: () => ({}),
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const showSaveSuccess = useCallback((msg: string = 'Changes saved successfully') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  }, []);

  const getAdminHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null;
    return token ? { 'x-admin-token': token } : {};
  }, []);

  return (
    <AdminContext.Provider value={{ saveStatus, showSaveSuccess, getAdminHeaders }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
