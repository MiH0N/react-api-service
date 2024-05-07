# useFetch Hook Documentation

## Overview

The `useFetch` hook is a custom React hook designed to simplify the process of making API calls within a React application. It leverages the power of React's `useReducer` and `useEffect` hooks to manage the state of API requests, including loading, success, and error states. This hook is particularly useful for fetching data from an API and managing the UI state based on the API call's outcome.

## Features

- **Automatic Loading State Management**: The hook automatically manages the loading state of the API call, allowing you to easily display loading indicators in your UI.
- **Error Handling**: It provides a straightforward way to handle errors from API calls, enabling you to display error messages to the user.
- **Abortable Requests**: The hook supports aborting ongoing API requests, which is useful for preventing memory leaks and unnecessary network activity.
- **Refetching**: It includes a `refetch` function that allows you to easily re-execute the API call.

## Usage

To use the `useFetch` hook, you need to pass an object with the following properties:

- `apiHandler`: A function that performs the API call. This function should accept an `AbortSignal` as its argument and return a promise that resolves with the API response.
- `initialDataType`: The initial data type for the API response. This is used to initialize the state of the hook.

## Example

```typescript
import useFetch from './hooks/useFetch';

function MyComponent() {
 const { isLoading, data, error, refetch } = useFetch({
    apiHandler: async (signal) => {
      const response = await fetch('https://api.example.com/data', { signal });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    initialDataType: [], // Assuming the API returns an array
 });

 if (isLoading) return <div>Loading...</div>;
 if (error) return <div>Error: {error.message}</div>;

 return (
    <div>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={refetch}>Refetch Data</button>
    </div>
 );
}
```

## Dependencies

- React
- TypeScript

## Notes

- The `useFetch` hook uses the `AbortController` API to abort ongoing API requests. This feature is supported in modern browsers but may require polyfills for older browsers.
- The hook is designed to be generic and can be used with any API that returns a promise.
- The `initialDataType` parameter is used to initialize the state of the hook. It should match the expected structure of the API response.

## Conclusion

The `useFetch` hook provides a powerful and flexible way to manage API calls in React applications. By abstracting away the complexities of managing loading states, error handling, and abortable requests, it allows developers to focus on building the UI and handling the data.