import './App.css';
import TodoList from '../src/components/TodoList';
import TodoDetail from '../src/components/TodoDetail';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/tododetail/:id" element={<TodoDetail />} />
      </Routes>
      {/* <TodoList /> */}
    </>
  );
}

export default App;
