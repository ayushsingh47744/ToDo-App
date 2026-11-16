require("dotenv").config();
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]); // ADDED: use public DNS for the SRV lookup
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // ADDED: talks to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = // ADDED: DB URL from .env, local fallback
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo-app";

app.use(cors());
app.use(express.json());

// ADDED: schema = data is saved in MongoDB and survives restarts
const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt, used for sorting
);

// ADDED: send `id` instead of `_id` so the frontend works unchanged
todoSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Todo = mongoose.model("Todo", todoSchema); // ADDED: DB access object

// ADDED: Express 4 doesn't catch async errors, so forward them to the handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// CHANGED: reads from the database instead of the array
app.get(
  "/api/todos",
  asyncHandler(async (req, res) => {
    res.json(await Todo.find().sort({ createdAt: 1 }));
  })
);

// CHANGED: saves to the database; MongoDB creates the id (no nextId)
app.post(
  "/api/todos",
  asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }
    res.status(201).json(await Todo.create({ text }));
  })
);

// CHANGED: ids are strings now; invalid ids return 404 instead of crashing
app.put(
  "/api/todos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const updates = {};
    if (typeof req.body.done === "boolean") updates.done = req.body.done;
    if (typeof req.body.text === "string" && req.body.text.trim()) {
      updates.text = req.body.text.trim();
    }
    const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  })
);

// CHANGED: deletes directly in the database
app.delete(
  "/api/todos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(204).end();
  })
);

// ADDED: catches errors from routes and returns a safe 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

// CHANGED: connect to the DB first, then start the server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });