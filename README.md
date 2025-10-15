This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# bare-metal-nextjs-management-console
bare-metal-nextjs-management-console

# Auth scaffolding notes (client-side)

- Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`, e.g.

```
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.161:30880/gr-bmc
```

- Login endpoint:
  - `POST /login` with payload `{ username, password }`.
  - Response should return a JWT token (supported keys: `token`, `jwt`, `access_token`, `data.token`, or raw string).

- Auth storage:
  - Token is stored in `localStorage` key `auth_token`.
  - `AuthProvider` exposes `useAuth()` with `{ token, isAuthenticated, login, logout }`.

- Protected routes:
  - Example client-gated page: `/dashboard` redirects to `/login?next=/dashboard` if unauthenticated.

- Pages:
  - `/login` client form posts directly to backend and saves token on success.
  - `/signup` optional; remove if not needed.

- Notes:
  - No server actions, no cookies, no middleware. Pure client-side auth for compatibility with external Go backend.