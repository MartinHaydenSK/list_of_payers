"use client";

import { useState } from "react";
import { createContext } from "react";
import { ReactNode } from "react";
interface LoginRegistration {
  response: number;
  setResponse: React.Dispatch<React.SetStateAction<number>> ;
}

export const LoginRegistrationContext = createContext<LoginRegistration | null>(
  null
);

export const LoginRegistrationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [response, setResponse] = useState<number>(0);

  return (
    <LoginRegistrationContext.Provider value={{ response, setResponse }}>
      {children}
    </LoginRegistrationContext.Provider>
  );
};
