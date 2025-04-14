
import React, { createContext, useContext } from 'react';
import { useUserSession } from '../hooks/useUserSession';

const UserSessionContext = createContext<ReturnType<typeof useUserSession> | undefined>(undefined);

export const UserSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userSession = useUserSession();

  return (
    <UserSessionContext.Provider value={userSession}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserSessionContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserSessionProvider');
  }
  return context;
};
