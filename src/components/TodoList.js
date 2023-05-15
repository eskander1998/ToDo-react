import { useEffect, useState } from "react";
import "../components/style.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function TaskList() {
  const [todos, setTodos] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5555/todos").then((response) => {
      console.log(`👀 `, response.data)
      const sortedTodos = response.data.sort((a, b) => {
        if (a.status === b.status) {
          // Si les tâches ont le même statut
          if (a.status === "incompleted") {
            // Trier les tâches "incompleted" par date de création décroissante
            return new Date(b.createdAt) - new Date(a.createdAt);
          } else {
            // Trier les tâches "completed" par date de mise à jour croissante
            return new Date(a.updatedAt) - new Date(b.updatedAt);
          }
        } else {
          // Trier les tâches "incompleted" avant les tâches "completed"
          return a.status === "incompleted" ? -1 : 1;
        }
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
        if (updatedTaskFromResponse.status==="completed") {
          updatedTodos.push(updatedTaskFromResponse);
        } else {
          let i = updatedTodos.findIndex((t) => t._id > updatedTaskFromResponse._id);
          if (i === -1) i = updatedTodos.length;
          updatedTodos.splice(i, 0, updatedTaskFromResponse);
          updatedTodos.sort((a, b) => {
            if (a.status === b.status) {
              // Si les tâches ont le même statut
              if (a.status === "incompleted") {
                // Trier les tâches "incompleted" par date de création décroissante
                return new Date(b.createdAt) - new Date(a.createdAt);
              } else {
                // Trier les tâches "completed" par date de mise à jour croissante
                return new Date(a.updatedAt) - new Date(b.updatedAt);
              }
            } else {
              // Trier les tâches "incompleted" avant les tâches "completed"
              return a.status === "incompleted" ? -1 : 1;
            }
          });
        }
         
        setTodos(updatedTodos);
        
      }
    });
  };

  const addTask = (e) => {
    e.preventDefault(); // empêcher le comportement par défaut du formulaire

    const newTask = {
      title: taskTitle,
      completed: false,
      description: taskDescription,
    };
    axios.post("http://localhost:5555/todos", newTask).then((response) => {
      const taskToAdd = { ...response.data };
      setTodos([taskToAdd, ...todos]);
      setTaskTitle("");
      setTaskDescription("");
    });
  };

  const viewTodoDetails = ( task) => {
    navigate(`/tododetail/${task._id}` );

  };
  return (
    <div className="container">
      <div className="header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sogeti-logo-2018.svg/1200px-Sogeti-logo-2018.svg.png"
          alt="Capgemini image"
        />
      </div>


      <form onSubmit={addTask}>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Task Description"
        />
        <button type="submit">Add task</button>
      </form>
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
                <a className={task.status === 'completed' ? 'completed' : ''}
                  onClick={() => viewTodoDetails(task)}
                >
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
