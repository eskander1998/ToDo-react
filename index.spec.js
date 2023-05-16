const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const todos = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Route pour créer une nouvelle todo
app.post('/todos', (req, res) => {
  const { title, description, status } = req.body;

  const newTodo = {
    _id: String(todos.length + 1),
    title,
    description,
    status
  };

  todos.push(newTodo);

  // Sauvegarder les données dans le fichier JSON
  fs.writeFileSync('data.json', JSON.stringify(todos), 'utf8');

  res.json(newTodo);
});

// Route pour récupérer toutes les todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Route pour récupérer une todo par son ID
app.get('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const todo = todos.find((todo) => todo._id === todoId);

  if (!todo) {
    res.status(404).json({ message: 'Todo non trouvée' });
  } else {
    res.json(todo);
  }
});

// Route pour mettre à jour une todo par son ID
app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const status = req.body.status === 'completed' ? 'incompleted' : 'completed';

  const updatedTodoIndex = todos.findIndex((todo) => todo._id === todoId);

  if (updatedTodoIndex !== -1) {
    todos[updatedTodoIndex].status = status;

    // Sauvegarder les données dans le fichier JSON
    fs.writeFileSync('data.json', JSON.stringify(todos), 'utf8');

    res.json(todos[updatedTodoIndex]);
  } else {
    res.status(404).json({ message: 'Todo non trouvée' });
  }
});

// Route pour supprimer une todo par son ID
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;

  const deletedTodoIndex = todos.findIndex((todo) => todo._id === todoId);

  if (deletedTodoIndex !== -1) {
    const deletedTodo = todos.splice(deletedTodoIndex, 1)[0];

    // Sauvegarder les données dans le fichier JSON
    fs.writeFileSync('data.json', JSON.stringify(todos), 'utf8');

    res.json({ message: 'Todo supprimée avec succès' });
  } else {
    res.status(404).json({ message: 'Todo non trouvée' });
  }
});

// Route pour supprimer toutes les todos
app.delete('/todosall', (req, res) => {
  todos.length = 0;

  // Sauvegarder les données dans le fichier JSON
  fs.writeFileSync('data.json', JSON.stringify(todos), 'utf8');

  res.json({ message: 'Toutes les todos ont été supprimées avec succès' });
});


