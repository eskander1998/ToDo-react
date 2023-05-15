import { useEffect, useState } from "react";
import "../components/style.css";
import axios from "axios";


export default function TaskList() {
  const [todos, setTodos] = useState([]);
  

  useEffect(() => {
    axios.get("http://localhost:5555/todos").then((response) => {
console.log(`👀 `,response.data )
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
                <a
                  className={task.status==="incompleted" ? "not-completed" : "completed"}
                >
                  {task.title}
                </a>
              </div>
              <span
                className={`task-status ${
                  task.status==="incompleted" ? "not-completed" : "completed"
                }`}
              >
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
