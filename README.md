# Kanban Task Management

A full-stack Kanban task management application built with a **React + React Router** frontend and an **Express + MongoDB** backend. It supports user authentication, boards, tasks, subtasks, comments, archiving, drag-and-drop reordering, and due dates.

## Features

- **Authentication** — register, login, and logout with JWT stored in HTTP-only cookies
- **Boards** — create, read, update, delete, and reorder boards
- **Tasks** — create, read, update, and delete tasks within boards
- **Task assignment** — assign tasks to users
- **Comments** — post and delete comments on tasks
- **Archiving** — archive completed tasks and restore them from an archive view
- **Search** — filter a board's tasks by title
- **Reordering** — reorder boards and tasks via move buttons
- **Validation** — request validation with `zod` on both client and server
- **Responsive UI** — Tailwind CSS with Radix UI / shadcn components

## Tech Stack

| Layer        | Technology                                                                 |
|--------------|----------------------------------------------------------------------------|
| Client       | React 19, React Router 7, Tailwind CSS, TanStack Query, Axios              |
| Client forms | react-hook-form, Zod (with `@hookform/resolvers`)                          |
| UI           | Radix UI (radix-ui), lucide-react, class-variance-authority, clsx          |
| Server       | Node.js (ESM), Express 5, MongoDB (Mongoose)                               |
| Auth         | bcrypt, jsonwebtoken, cookie-parser, cors                                  |
| Dev          | Vite, ESLint, nodemon                                                      |

## Project Structure

```
kanban-task-management/
├── my-client/          # React frontend (Vite + React Router)
│   ├── app/
│   │   ├── pages/      # Route pages: login, register, home
│   │   ├── components/  # Radix UI shadcn components
│   │   └── lib/        # API client, schemas, utils
│   ├── public/
│   └── Dockerfile
├── my-server/          # Express backend API
│   ├── src/
│   │   ├── models/     # Mongoose models: User, Board, Task, Comment
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/     # Express routers: auth, boards, tasks, comments, users
│   │   └── middleware/  # Auth protection middleware
│   └── config/         # MongoDB connection
└── package-lock.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) — a local instance or a MongoDB Atlas cluster

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/kanban-task-management.git
cd kanban-task-management
```

### 2. Set up the environment variables

**Server** — create `my-server/.env`:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
```

**Client** — create `my-client/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

### 3. Install dependencies

```bash
# Server
cd my-server
npm install

# Client
cd ../my-client
npm install
```

### 4. Run the development servers

```bash
# In one terminal — start the backend
cd my-server
npm run dev        # runs on http://localhost:5000
```

```bash
# In another terminal — start the frontend
cd my-client
npm run dev        # runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and sign up or log in.

## API

The backend exposes a REST API on `http://localhost:5000`. All routes (except registration and login) require a valid JWT in the `token` HTTP-only cookie.

| Method   | Endpoint                  | Description                          |
|----------|---------------------------|--------------------------------------|
| POST     | `/register`               | Register a new user                  |
| POST     | `/login`                  | Log in and set the JWT cookie        |
| POST     | `/logout`                 | Clear the JWT cookie                 |
| GET      | `/me`                     | Get the authenticated user          |
| GET      | `/boards`                 | List the user's boards               |
| POST     | `/boards`                 | Create a board                       |
| PUT      | `/boards/:id`             | Update a board                       |
| DELETE   | `/boards/:id`             | Delete a board                       |
| PUT      | `/boards/reorderBoard`    | Reorder boards                       |
| GET      | `/tasks`                  | List the user's tasks                |
| GET      | `/tasks/:boardId`         | List tasks for a board (supports `?search=<term>`) |
| GET      | `/tasks/archived/:boardId`| List archived tasks for a board      |
| POST     | `/tasks`                  | Create a task                        |
| PUT      | `/tasks/:id`              | Update a task                        |
| DELETE   | `/tasks/:id`              | Delete a task                        |
| PUT      | `/tasks/reorderTasks`     | Reorder tasks                        |
| GET      | `/comments/:taskId`       | List comments for a task             |
| POST     | `/comments`               | Create a comment                     |
| PUT      | `/comments/:id`           | Update a comment                     |
| DELETE   | `/comments/:id`           | Delete a comment                     |
| GET      | `/user`                   | List all users (used for assignment) |

## Building for Production

```bash
# Build the client
cd my-client
npm run build

# Start the production server
cd ../my-server
npm start
```

### Docker (client)

The client ships with a multi-stage Dockerfile:

```bash
cd my-client
docker build -t kanban-client .
docker run -p 3000:3000 kanban-client
```

## License

ISC
