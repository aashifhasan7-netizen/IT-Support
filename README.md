# IT Support Ticket & Helpdesk System

A complete, production-quality **IT Support Ticket & Helpdesk System** built with React.js. This internal company portal allows employees to submit IT support tickets and support engineers to track, assign, and resolve issues efficiently.

---

## 🩹 Changelog — Bug Fixes & Polish

A review pass was done across the whole codebase (type-checked with `tsc --noEmit`, verified with a production `vite build`). The following real bugs were found and fixed, plus a couple of small branding cleanups:

| # | Area | Issue | Fix |
|---|------|-------|-----|
| 1 | `src/index.css` | The brand-color comment contained the text `bg-blue-*/text-blue-*`. CSS treats `*/` as "end of comment" wherever it appears, so the comment closed early and leaked raw prose into the compiled stylesheet (visible as a build warning, and technically invalid CSS shipped to production). | Reworded the comment to avoid any `*/` sequence. Build now has zero warnings. |
| 2 | `src/services/apiClient.ts` | The Axios response interceptor redirected to `/login` on **any** 401 response — including a wrong-password response from the login endpoint itself. Result: entering the wrong password triggered a jarring full-page reload instead of the inline "Invalid email or password" message. | Excluded the `/auth/login` endpoint from the automatic redirect, and skip the redirect if already on `/login`. |
| 3 | `src/components/layout/Sidebar.tsx` | "My Tickets" and "Create Ticket" both showed as active in the sidebar when viewing the Create Ticket page, because `/employee/tickets/create` is nested under `/employee/tickets` and React Router's default `NavLink` matching is prefix-based. | Replaced default matching with a "most specific match" calculation, so only one nav item highlights at a time — while still keeping "My Tickets" highlighted on a ticket-detail sub-page. |
| 4 | `src/pages/Support/Reports/ReportsPage.tsx` | The priority pie chart's color array didn't match the data's `Low → Medium → High → Critical` order, so **Low priority rendered red** and **Critical rendered green** — the opposite of the color meaning used everywhere else in the app (badges, filters). Misleading for a support-triage tool. | Reordered `COLORS` to match severity conventions (green → blue → orange → red). |
| 5 | `src/pages/Support/TicketDetails/SupportTicketDetails.tsx`, `src/mocks/handlers/tickets.ts`, `src/types/ticket.ts` | The "Department" field on the ticket detail sidebar was permanently hardcoded to `—`, even though every user record has a real `department` value. | The mock API now resolves and attaches `createdByDepartment` from the user directory on every ticket response, and the UI displays it. |
| 6 | `src/pages/Login/LoginPage.tsx`, `src/context/AuthContext.tsx` | An already-authenticated user (e.g. a restored session on refresh) landed back on the login form when visiting `/` or `/login` instead of being sent to their dashboard. Also, the post-login redirect read the just-logged-in user back out of `localStorage` immediately after `login()`, which is a fragile pattern (relies on a synchronous write that happens to already be there). | Added an auth-aware redirect on the login page. `login()` in `AuthContext` now returns the freshly authenticated `User` directly, so the login page uses that instead of re-reading `localStorage`. |
| 7 | `public/favicon.svg` | The favicon was a leftover generic AI-builder logo mark, inconsistent with the app's actual indigo "headphones" brand identity used on the login screen and sidebar. | Replaced with an on-brand favicon using the same headphones glyph and indigo gradient. |
| 8 | `src/assets/` | `hero.png`, `vite.svg`, and `typescript.svg` were unused leftover template assets not referenced anywhere in the app. | Removed. |

---

## ✨ Features

### Employee
- Submit hardware/software issue tickets with priority classification
- Real-time ticket tracking and status updates
- View personal ticket history with search and filters
- View detailed ticket progress timeline

### Support Engineer
- View and manage the full ticket queue
- Advanced search and filtering (status, priority, category, assignee)
- Assign and reassign tickets to engineers
- Change ticket status (Open → In Progress → Resolved)
- Add resolution notes when resolving tickets
- View real-time dashboard statistics
- View reports with charts

### General
- Role-based access control (RBAC) — strict separation between Employee and Support Engineer views
- Professional toast notifications for all actions
- Responsive design — works on mobile, tablet, and desktop
- Skeleton loading states, empty states, error states
- Animated UI with Framer Motion

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React.js 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Mock API | Mock Service Worker (MSW) v2 |
| Icons | Lucide React |
| Animation | Framer Motion |
| Charts | Recharts |
| Toasts | React Hot Toast |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs at **http://localhost:5173**

