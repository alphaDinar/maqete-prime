'use client'
import { Dispatch, ReactNode, createContext, useContext, useState, useEffect } from "react";

interface defType extends Record<string, any> { };

type authTargetContextProviderProps = {
  children: ReactNode;
};

type authTargetContext = {
  authTarget: string,
  setAuthTarget: Dispatch<React.SetStateAction<string>>;
}

export const AuthTargetContext = createContext<authTargetContext | null>(null);

export const AuthTargetContextProvider = ({ children }: authTargetContextProviderProps) => {
  const [authTarget, setAuthTarget] = useState<string>('/');

  useEffect(() => {
    if (typeof window !== undefined) {
      if (sessionStorage.getItem('authTarget')) {
        setAuthTarget(sessionStorage.getItem('authTarget')!);
      } else {
        setAuthTarget('/');
      }
    }
  }, [])

  return (
    <AuthTargetContext.Provider value={{ authTarget, setAuthTarget }}>
      {children}
    </AuthTargetContext.Provider>
  )
}

export const useAuthTarget = () => {
  const context = useContext(AuthTargetContext);
  if (!context) {
    throw new Error("useAuthContext must be within a cartContextProvider");
  }
  return context;
}
