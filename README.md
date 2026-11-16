# Todo App

A full-stack todo application built with React, Express and MongoDB. It lets you manage a simple task list from the browser, and every change is saved in a database.

## What It Does

- Add new tasks
- Mark tasks as done or not done
- Delete tasks
- Saves all tasks in MongoDB (Atlas), so they are still there after a restart

## Tech Stack

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose

## Where It Runs

| Part     | URL                     | Port |
|----------|-------------------------|------|
| Frontend | http://localhost:5173   | 5173 |
| Backend  | http://localhost:5000   | 5000 |

The frontend sends its `/api` requests to the backend on port 5000 through the Vite dev proxy. The main API route is `http://localhost:5000/api/todos`.

## Project Structure

```
ToDo-App/
├── backend/
│   ├── server.js          # Express server, Mongoose model and API routes
│   ├── package.json
│   └── .env               # Environment variables (not committed)
└── frontend/
    ├── index.html
    ├── vite.config.js     # Vite config and /api proxy to the backend
    ├── package.json
    └── src/
        ├── main.jsx       # React entry point
        ├── App.jsx        # Main component: UI and API calls
        └── App.css        # Styles
```