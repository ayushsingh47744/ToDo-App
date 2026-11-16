import { useEffect, useState } from "react";

const API = "/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const loadTodos = async () => {
    try {
      const res = await fetch(API);
      setTodos(await res.json());
      setError("");
    } catch {
      setError("Backend not connected?");
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const todo = await res.json();
    setTodos((prev) => [...prev, todo]);
    setText("");
  };

  const toggleTodo = async (todo) => {
    const res = await fetch(`${API}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <p className="subtitle">React + Express</p>

      <form onSubmit={addTodo} className="form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo)}
              />
              <span>{todo.text}</span>
            </label>
            <button className="delete" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </li>
        ))}
        {todos.length === 0 && !error && <p className="empty">No tasks to display.</p>}
      </ul>
    </div>
  );
}
