type ServiceOptionProps<T> = {
  isLoading: boolean;
  data: T;
  error: Error | undefined;
};

type Action<T> =
  | { type: 'pending' }
  | { type: 'resolved'; data: T }
  | { type: 'rejected'; error: Error };

type ApiStatusReducerProps<T> = (state: ServiceOptionProps<T>, action: Action<T>) => ServiceOptionProps<T>;

interface UseFetchParams<T> {
  apiHandler: (signal: AbortSignal) => Promise<{ data: T }>;
  initialDataType?: T;
  key: string 
  cacheTime?: number
}

interface UseFetchState<T> {
  isLoading: boolean;
  error: Error | undefined;
  data: T | undefined;
  refetch : () => void
}

export type {
  ServiceOptionProps,
  ApiStatusReducerProps,
  UseFetchParams,
  UseFetchState
}
