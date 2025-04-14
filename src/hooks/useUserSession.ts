
import { useState, useEffect } from 'react';

interface UserSession {
  userId: string | null;
  username: string | null;
  email: string | null;
}

export const useUserSession = () => {
  const [user, setUser] = useState<UserSession>({
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email')
  });

  const login = (userData: UserSession) => {
    localStorage.setItem('userId', userData.userId || '');
    localStorage.setItem('username', userData.username || '');
    localStorage.setItem('email', userData.email || '');
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setUser({ userId: null, username: null, email: null });
  };

  return { user, login, logout };
};
