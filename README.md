<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:431407,50:EA580C,100:FDBA74&height=170&section=header&text=Full-Stack%20TypeScript%20CRUD&fontSize=44&fontColor=ffffff&fontAlignY=38&desc=React%20%C2%B7%20Express%20%C2%B7%20Drizzle%20ORM%20%C2%B7%20Neon%20PostgreSQL&descSize=17&descAlignY=60&animation=fadeIn" width="100%" alt="Full-stack TypeScript CRUD — React, Express, Drizzle ORM, Neon PostgreSQL"/>

# Full-Stack TypeScript CRUD App with Authentication — React, Express, Drizzle ORM & Neon Postgres

**A type-safe starter for real apps: session-based login with Passport, a PostgreSQL-backed session store, Drizzle migrations, and a React dashboard to create, edit, filter and delete items.**

<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Drizzle%20ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM"/>
  <img src="https://img.shields.io/badge/Neon%20Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon PostgreSQL"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
</p>

</div>

---

## ✨ Features

- 🔐 **Authentication** — register, login, logout and current-user endpoints with **Passport (local strategy)**
- 🧂 **Secure password hashing** — Node `crypto.scrypt` with per-user salt and timing-safe comparison
- 🗄️ **Postgres session store** — sessions persisted in a `session` table via `connect-pg-simple`
- 📦 **Full CRUD for items** — create, list, view, update and delete
- 🧬 **End-to-end type safety** — one Drizzle schema in `shared/schema.ts` shared by server and client, validated with Zod
- 🖥️ **React dashboard** — protected routes, item cards, create/edit modal, filter bar, delete confirmation, toasts, loading and empty states
- ⚡ **Vite + Express in one process** for development, bundled with esbuild for production

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph CLIENT["React + Vite client"]
        AUTH["auth-page"] --> DASH["dashboard<br/>(protected route)"]
        DASH --> RQ["TanStack Query"]
    end
    RQ -->|"fetch + session cookie"| API
    subgraph SERVER["Express API :5000"]
        API["routes.ts<br/>/api/items"] --> ST["storage.ts"]
        PASS["auth.ts · Passport<br/>/api/register · /login · /logout · /user"]
    end
    ST -->|"Drizzle ORM"| DB[("Neon PostgreSQL<br/>users · items · session")]
    PASS --> DB
```

## 🚀 Getting started

**Prerequisites:** Node.js 18+, npm and a PostgreSQL database (a free [Neon](https://neon.tech) project works well).

```bash
git clone https://github.com/intikhab49/react-express-drizzle-crud.git
cd react-express-drizzle-crud
npm install
```

Create a `.env` file in the project root with **your own** values:

```ini
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
SESSION_SECRET=a-long-random-string
```

```bash
npx drizzle-kit generate
npx drizzle-kit push
npm run dev
```

The app and API are served at **http://localhost:5000**.

## 📡 API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | — | Create a user and start a session |
| POST | `/api/login` | — | Log in |
| POST | `/api/logout` | — | End the session |
| GET | `/api/user` | ✔ session | Current user (401 if not logged in) |
| GET | `/api/items` | — | List items |
| GET | `/api/items/:id` | — | Get one item |
| POST | `/api/items` | — | Create an item |
| PUT | `/api/items/:id` | — | Update an item |
| DELETE | `/api/items/:id` | — | Delete an item |

> [!NOTE]
> The dashboard is a protected route on the client, but the `/api/items` endpoints don't check the session on the server yet. Add a `req.isAuthenticated()` guard before exposing this publicly.

<details>
<summary><b>Try it with curl</b></summary>

```bash
curl -X POST http://localhost:5000/api/register -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"testpass"}' -c cookies.txt
curl -X POST http://localhost:5000/api/items -H "Content-Type: application/json" -b cookies.txt \
     -d '{"name":"Test Item","description":"A sample item"}'
curl http://localhost:5000/api/items -b cookies.txt
curl -X PUT http://localhost:5000/api/items/1 -H "Content-Type: application/json" -b cookies.txt \
     -d '{"name":"Renamed item"}'
curl -X DELETE http://localhost:5000/api/items/1 -b cookies.txt
curl -X POST http://localhost:5000/api/logout -b cookies.txt
```

</details>

## 🗄️ Database schema

```ts
// shared/schema.ts
users   (id serial PK, username text unique, password text)
items   (id serial PK, name text, description text, created_at timestamp default now())
session (sid text PK, sess text, expire timestamp)
```

## 🧯 Lessons learned

| Problem | Fix |
|---|---|
| Couldn't connect to Neon | Use the direct connection string with `sslmode=require` and verify it with `psql` first |
| `relation "users" does not exist` (500s) | Tables weren't created — generate and push Drizzle migrations before starting the server |
| `drizzle-kit generate` skipped tables | Point `drizzle.config.ts` at the correct schema path and include the `session` table in the schema |

## 🗂️ Project structure

```
client/src/
├── pages/        # auth-page · dashboard · home · not-found
├── components/   # ItemCard · ItemFormModal · FilterBar · DeleteConfirmModal · Navbar · toasts
├── hooks/        # use-auth · use-toast · use-mobile
└── lib/          # protected-route · queryClient · types
server/           # index · auth · routes · storage · db · vite
shared/schema.ts  # Drizzle schema + Zod validators
migrations/       # Drizzle migrations
```

---

<div align="center">

**Built by [Intikhab Azam](https://github.com/intikhab49)** — AI & automation engineer · full-stack TypeScript · backend

<sub>Keywords: full-stack TypeScript · React Express CRUD · Drizzle ORM tutorial · Neon serverless Postgres · Passport authentication · session auth · connect-pg-simple · TanStack Query · Tailwind CSS · Vite</sub>

</div>
