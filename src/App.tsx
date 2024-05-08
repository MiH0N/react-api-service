import useFetch from './hooks/useFetch';
import './App.css'

const fetchData = async (signal: AbortSignal) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', { signal });
  const data = await response.json();
  return { data };
};

type TodoProps = {
  id: number;
  userId: number;
  title: string;
  completed: boolean
}

function App() {
  const { isLoading, data, refetch } = useFetch<TodoProps>({
    apiHandler: fetchData,
    key: 'todo',
    cacheTime: 10000
  });

  return (
    <div className="card">
      <button onClick={() => refetch()}>
        refetch
      </button>
      {isLoading ?
        <p>'isLoading .......'</p> :
        (
          <div className='todo'>
            <p>task : {data?.title}</p>
            {data?.completed ? <span>✅</span> : <span>❌</span>}
          </div>
        )}

    </div>
  )
}

export default App
