const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Définition du schéma de la collection "todos"
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: "incompleted"
  }

},
  { timestamps: true });

// Définition du modèle basé sur le schéma
const Todo = mongoose.model('Todo', todoSchema);

// Création de l'application Express
const app = express();

app.use(express.json());
app.use(cors());
const server = require('http').createServer(app);

// Route pour créer une nouvelle todo
app.post('/todos', (req, res) => {
  const { title, description, status } = req.body;

  const newTodo = new Todo({
    title,
    description,
    status
  });

  newTodo.save()
    .then(todo => res.json(todo))
    .catch(err => res.status(500).json(err));
});

// Route pour récupérer toutes les todos
app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => res.json(todos))
    .catch(err => res.status(500).json(err));
});

app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id)
    .then(todos => res.json(todos))
    .catch(err => res.status(500).json(err));
});

// Route pour récupérer une todo par son ID
app.get('/todos/:id', (req, res) => {
  const todoId = req.params.id;

  Todo.findById(todoId)
    .then(todo => {
      if (!todo) {
        res.status(404).json({ message: 'Todo non trouvée' });
      } else {
        res.json(todo);
      }
    })
    .catch(err => res.status(500).json(err));
});

// Route pour mettre à jour une todo par son ID
app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const status = req.body.status === "completed" ? "incompleted" : "completed"
  Todo.findByIdAndUpdate(todoId, { status: status }, { new: true })
    .then(todo => {
      if (!todo) {
        res.status(404).json({ message: 'Todo non trouvée' });
      } else {
        res.json(todo);
      }
    })
    .catch(err => res.status(500).json(err));
});

// Route pour supprimer une todo par son ID
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;

  Todo.findByIdAndDelete(todoId)
    .then(() => res.json({ message: 'Todo supprimée avec succès' }))
    .catch(err => res.status(500).json(err));
});


app.delete('/todosall', (req, res) => {

  Todo.deleteMany({ status: { $in: [true, false] } })
});

// Démarrage du serveur
server.listen(5555, () => { console.log('Server is running on port ' + 5555) });
