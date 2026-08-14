# Kanban Task Management System

A full-stack project management tool with real-time task boards, role-based access control, and a modern UI.

![React](https://img.shields.io/badge/React-19.2-blue)
![React Router](https://img.shields.io/badge/React_Router-7.18-ff4500)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![Express](https://img.shields.io/badge/Express-5.1-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)

## Features

- **Authentication**: Register, login, logout with JWT + HTTP-only cookies
- **Board Management**: Create, rename, reorder, delete boards
- **Task Management**: Add, edit, archive, delete, reorder tasks within boards
- **Task Details**: Slide-out panel with title, description, assignee, comments, and board transfer
- **Comments**: Add and delete comments on tasks with activity log
- **Search**: Search tasks within a specific board
- **Role-Based Access**: Owner, Editor, and Viewer roles with granular permissions
- **Organization-Wide Boards**: All authenticated users see all boards, but only authorized users can edit
- **Responsive UI**: Mobile-friendly layout with Tailwind CSS v4 and shadcn/ui

## Tech Stack

### Frontend (`my-client/`)
- React 19 + React Router 7 (SSR)
- TanStack Query (React Query) for data fetching and caching
- Tailwind CSS v4 + shadcn/ui components
- React Hook Form + Zod validation
- Lucide icons

### Backend (`my-server/`)
- Express.js
- MongoDB with Mongoose ODM
- JWT authentication with HTTP-only cookies
- Role-based access control middleware
- Zod request validation

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd Kanban-Task-Management

# Install server dependencies
cd my-server
npm install

# Install client dependencies
cd ../my-client
npm install