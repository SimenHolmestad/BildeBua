import React from 'react';
import { getApiErrorMessage } from 'utils/apiError';

type GlobalErrorContextValue = {
  clearError: () => void;
  currentErrorMessage: string | null;
  showError: (error: unknown, fallbackMessage?: string) => void;
  snackbarVersion: number;
};

const GlobalErrorContext = React.createContext<GlobalErrorContextValue | undefined>(undefined);

type GlobalErrorProviderProps = {
  children: React.ReactNode;
};

export const GlobalErrorProvider = ({ children }: GlobalErrorProviderProps) => {
  const [currentErrorMessage, setCurrentErrorMessage] = React.useState<string | null>(null);
  const [snackbarVersion, setSnackbarVersion] = React.useState(0);

  const clearError = React.useCallback(() => {
    setCurrentErrorMessage(null);
  }, []);

  const showError = React.useCallback((error: unknown, fallbackMessage?: string) => {
    const messageFromError = getApiErrorMessage(error);
    const message =
      messageFromError === 'Ukjent feil' && fallbackMessage
        ? fallbackMessage
        : messageFromError;

    setCurrentErrorMessage(message);
    setSnackbarVersion((value) => value + 1);
  }, []);

  const value = React.useMemo<GlobalErrorContextValue>(() => ({
    clearError,
    currentErrorMessage,
    showError,
    snackbarVersion,
  }), [clearError, currentErrorMessage, showError, snackbarVersion]);

  return (
    <GlobalErrorContext.Provider value={value}>
      {children}
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = () => {
  const context = React.useContext(GlobalErrorContext);
  if (!context) {
    throw new Error('useGlobalError må brukes innenfor GlobalErrorProvider');
  }
  return context;
};
