# Product Admin Dashboard

A small admin dashboard to log in and manage products, built on top of the free [DummyJSON](https://dummyjson.com) API.

**Live demo:** _add your Vercel/Netlify link here_
**Repo:** _add your GitHub repo link here_

## Tech stack

- React 19 + Vite
- React Router v7 (routing + URL state)
- Axios (all API calls, one shared instance)
- Tailwind CSS

No React Query / SWR / table or pagination library — data fetching, caching-in-memory, pagination and sorting logic are hand-written.

## Setup

```bash
git clone <repo-url>
cd "Product Admin Dashboard/client"
npm install
npm run dev
```

App runs at `http://localhost:5173`. Log in with:

- **Username:** `emilys`
- **Password:** `emilyspass`

Optional `.env` in `client/` (defaults to `https://dummyjson.com` if not set):

VITE_API_BASE_URL=https://dummyjson.com

## What's finished

- **Auth** — login against `POST /auth/login`, wrong-credentials error shown on the form, token stored in a cookie, user profile cached in `localStorage`. Product routes are protected (`RequireAuth`); the login page redirects away if already logged in (`RequireGuest`); logout button in the navbar.
- **Product list** — table on desktop, cards on mobile; shows image, title, category, price, rating, stock.
- **Pagination** — page-by-page fetch using `limit`/`skip`, page-number buttons, Previous/Next, page size selector (10/20/50), and a "Showing X–Y of Z" summary.
- **Search** — debounced (400ms) call to `/products/search?q=`, resets to page 1 on change, old in-flight requests are cancelled so a slow response can never overwrite a newer one.
- **Filter & sort** — category filter via `/products/categories`, sort by price/rating/title with asc/desc order.
- **Product details** — `/products/:id` page with images, description, price, reviews; a "not found" state for bad or missing ids.
- **Add / edit / delete** — validated form (title, description, category, price, stock, thumbnail URL) shared between add and edit; confirm dialog before delete.
- **Loading / empty / error states** — spinner while loading, empty message when nothing matches, error message with a Retry button on failure.
- **URL as source of truth** — page, pageSize, q, category, sortBy and order all live in the query string, so refreshing or sharing the link reproduces the same view.
- **Shared Axios instance** (`src/lib/axios.js`) — request interceptor attaches the token to every call, response interceptor centralizes error handling and logs the user out on a `401`.

## Notes on a few tricky requirements

**Search vs. category filter.** DummyJSON can't search and filter by category at the same time, so search takes priority: typing a query clears/disables the category filter (the dropdown shows "disabled while searching" instead of silently dropping the value). This keeps the behaviour visible to the user instead of surprising them.

**Add/edit/delete aren't really persisted by the API.** DummyJSON's `POST /products/add`, `PUT /products/:id` and `DELETE /products/:id` return a fake success response without actually storing anything. To still make the app feel real, changes are tracked client-side in `localStorage` (`src/lib/localOverrides.js`):
- new products get a negative id (so they never collide with real ids) and are prepended to page 1;
- edits are stored as a small per-id patch and merged onto whatever the API returns;
- deletes are recorded as an id to filter out of every future response.

This layer is applied on top of every `fetchProducts`/`fetchProductById` result, so changes survive a page refresh even though the backend itself never changes.

**Fast typing / stale responses.** Every list fetch uses an `AbortController`; starting a new request cancels the previous one, and a cancelled request's result is ignored instead of overwriting the current state. Verified by appending `&delay=2000` to the API calls and typing quickly.

**Bad URL values.** `?page=abc` falls back to page 1 (`parseInt` + `Number.isFinite` guard); `?page=999` (beyond the last real page) gets clamped back to the last valid page once the total count is known, instead of showing a blank screen.

**Double-submits.** Login and Save buttons track a `submitting` flag — the handler bails out and the button disables itself while a request is in flight, so repeated clicks don't fire duplicate requests.
