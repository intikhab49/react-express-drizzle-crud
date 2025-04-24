SimpleCRUD
SimpleCRUD is a RESTful API built with Express.js and TypeScript, using Neon PostgreSQL for data storage and Drizzle ORM for type-safe database interactions. It supports user authentication and CRUD operations for items, with session-based authentication managed via a PostgreSQL session table.
Features

Authentication: Register, login, logout, and retrieve user data.
CRUD Operations: Create and list items.
Database: Neon PostgreSQL with users, items, and session tables.
ORM: Drizzle ORM with schema defined in shared/schema.ts.
Routes:
POST /api/register: Create a new user.
POST /api/login: Authenticate and start a session.
POST /api/logout: Clear the session.
GET /api/user: Retrieve authenticated user data.
GET /api/items: List all items.
POST /api/items: Create a new item.



Project Structure
SimpleCRUD/
├── server/
│   ├── auth.ts       # Authentication logic (register, login, logout)
│   ├── db.ts         # Database connection setup
│   ├── index.ts      # Express app setup and middleware
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database queries
│   ├── vite.ts       # Vite configuration (likely for frontend/dev)
├── shared/
│   ├── schema.ts     # Drizzle schema for users, items, session
├── migrations/       # Drizzle migration files
├── drizzle.config.ts # Drizzle migration configuration
├── .env              # Environment variables (DATABASE_URL, SESSION_SECRET)
├── .gitignore        # Git ignore file
├── package.json      # Dependencies and scripts
├── README.md         # This file

Database Schema
Defined in shared/schema.ts:
// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Items
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Session
export const session = pgTable('session', {
  sid: text('sid').primaryKey(),
  sess: text('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

Prerequisites

Node.js (v18 or higher)
npm
PostgreSQL client (psql) for manual database access
Neon account for database hosting (Neon Console)

Setup Instructions

Clone the Repository:
git clone https://github.com/intikhab49/SimpleCRUD.git
cd SimpleCRUD


Install Dependencies:
npm install


Configure Environment:Create a .env file in the root directory:
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
SESSION_SECRET=your_secure_secret_here


Apply Database Migrations:
npx drizzle-kit generate
npx drizzle-kit push


Run the Application:
npm run dev

The API will be available at http://localhost:5000.

Test Routes:
# Register a user
curl -X POST http://localhost:5000/api/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass"}'
# Login and save session cookie
curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass"}' -c cookies.txt
# Create an item
curl -X POST http://localhost:5000/api/items -H "Content-Type: application/json" -b cookies.txt -d '{"name":"Test Item","description":"A sample item"}'
# List items
curl -X GET http://localhost:5000/api/items -b cookies.txt
# Get user data
curl -X GET http://localhost:5000/api/user -b cookies.txt
# Logout
curl -X POST http://localhost:5000/api/logout -b cookies.txt



Development Challenges and Solutions
The project faced several issues during development, resolved as follows:

Database Connectivity:

Issue: Failed to connect to Neon PostgreSQL database.
Fix: Configured direct connection string in .env and verified with psql.


Missing Tables:

Issue: users and items tables missing, causing 500 errors (e.g., relation "users" does not exist).
Fix: Manually created tables via psql, later managed with Drizzle migrations:CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);




Drizzle Migration Issues:

Issue: npx drizzle-kit generate failed due to incorrect schema path; migrations omitted session table.
Fix: Updated drizzle.config.ts to point to shared/schema.ts, added session table to schema, and applied migrations:npx drizzle-kit generate
npx drizzle-kit push




Authentication Errors:

Issue: 401 Not authenticated errors for /api/user and /api/items.
Fix: Implemented session-based authentication using express-session with connect-pg-simple, generated cookies via /api/login, and used them for protected routes.


Dependency Installation:

Issue: ENOTEMPTY error during npm install for class-variance-authority.
Fix: Cleared node_modules and cache:rm -rf node_modules package-lock.json
npm cache clean --force
npm install




Schema Mismatch:

Issue: users table lacked created_at in schema compared to early manual setups.
Fix: Noted application worked without created_at; provided option to add it via schema update and migrations.


Browserslist Warning:

Issue: Outdated browserslist data warning during npm run dev.
Fix: Updated with:npx update-browserslist-db@latest





Troubleshooting

Connection Issues: Verify DATABASE_URL in .env and network connectivity to Neon.
Migration Errors: Ensure drizzle.config.ts points to shared/schema.ts and run npx drizzle-kit push.
Authentication Errors: Check session cookies (cookies.txt) and ensure /api/login is called before protected routes.
Push Errors: Resolve Git conflicts with git pull origin main or force push cautiously (git push --force).

Next Steps

Add created_at to users:Update shared/schema.ts:
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

Apply migrations:
npx drizzle-kit generate
npx drizzle-kit push


Enhance Security:

Use HTTPS and set cookie: { secure: true } in production.
Ensure passwords are hashed (likely using bcrypt in server/auth.ts).
Validate inputs with zod (already used in schema).


Frontend Integration:

Leverage server/vite.ts to build a React frontend consuming the API.


Testing:

Add Jest and Supertest for route testing:npm install --save-dev jest supertest




Deployment:

Deploy to Vercel or Railway, ensuring .env is configured securely.


Monitoring:

Use Neon’s monitoring tools or integrate Prometheus for performance metrics.



References

Neon Documentation
Drizzle ORM
Express Session
Connect PG Simple

License
This project is licensed under the MIT License.
