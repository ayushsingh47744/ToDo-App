# React + Express Todo App

Basic full-stack app: React (Vite) frontend + Express backend.

## Folder structure

```
react-basic-app/
├── backend/        # Express API (port 5000)
│   ├── server.js
│   └── package.json
└── frontend/       # React + Vite (port 5173)
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── App.css
```

## Run karne ka tarika

Do terminals kholo.

**Terminal 1 — Backend**
```bash
cd backend
npm install
npm start
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
```

Browser me kholo: http://localhost:5173

## API endpoints

| Method | Route            | Kaam              |
|--------|------------------|-------------------|
| GET    | /api/todos       | Saare todos       |
| POST   | /api/todos       | Naya todo         |
| PUT    | /api/todos/:id   | Update (done/text)|
| DELETE | /api/todos/:id   | Delete            |

Note: Data in-memory hai, server restart pe reset ho jata hai. Persistent chahiye to MongoDB/SQLite add kar sakte ho.
