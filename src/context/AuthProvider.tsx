import React, { createContext, useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ResponseLog } from '@/types';

const PageLoader = dynamic(() => import('../global/loader/PageLoader'), {
  ssr: false,
});

type AuthContextType = {
  user: ResponseLog | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: ResponseLog | null) => void;
  logout: () => void;
  setShouldRedirect: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ResponseLog | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user-session');
      if (storedUser) {
        try {
          const parsedUser: ResponseLog = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user:', error);
          localStorage.removeItem('user-session');
        }
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user-email');
      localStorage.removeItem('otp-timer');
      localStorage.removeItem('otp-sent');
      localStorage.removeItem('user-session');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setShouldRedirect(true); // Déclencher la redirection
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    if (!checkingAuth && shouldRedirect) {
      if (!user) {
        router.push('/signin');
      } else {
        router.push('/dashboard');
      }
      setShouldRedirect(false); // Réinitialiser après la redirection
    }
  }, [user, checkingAuth, shouldRedirect, router]);

  if (checkingAuth) {
    return (
      <div className="bg-primary flex h-[100vh] w-full items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        logout,
        setIsAuthenticated,
        setUser,
        setShouldRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
};
