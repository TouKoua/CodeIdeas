# CodeIdeas

A collaborative platform for developers to share coding project ideas, find teammates, and build together.

## Features

- **GitHub/Google OAuth Authentication** — Sign up and login with your GitHub/Google account
- **Create & Share Ideas** — Post coding project ideas with descriptions, technologies, difficulty level, and team size requirements
- **Team Collaboration** — Automatically create teams when ideas are posted
- **Join Requests** — Request to join projects and approve/reject requests from other developers
- **User Profiles** — Create and edit your profile with skills, bio, and avatar
- **Project Management** — View all your ideas, manage team memberships, and handle collaboration requests
- **Validation** — Smart validation prevents duplicate requests and joining full teams

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Auth)
- **Authentication:** GitHub OAuth via Supabase
- **Styling:** CSS

## Project Structure

```
src/
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── CreateIdea.tsx
│   ├── Project.tsx
│   ├── MyIdeas.tsx
│   ├── JoinRequests.tsx
│   ├── EditProfile.tsx
│   └── ProfilePage.tsx
├── components/         # Reusable components
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   └── ProjectCard.tsx
├── context/           # Context and hooks
│   ├── AuthContext.tsx
│   └── ProjectGetter.tsx
├── types/             # TypeScript interfaces
│   └── index.ts
├── services/          # API calls (future)
└── App.tsx            # Main app component
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- Supabase account
- GitHub OAuth app

### Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd CodeIdeas
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`

## Core Features Explained

### Authentication

- Users sign in with GitHub or Google OAuth
- Automatically creates a `user_profiles` record
- GitHub/Google `full_name` is parsed into `first_name` and `last_name`
- User data is cached in `AuthContext`

### Creating an Idea

1. User clicks "Create Idea"
2. Fills out form (title, description, technologies, difficulty, team size, etc.)
3. On submit:
   - Idea is created in the database
   - Team is automatically created for that idea
   - User is added as a "creator" member

### Join Requests

**Sending a request:**

- User views a project and clicks "Request to Join"
- Validation checks:
  - User is not already a member
  - User doesn't have a pending request
  - Team is not full
- If valid, join request is created with `status: pending`

**Approving a request:**

- Creator views incoming requests
- Clicks "Approve" → database function `approve_join_request()` runs:
  - Updates join request status to `approved`
  - Adds user to `team_members` table as a regular member
  - Sets `responded_at` timestamp

**Rejecting a request:**

- Creator clicks "Reject" → database function `reject_join_request()` runs:
  - Updates status to `rejected`
  - Sets `responded_at` timestamp

### Deleting an Idea

- User clicks delete button on `/my-ideas` page
- Confirmation dialog appears
- Database function `delete_idea()` runs:
  1. Deletes all join requests for the team
  2. Deletes all team members
  3. Deletes the team
  4. Deletes the idea
- All cascading deletes happen atomically

## Database Schema

### Tables

**user_profiles**

- `id` (UUID, PK) — Matches auth.users.id
- `first_name` (TEXT)
- `last_name` (TEXT)
- `bio` (TEXT)
- `avatar_url` (TEXT)
- `skills` (TEXT[])
- `created_at` (TIMESTAMP)

**ideas**

- `id` (UUID, PK)
- `title` (TEXT)
- `description` (TEXT)
- `creator_id` (UUID, FK → user_profiles)
- `category` (TEXT)
- `technologies` (TEXT[])
- `difficulty` (TEXT)
- `duration` (TEXT)
- `github_link` (TEXT)
- `status` (TEXT)
- `created_at` (TIMESTAMP)

**teams**

- `id` (UUID, PK)
- `idea_id` (UUID, FK → ideas)
- `name` (TEXT)
- `team_size` (INT) — Max team size
- `created_at` (TIMESTAMP)

**team_members**

- `id` (UUID, PK)
- `team_id` (UUID, FK → teams)
- `user_id` (UUID, FK → user_profiles)
- `role` (TEXT) — "creator" or "member"
- `joined_at` (TIMESTAMP)

**join_requests**

- `id` (UUID, PK)
- `team_id` (UUID, FK → teams)
- `user_id` (UUID, FK → user_profiles)
- `status` (TEXT) — "pending", "approved", "rejected"
- `request_message` (TEXT)
- `requested_at` (TIMESTAMP)
- `responded_at` (TIMESTAMP, nullable)

## Database Functions

### `delete_idea(idea_id uuid)`

Cascades deletion: deletes join requests → team members → team → idea

### `approve_join_request(request_id uuid)`

Updates join request status and adds user to team_members

### `reject_join_request(request_id uuid)`

Updates join request status to rejected

## Edge Functions

### `/functions/delete-account`

Deletes user's account:

1. Deletes all user's ideas (via `delete_idea`)
2. Deletes user profile
3. Deletes auth user

## API Routes

| Route            | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `/`              | Landing page                               |
| `/login`         | GitHub OAuth login                         |
| `/dashboard`     | User dashboard with quick links            |
| `/create-idea`   | Create new project idea                    |
| `/my-ideas`      | View all user's ideas                      |
| `/project/:id`   | View project details + request to join     |
| `/join-requests` | Manage join requests (incoming + outgoing) |
| `/edit-profile`  | Edit user profile                          |

## Validation & Edge Cases

- **Duplicate join requests:** Users can't request to join a team they already have a pending request for
- **Already a member:** Users can't request to join teams they're already members of
- **Team full:** Users can't request to join teams at max capacity
- **Creator restrictions:** Only creators can approve/reject requests for their teams
- **RLS Policies:** Database enforces security at the row level

## Known Limitations & Future Improvements

### Current (MVP)

- ✅ Basic collaboration via join requests
- ✅ Manual team management (no direct invitations)
- ✅ No messaging/chat
- ✅ No notifications

## Contributing

(Add your contribution guidelines here when ready)

## License

(Add your license here)
