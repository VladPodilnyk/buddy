import Chat from './components/chat';

export const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="font-semibold">Fullstack Monorepo</h1>
      <div>
        <Chat userId="2" receiverId="1" />
      </div>
    </div>
  )
}
