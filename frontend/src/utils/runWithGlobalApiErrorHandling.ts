export type ShowErrorFn = (error: unknown, fallbackMessage?: string) => void;

export const runWithGlobalApiErrorHandling = async <T>(
  action: () => Promise<T>,
  showError: ShowErrorFn,
  fallbackMessage: string,
): Promise<T | undefined> => {
  try {
    return await action();
  } catch (error) {
    showError(error, fallbackMessage);
    return undefined;
  }
};

