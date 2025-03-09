"use client";

import React, { createContext, useContext, useState } from "react";

export interface SharedContent {
  key: string;
  value: any;
}

interface SharedContextProps {
  data: SharedContent[];
  setShared: (key: string, ...values: any[]) => void;
}

const SharedContext = createContext<SharedContextProps>({
  data: [],
  setShared: () => {},
});

export const SharedProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShared, setSharedState] = useState<SharedContent[]>([]);

  // Function to handle adding/updating shared data
  const handleSetShared = (key: string, ...values: any[]) => {
    setSharedState((prevState) => {
      const updatedData = [...prevState];

      // Check if the key already exists in the shared data
      const index = updatedData.findIndex((item) => item.key === key);

      if (index !== -1) {
        // Update existing entry
        updatedData[index].value = values;
      } else {
        // Add new entry
        updatedData.push({ key, value: values });
      }

      return updatedData;
    });
  };

  return (
    <SharedContext.Provider
      value={{ data: isShared, setShared: handleSetShared }}
    >
      {children}
    </SharedContext.Provider>
  );
};

export const useShared = () => useContext(SharedContext);
