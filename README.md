# Quiz App

A small React + Vite application for creating and taking quizzes.

## Features

- Quiz builder and preview
- Authentication (login/signup)
- Dashboard and quiz summary

## Getting started

Prerequisites: Node.js 18+ and npm.

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Deploy (uses `gh-pages`):

```bash
npm run deploy
```

## API configuration

The frontend uses `src/api/axios.js` which sets the default `baseURL` to `http://localhost:8000`.
If your backend runs elsewhere, update the `baseURL` in `src/api/axios.js` or replace it with an environment variable.

Key API files:

- `src/api/axios.js` — shared Axios instance with request/response interceptors
- `src/api/authService.js` — authentication calls (`registerUser`, `loginUser`, `getMe`)

## Authentication flow

- The backend generates JWT tokens on `POST /api/auth/login` and returns the token in the response (property `token`).
- On successful login the app stores the token and user in `localStorage`:
	- `localStorage.setItem('token', res.token)`
	- `localStorage.setItem('user', JSON.stringify(res))`
- The Axios request interceptor automatically attaches the token as `Authorization: Bearer <token>` to outgoing requests.
- The Axios response interceptor handles `401` responses by clearing `localStorage` and redirecting to `/`.

Files to inspect for auth behavior:

- `src/context/AuthContext.jsx` — `login`, `logout`, and session restore logic
- `src/api/authService.js` — wrapper around auth API endpoints

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle
- `npm run preview` — preview production bundle
- `npm run lint` — run ESLint
- `npm run deploy` — publish `dist` to GitHub Pages

## Useful locations

- App entry: `src/main.jsx`
- Global styles: `src/styles/styles.css`
- Components: `src/components/`

## Notes

- Tokens are currently stored in `localStorage`.
	- For better security, consider storing short-lived access tokens in memory and refresh tokens in a secure, httpOnly cookie on the backend.
- Update `src/api/axios.js` to use an environment variable for the API base URL before deploying to production.

If you'd like, I can also add environment variable support for the API URL and update the code accordingly.
