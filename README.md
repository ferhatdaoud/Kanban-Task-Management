# TaskFlow — Full-Stack Collaborative Todo Application

A modern, full-stack task management application built with the **MERN** stack. Users can create boards (groups), organise tasks with drag-free reorder controls, assign tasks to team members, comment in real time, and archive old work. The app features JWT-based authentication, optimistic UI updates, and a clean, responsive interface built with Tailwind CSS + shadcn/ui.

<a href="https://github.com/mokhif/react-todo"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>

---

## Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Scripts](#scripts)

---

## Demo

| Auth Flow | Board View | Task Details |
|---|---|---|
| Sign up / log in with JWT + httpOnly cookies | Kanban-style groups with live task lists | Right-side sheet with editing, assignment, comments |

*(Screenshots can be added here)*

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7 (framework), Vite |
| **Styling** | Tailwind CSS v4, shadcn/ui (Radix UI primitives) |
| **Server State** | TanStack Query v5 (optimistic updates, caching) |
| **Form Handling** | react-hook-form + Zod schemas |
| **HTTP Client** | Axios (with credentials) |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB (Atlas) via Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcrypt password hashing |
| **Dev Tooling** | ESLint 9, Vite, Nodemon |

---

## Architecture

```
react-todo/
│
├── my-client/                 # Frontend application
│   ├── app/
│   │   ├── root.jsx           # Root component (QueryClientProvider + layout)
│   │   ├── routes.js          # Route definitions
│   │   ├── pages/             # Route-level pages (home, login, register)
│   │   ├── components/        # Reusable UI components
│   │   │   ├── GroupCard/     # Column/group card with reorder & actions
│   │   │   ├── TodoItem/      # Task card, dropdown menu, side sheet
│   │   │   ├── AddTodoModal   # Modal for adding todos
│   │   │   ├── CreateGroup    # Modal for creating groups
│   │   │   ├── Navbar         # Top navigation bar
│   │   │   └── ArchivedTasksModal
│   │   ├── lib/
│   │   │   ├── schemas/       # Zod validation schemas
│   │   │   └── utils.js       # Tailwind `cn` helper
│   │   └── app.css            # Tailwind directives
│   ├── public/
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── tailwind.config / postcss
│   └── package.json
│
└── my-server/                 # Backend API
    ├── server.js              # Express entry point
    ├── config/db.js           # MongoDB connection
    ├── src/
    │   ├── controllers/       # Request handlers (auth, todo, group, comment, user)
    │   ├── models/            # Mongoose schemas (User, Group, Todo, Comment)
    │   ├── routes/            # Express routers (RESTful)
    │   ├── middleware/        # Auth middleware (JWT verification)
    │   └── utils/             # Token generation
    ├── .env                   # Environment variables
    └── package.json
```

---

## Features

### Authentication
- **User registration** with email, name, and password confirmation
- **Secure login/logout** using JWT stored in an `httpOnly` cookie (XSS-resistant)
- **Password hashing** with bcrypt (salt rounds = 10)
- Protected routes enforced via Express middleware (`protect`)

### Group / Board Management
- Create, read, update (rename), and delete groups
- Reorder groups horizontally with live UI + backend persistence
- Progress indicator ("X of Y completed" per group)

### Task / Todo Management
- Create tasks with title and optional description
- Mark tasks as done / toggle completion status
- Archive and restore tasks (archived tasks hidden from main view)
- Delete tasks (single or via dropdown)
- **Reorder tasks** within a group: move up, down, to top, or to bottom — optimistic UI + API sync
- Search tasks within a group (case-insensitive regex)

### Task Details (Side Sheet)
- Edit title and description
- Change assignee from a searchable user dropdown
- Move task between groups
- Sub-task support (model includes `subtasks` array)
- Due date field (model)

### Comments
- Add comments to tasks
- View all comments with author name and timestamp
- Delete comments
- Live comment count badge

### Archived Tasks
- Dedicated modal view for archived tasks per group
- Restore archived tasks back to the board
- View archive date

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Hashed (bcrypt), never returned |
| `timestamps` | Date | createdAt, updatedAt |

### Group
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Optional |
| `user` | ObjectId | Ref → User |
| `position` | Number | For drag-free reorder |
| `timestamps` | Date | |

### Todo
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Optional |
| `group` | ObjectId | Ref → Group |
| `user` | ObjectId | Ref → User |
| `assignedTo` | ObjectId | Ref → User |
| `isDone` | Boolean | Default `false` |
| `isArchived` | Boolean | Default `false` |
| `subtasks` | Array | `{ title, isDone }` |
| `position` | Number | For reorder |
| `dueDate` | Date | |
| `timestamps` | Date | |

### Comment
| Field | Type | Notes |
|---|---|---|
| `content` | String | Required |
| `user` | ObjectId | Ref → User |
| `todo` | ObjectId | Ref → Todo |
| `timestamps` | Date | |

---

## API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Log in, set JWT cookie | Public |
| POST | `/logout` | Clear JWT cookie | Public |
| GET | `/me` | Get current user | Protected |

### Groups
| Method | Endpoint | Description |
|---|---|---|
| GET | `/group` | Get all groups (sorted by position) |
| POST | `/group` | Create a new group |
| PUT | `/group/:id` | Update group title/description |
| DELETE | `/group/:id` | Delete group + cascade delete its todos |
| PUT | `/group/reorderGroup` | Reorder all groups |

### Todos
| Method | Endpoint | Description |
|---|---|---|
| GET | `/todos` | Get all todos |
| GET | `/todos/:groupId?search=` | Get todos for a group (with optional search) |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/:id` | Update a todo (title, description, isDone, isArchived, assignedTo, group) |
| DELETE | `/todos/:id` | Delete a todo |
| PUT | `/todos/reorderTodo` | Reorder todos within a group |
| GET | `/todos/archived/:groupId` | Get archived todos for a group |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/comments/:todoId` | Get all comments for a todo |
| POST | `/comments` | Create a comment |
| PUT | `/comments/:id` | Update a comment |
| DELETE | `/comments/:id` | Delete a comment |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/user` | Get all users (for assignment) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18 (LTS)
- **npm** (or yarn / pnpm)
- **MongoDB Atlas** account (or local MongoDB)

### Installation

Clone and install dependencies in both folders:

```bash
git clone https://github.com/mokhif/react-todo.git
cd react-todo

# Backend
cd my-server
npm install

# Frontend
cd ../my-client
npm install
```

### Environment Variables

Create `my-server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

> Copy from the existing `my-server/.env.example` if available, or use the values in the repo's `.env` as a template.

### Running Locally

Start both the backend and frontend:

```bash
# Terminal 1 — Backend (API on port 5000)
cd my-server
npm run dev

# Terminal 2 — Frontend (dev server on port 5173)
cd my-client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
react-todo/
├── my-client/                 # React frontend (Vite + React Router 7)
├── my-server/                 # Express API (MongoDB)
├── package-lock.json
└── README.md                  # This file
```

---

## Scripts

### my-client
| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

### my-server
| Script | Description |
|---|---|
| `npm run dev` | Start server with Nodemon (auto-restart) |
| `npm start` | Start server in production mode |
