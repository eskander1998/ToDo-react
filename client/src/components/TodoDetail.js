import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function TodoDetail() {
  const [todo, setTodo] = useState([]);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    axios.get("https://backend-rho-cyan.vercel.app/todos/" + id).then((response) => {
      setTodo(response.data);

    });
  }, []);

  const navigate = useNavigate();
  const goToMenu = () => {
    navigate(`/`);
  }
  return (
    <div className="todo-detail">
      <div className="image-container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sogeti-logo-2018.svg/1200px-Sogeti-logo-2018.svg.png"
          alt="Capgemini Image"
        />
      </div>
      <button onClick={goToMenu} className="back-btn">
        Back
      </button>
      <div className="todo-info">
        <h2>{todo.title}</h2>
        <p>{todo.description}</p>
        <div className={`todo-status ${todo.status=== 'completed'? 'completed' : 'notCompleted'}`}>
          {todo.status}
        </div>
      </div>
    </div>
  );
}

export default TodoDetail;