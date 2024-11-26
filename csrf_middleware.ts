// lib/csrf.js (or lib/csrf.ts)
import { nextCsrf } from 'next-csrf';

const { csrf, setup } = nextCsrf({
  secret: process.env.CSRF_SECRET,  // Ensure you have a secret set in your environment
});

export { csrf, setup };
