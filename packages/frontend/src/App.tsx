import { useState } from 'react';
import { trpc } from './trpc/client';

function App() {
  const [greeting, setGreeting] = useState<string | null>(null)
  
  const fetchGreeting = async () => {
    try {
      const result = await trpc.greeting.query({ name: 'World' });
      setGreeting(result.greeting);
    } catch (error) {
      console.error('Error fetching greeting:', error);
    }
  }

  return (
    <div className="App">
      <h1>Fullstack Monorepo</h1>
      <div>
        <button onClick={fetchGreeting}>
          Fetch Greeting
        </button>
        {greeting && <p>{greeting}</p>}
      </div>
    </div>
  )
}

export default App