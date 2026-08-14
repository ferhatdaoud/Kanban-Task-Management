# Kanban Task Management

A full-stack task management app built around the classic Kanban board idea — boards, tasks, subtasks, due dates, comments, and the ability to assign work to other people. It's been running fine for a while, though like any side project it has a few rough edges worth knowing about upfront.

## Tech stack

**Frontend:** React 19 with React Router 7 (SSR enabled), Vite, Tailwind CSS, and shadcn/ui for the UI bits. I used TanStack Query for server state, react-hook-form + Zod for forms, and Axios for requests.

**Backend:** Express 5 on Node.js (ESM only), MongoDB via Mongoose. Auth uses bcrypt + JWT stored in HTTP-only cookies.

## What it does

- Register / login / logout with cookie-based JWT auth
- Create and manage boards with progress tracking
- Add tasks with subtasks, due dates, and assignment to users
- Comments on tasks with a slide-over detail view
- Archive completed tasks and bring them back when needed
- Search tasks within a board
- Reorder boards and tasks without fighting array indices
- Role-based access (`owner`, `editor`, `viewer`) so you can share boards

## A few things worth knowing

The repo is technically a monorepo, but the two packages (`my-client` and `my-server`) don't actually share a root `package.json`. That means you `npm install` and `npm run dev` separately for each. I should probably fix that someday.

Also, `connectDB()` gets called twice in `server.js` — harmless because Mongoose caches the connection, but not my finest moment. The RBAC helpers are duplicated between the board and task controllers instead of being a shared middleware. None of these are showstoppers, just things I noticed while writing this.

## Getting it running

### Prerequisites

- Node.js 20+
- npm
- MongoDB (local or Atlas)

### Setup

**Server:**
```bash
cd my-server
npm install
```

Create a `.env` file:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
```

Then start it:
```bash
npm run dev
# runs on http://localhost:5000
```

**Client:**
```bash
cd my-client
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000
```

Then start it:
```bash
npm run dev
# runs on http://localhost:5173
```

Open `http://localhost:5173`, sign up, and start adding boards.

## Production

Build the client:
```bash
cd my-client
npm run build
```

Start the server:
```bash
cd my-server
npm start
```

The client also has a multi-stage Dockerfile if that's your thing.

## License

ISC
