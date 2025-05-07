import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${backendURL}/me`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Unauthenticated');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user information');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [backendURL]);

  const logout = async () => {
    try {
      await fetch(`${backendURL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, error, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
