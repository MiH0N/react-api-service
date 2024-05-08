import { useCallback, useEffect, useReducer, useRef } from "react";
import type {
  ApiStatusReducerProps,
  ServiceOptionProps,
  UseFetchParams,
  UseFetchState,
} from "../@types/api";

const serviceOption = <T,>(initialDataType: T): ServiceOptionProps<T> => ({
  isLoading: false,
  data: initialDataType,
  error: undefined,
});

const apiStatusReducer =
  <T,>(initialDataType: T): ApiStatusReducerProps<T> =>
    (state, action) => {
      switch (action.type) {
        case "pending": {
          return { ...serviceOption(initialDataType), isLoading: true };
        }
        case "resolved": {
          return { ...serviceOption(initialDataType), data: action.data };
        }
        case "rejected": {
          return { ...serviceOption(initialDataType), error: action.error };
        }
        default: {
          return state;
        }
      }
    };

function useFetch<T>({
  apiHandler,
  initialDataType,
  key,
  cacheTime = 5 * 60 * 1000, // Default cache time: 5 minutes
}: UseFetchParams<T>): UseFetchState<T> {
  const cache = useRef<Record<string, { data: T; timestamp: number }>>({});
  const abortControllerRef = useRef<AbortController>();

  const [state, dispatch] = useReducer(
    apiStatusReducer(initialDataType),
    serviceOption(initialDataType),
  );

  const httpRequest = useCallback(
    async (signal: AbortSignal) => {
      dispatch({ type: "pending" });

      const currentTime = Date.now();
      const cachedData = cache.current[key];
      const isCacheValid = cachedData && currentTime - cachedData.timestamp < cacheTime;

      if (isCacheValid) {
        dispatch({ type: "resolved", data: cachedData.data });
        return;
      }

      try {
        if (signal.aborted) {
          return;
        }
        const res = await apiHandler(signal);
        cache.current[key] = { data: res.data, timestamp: currentTime };
        dispatch({ type: "resolved", data: res.data });
      } catch (err: unknown) {
        handleError(err);
      }
    },
    [apiHandler, key, cacheTime],
  );

  const handleError = (error: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Fetch aborted");
    } else {
      dispatch({ type: "rejected", error: error as Error });
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const executeAsync = async () => {
      await httpRequest(abortController.signal);
    };

    executeAsync();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [httpRequest]);

  const refetch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    httpRequest(abortControllerRef.current.signal);
  };

  return {
    isLoading: state.isLoading,
    error: state.error,
    data: state.data,
    refetch,
  };
}

export default useFetch;