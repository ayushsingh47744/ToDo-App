const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store (restart pe reset ho jayega)
let todos = [
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Build backend with Express", done: true },
];
let nextId = 3;

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }
  const todo = { id: nextId++, text: text.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  if (typeof req.body.done === "boolean") todo.done = req.body.done;
  if (typeof req.body.text === "string") todo.text = req.body.text;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const before = todos.length;
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  if (todos.length === before) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
