import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DropdownsContext = createContext();

export function DropdownsProvider({ children }) {
  const [dropdowns, setDropdowns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchDropdowns() {
      try {
        setLoading(true);
        // 
        const res = await axios.get("/mock-dropdowns.json");
        if (!cancelled) setDropdowns(res.data);
      } catch (err) {
        if (!cancelled) setError(err);
        console.error("Failed to load dropdowns", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDropdowns();
    return () => (cancelled = true);
  }, []);

  return (
    <DropdownsContext.Provider value={{ dropdowns, loading, error }}>
      {children}
    </DropdownsContext.Provider>
  );
}

export function useDropdowns() {
  return useContext(DropdownsContext);
}
