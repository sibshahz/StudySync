"use client";
import { createContext, useContext, useState } from "react";

export type User = {
  id?: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
};
const AuthContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
