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
}: UseFetchParams<T>): UseFetchState<T> {
  const [state, dispatch] = useReducer(
    apiStatusReducer(initialDataType),
    serviceOption(initialDataType),
  );

  const abortControllerRef = useRef<AbortController>();

  const httpRequest = useCallback(
    async (signal: AbortSignal) => {
      dispatch({ type: "pending" });
      try {
        if (signal.aborted) {
          return;
        }
        const res = await apiHandler(signal);
        dispatch({ type: "resolved", data: res.data });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          dispatch({ type: "rejected", error: err as Error });
        }
      }
    },
    [apiHandler],
  );

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

  return {
    isLoading: state.isLoading,
    error: state.error,
    data: state.data,
  };
}

export default useFetch;