---

## 👤 Demo Accounts

### Employee
| Field | Value |
|-------|-------|
| Email | `employee@demo.com` |
| Password | `employee123` |

### Support Engineer
| Field | Value |
|-------|-------|
| Email | `support@demo.com` |
| Password | `support123` |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/             # Reusable UI primitives (Button, Input, Modal, etc.)
│   ├── layout/         # App shell (Sidebar, Navbar, AppLayout)
│   ├── tickets/        # Ticket-specific components (table, card, timeline, modals)
│   └── dashboard/      # Dashboard components (StatCard)
│
├── pages/
│   ├── Login/          # Login page
│   ├── Employee/       # Employee portal pages
│   └── Support/        # Support engineer portal pages
│
├── services/           # Axios API service layer
│   ├── apiClient.ts    # Centralized Axios instance
│   ├── authService.ts
│   ├── ticketService.ts
│   ├── userService.ts
│   └── dashboardService.ts
│
├── mocks/              # MSW mock API
│   ├── data/           # Mock data (tickets, users)
│   └── handlers/       # MSW request handlers
│
├── context/            # React contexts
│   └── AuthContext.tsx # Authentication state & RBAC
│
├── routes/             # Route guards
│   ├── ProtectedRoute.tsx
│   └── RoleRoute.tsx
│
├── types/              # TypeScript type definitions
├── utils/              # Utilities (permissions, date formatting)
└── App.tsx             # Root with routing and providers
```

---

## 🔌 Mock API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/tickets` | Get all tickets (support only) |
| `GET` | `/api/tickets/my` | Get employee's own tickets |
| `GET` | `/api/tickets/:id` | Get ticket by ID |
| `POST` | `/api/tickets` | Create new ticket |
| `PATCH` | `/api/tickets/:id/assign` | Assign/reassign ticket |
| `PATCH` | `/api/tickets/:id/status` | Update ticket status |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/engineers` | Get support engineers |
| `GET` | `/api/dashboard/employee` | Employee dashboard stats |
| `GET` | `/api/dashboard/support` | Support dashboard stats |

---

## 🔐 Application Routes

```
/login

/employee/dashboard          — KPI overview + recent tickets
/employee/tickets            — My tickets with search/filter
/employee/tickets/create     — Create new ticket
/employee/tickets/:id        — Ticket detail + timeline
/employee/profile            — Profile page

/support/dashboard           — Operations overview + statistics
/support/tickets             — Full ticket queue with filters
/support/tickets/:id         — Ticket detail with actions
/support/assigned            — Engineer's assigned tickets
/support/reports             — Charts and statistics
/support/profile             — Profile page
```

---

## 🏗 Deployment

### Vercel / Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Environment Variables
Copy `.env.example` to `.env` and configure as needed.

---

## 📤 Pushing This Project to GitHub

If this project isn't in a Git repository yet, run these from the `website/` folder (where `package.json` lives):

```bash
# 1. Initialize git (skip if already a repo)
git init

# 2. Stage and commit everything
git add .
git commit -m "Initial commit: IT Support Ticket & Helpdesk System"

# 3. Set the default branch name (optional, common convention)
git branch -M main

# 4. Create an empty repo on GitHub first (via github.com → New repository),
#    then link it as the remote — replace with your own repo URL
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 5. Push
git push -u origin main
```

**If the repo already exists locally and just needs a push:**
```bash
git add .
git commit -m "Describe your changes here"
git push
```

**Notes:**
- `.gitignore` already excludes `node_modules/`, `dist/`, and `.env` — you won't accidentally commit build output or secrets.
- Use a GitHub [Personal Access Token](https://github.com/settings/tokens) as your password if prompted during `git push` and you haven't set up SSH — GitHub no longer accepts account passwords over HTTPS.
- Prefer SSH? Use `git remote add origin git@github.com:<your-username>/<your-repo-name>.git` instead, after adding your public key at [github.com/settings/keys](https://github.com/settings/keys).

---

## 📝 Business Rules

- **Employees** can only create and view their own tickets
- **Employees** cannot access Support Engineer routes — redirected to their dashboard
- **Support Engineers** can view all tickets and manage them
- Ticket workflow: **Open → In Progress → Resolved**
- A **resolution note** is required before a ticket can be resolved
- Reassigning a ticket logs an activity entry in the timeline
