import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Type guard for FetchBaseQueryError
function isFetchBaseQueryError(
  error: FetchBaseQueryError | SerializedError
): error is FetchBaseQueryError {
  return 'data' in error;
}

export const handleError = (error: FetchBaseQueryError | SerializedError) => {
  if (isFetchBaseQueryError(error)) {
    const typedError = error as FetchBaseQueryError & { data: { message: string } };
    return typedError.data?.message || 'An error occurred';
  }
  return error.message || 'An error occurred';
};
