export const errorMessageFromValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const errorValue = (value as { error?: unknown }).error;
    if (typeof errorValue === 'string') {
      return errorValue;
    }

    const messageValue = (value as { message?: unknown }).message;
    if (typeof messageValue === 'string') {
      return messageValue;
    }
  }

  return 'Unknown error';
};

export const getApiErrorMessage = (error: unknown): string =>
  errorMessageFromValue(error);
