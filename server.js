const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Хранилище комментариев — ОБЪЯВИТЬ ДО МАРШРУТОВ
let comments = [
  { id: 1, name: 'Глеб Фокин', text: 'Это мой первый комментарий' },
  { id: 2, name: 'Дмитрий', text: 'А это мой первый комментарий' }
];

// API-маршруты — ДО fallback-маршрута
app.use('/comments', (req, res) => {
  res.json(comments);
});

app.post('/comments', (req, res) => {
  const newComment = req.body;
  if (!newComment.name || !newComment.text) {
    return res.status(400).json({ error: 'Имя и текст обязательны' });
  }
  const commentToSave = {
    id: Date.now(),
    name: newComment.name,
    text: newComment.text
  };
  comments.push(commentToSave);
  res.status(201).json(commentToSave);
});

// Fallback-маршрут — ПОСЛЕ ВСЕХ API-маршрутов
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://127.0.0.1:${PORT}`);
});