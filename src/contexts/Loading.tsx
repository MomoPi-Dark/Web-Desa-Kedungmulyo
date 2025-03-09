"use client";

import React, { createContext, useContext, useState } from "react";

interface LoadingContextProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  setLoading: () => {},
});

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
