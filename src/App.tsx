import useFetch from './hooks/useFetch';
import './App.css'

const fetchData = async (signal: AbortSignal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos', { signal });
  const data = await response.json();
  return { data };
};

function App() {
  const { isLoading, data, refetch } = useFetch({
    apiHandler: fetchData,
    initialDataType: { data: null }, // Example initial data type
  });

  return (
    <div className="card">
      <button onClick={() => refetch()}>
        refetch
      </button>
      <p>
        {isLoading ? 'isLoading .......' : 'done!'}
      </p>
    </div>
  )
}

export default App
