import { useEffect, useState } from "react";
import "../components/style.css";
import axios from "axios";


export default function TaskList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/todos").then((response) => {
      console.log(`👀 `, response.data)
      const sortedTodos = response.data
        .sort((a, b) => b._id - a._id)
        .sort((a, b) => {
          if (a.completed === b.completed) return 0;
          if (a.completed && !b.completed) return 1;
          if (!a.completed && b.completed) return -1;
        });
      setTodos(sortedTodos);

    });
  }, []);


  const updateTaskOrder = (task) => {
    const updatedTask = {
      ...task
    };

    axios.put(`http://localhost:5555/todos/${task._id}`, updatedTask).then((response) => {
      const updatedTaskFromResponse = response.data;
      const updatedTodos = [...todos];
      const index = updatedTodos.findIndex((t) => t._id === task._id);

      if (index !== -1) {
        updatedTodos.splice(index, 1);
        if (updatedTaskFromResponse.status) {
          updatedTodos.push(updatedTaskFromResponse);
        } else {
          let i = updatedTodos.findIndex((t) => t._id > updatedTaskFromResponse._id);
          if (i === -1) i = updatedTodos.length;
          updatedTodos.splice(i, 0, updatedTaskFromResponse);
        }
        setTodos(updatedTodos);
      }
    });
  };

  return (
    <div className="container">
      <div className="header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sogeti-logo-2018.svg/1200px-Sogeti-logo-2018.svg.png"
          alt="Capgemini image"
        />
      </div>


      <div className="todo-list">
        <ul>
          {todos.map((task) => (
            <li key={task._id}>
              <div>
                <input
                  type="checkbox"
                  checked={task.status === 'completed' ? true : false}
                  onChange={() => updateTaskOrder(task)}
                />
                <a className={task.status === 'completed'  ? 'completed' : ''}>
                  {task.title}
                </a>
              </div>
              <span className={`task-status ${task.status === 'completed' ? 'completed' : 'not-completed'}`}>
                {task.taskStatus}

                {task.status === 'completed' ? 'completed' : 'not-completed'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
