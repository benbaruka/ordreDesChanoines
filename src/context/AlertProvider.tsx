// context/AlertContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Alert from '@/components/ui/alert/Alert';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertData {
  id: number;
  variant: AlertType;
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

interface AlertContextType {
  showAlert: (alert: Omit<AlertData, 'id'>) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const showAlert = (alert: Omit<AlertData, 'id'>) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { ...alert, id }]);

    // auto remove after 5s
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {/* Alert Container Bottom Right */}
      <div className="fixed bottom-4 right-4 z-[999999] w-[300px] space-y-3">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            showLink={alert.showLink}
            linkHref={alert.linkHref}
            linkText={alert.linkText}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
