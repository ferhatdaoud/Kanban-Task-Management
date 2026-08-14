# Kanban Task Management

A full-stack task management application built around the classic Kanban board workflow. Create boards, organize tasks, assign work, track progress, and collaborate with your team using role-based permissions.

## Features

### Current
- **Authentication** — Register, login, and logout with JWT stored in HTTP-only cookies
- **Boards** — Create, rename, and delete boards with progress tracking
- **Tasks** — Create, edit, archive, and delete tasks within boards
- **Subtasks & Due Dates** — Add subtasks and due dates to tasks
- **Task Assignment** — Assign tasks to specific users
- **Comments** — Post and manage comments on tasks
- **Search** — Filter tasks by title within a board
- **Reorder** — Move boards and tasks up/down to organize your workflow
- **Archive** — Archive completed tasks and restore them later
- **Role-based Access** — Three roles (`owner`, `editor`, `viewer`) with different permission levels
- **Responsive UI** — Built with Tailwind CSS and shadcn/ui components

### Coming Soon
- **Drag & drop** — Reorder tasks and boards by dragging
- **Labels & priorities** — Tag tasks with labels and set priority levels
- **Due date reminders** — Email or in-app notifications for upcoming deadlines
- **Activity log** — Track changes and updates across boards
- **Dark mode** — Toggle between light and dark themes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Vite, Tailwind CSS, TanStack Query |
| UI Components | shadcn/ui (Radix UI primitives, lucide-react icons) |
| Forms | react-hook-form + Zod |
| Backend | Node.js (ESM), Express 5 |
| Database | MongoDB via Mongoose |
| Auth | bcrypt, jsonwebtoken, cookie-parser, cors |

## Project Structure

```
kanban-task-management/
├── my-client/          # React frontend
│   ├── app/
│   │   ├── pages/      # Route pages
│   │   ├── components/ # UI components (shadcn/ui + custom)
│   │   └── lib/        # API client, schemas, utils
│   └── Dockerfile
├── my-server/          # Express backend
│   ├── src/
│   │   ├── models/     # Mongoose models
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/     # Express routers
│   │   ├── middleware/  # Auth middleware
│   │   └── utils/      # Shared utilities
│   └── server.js
```

## Prerequisites

- Node.js 20+
- npm
- MongoDB (local instance or MongoDB Atlas)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/kanban-task-management.git
cd kanban-task-management
```

### 2. Set up environment variables

**Server** — create `my-server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
PORT=5000
```

**Client** — create `my-client/.env`:

```env
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
# Terminal 1 — Backend
cd my-server
npm run dev
# → http://localhost:5000

# Terminal 2 — Frontend
cd my-client
npm run dev
# → http://localhost:5173
```

Open `http://localhost:5173`, create an account, and start building boards.

## Production

```bash
# Build the client
cd my-client
npm run build

# Start the server
cd my-server
npm start
```

## License

ISC
