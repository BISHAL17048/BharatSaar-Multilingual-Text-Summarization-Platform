import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HistoryContextType {
  refreshCounter: number;
  triggerRefresh: () => void;
}

const HistoryContext = createContext<HistoryContextType>({
  refreshCounter: 0,
  triggerRefresh: () => {},
});

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  return (
    <HistoryContext.Provider value={{ refreshCounter, triggerRefresh }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}
