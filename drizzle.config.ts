import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema.ts', // Adjust if path differs
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});