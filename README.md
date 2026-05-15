# Workspace

A clean, minimal workspace app — a Notion/Linear/ClickUp-adjacent portfolio piece. Built with Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS v4, IBM Plex Sans, and Zustand for client state.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's in here

- **Home, Timesheet, Goals** → tasteful "Coming soon" empty states.
- **Inbox** → split-pane email-style list with detail view. Time-grouped, corporate-context messages.
- **Teams** → full member directory with All / Active / Inactive / Pending Invitation tabs.
- **Team homepage** (e.g. `/teams/engineering`) → task detail view with inline task creation, editable title, metadata (priority / due / tags / docs), description, an Activities feed with a connecting timeline thread, and an interactive Comments thread.
- **Empty team state** → when a team has no tasks, the Overview tab shows the full task form with placeholder labels ("Enter a Subject", "Type here", "Add"). The right rail shows a single system Activity for the team's creation.
- **Create team modal** → opens from the `+` icon next to TEAMS in the sidebar. Name, auto-derived initial, private toggle. Creates the team in state and navigates to its empty Overview.
- **Notifications panel** → opens from the bell icon in the top bar. All / Unread tabs with counts, in-panel search, time-grouped entries (Today / Yesterday / Last 7 days / Older). Five notification types (New Comment, New Reply, Mentioned you, Task Assigned, Status Changed). Click a notification to mark it read and jump to the related task.
- **Search modal** → opens from the search icon in the top bar. Live-filtering across Contacts, Documents, Links, and Teams. Removable filter chips, per-row dismiss (resets on next query), and an "Open Search Page" stub link.
- **Docs** → file repository list with type-coded icons.
- **Account dropdown** → workspace switcher with Switch Account, Create new, Account, Upgrade, Ask a question, Help topics, Share Feedback, Light/Dark mode toggle, Log out.

## Design decisions

- **Type system:** IBM Plex Sans across the entire UI. Loaded locally from `public/fonts/`.
- **Light/Dark mode:** Manual toggle in the account dropdown, persisted to `localStorage` via `next-themes`. Smooth 200ms transition.
- **Sidebar:** Collapsible to icons only on desktop (click the panel-left icon top-left). Becomes a drawer on mobile.
- **Responsive:** Mobile-first breakpoints. Inbox stacks list → detail on mobile and tablets, splits on desktop. Tables in Teams hide secondary columns on small screens.
- **State:** Zustand store, persisted to `localStorage` so task additions and comments survive a refresh. No backend.

## Project structure

```
src/
├── app/
│   ├── layout.tsx                ← sidebar + theme shell
│   ├── globals.css               ← tokens, font-faces, base styles
│   ├── page.tsx                  ← Home (empty state)
│   ├── inbox/page.tsx
│   ├── teams/page.tsx
│   ├── teams/[teamId]/page.tsx   ← team homepage with task detail
│   ├── docs/page.tsx
│   ├── timesheet/page.tsx        ← empty state
│   └── goals/page.tsx            ← empty state
├── components/
│   ├── sidebar.tsx               ← workspace switcher + nav + teams
│   ├── top-bar.tsx
│   ├── theme-provider.tsx
│   ├── letter-avatar.tsx
│   ├── pill.tsx
│   ├── priority-pill.tsx
│   ├── doc-icon.tsx
│   └── empty-state.tsx
├── data/
│   ├── workspace.ts              ← workspace + currentUser + teams
│   ├── members.ts
│   ├── docs.ts
│   ├── inbox.ts                  ← 23 contextual emails
│   └── tasks.ts                  ← seeded tasks per team
└── lib/
    ├── types.ts
    ├── store.ts                  ← zustand
    ├── utils.ts
    └── inbox-utils.ts            ← time-bucketing
```

## Notes for the portfolio reviewer

This is a portfolio piece, so the focus is on UI polish and interaction quality rather than backend correctness. All data is seeded locally; no auth, no real email, no real-time sync. The interactions that *do* exist (creating a task, posting a comment, toggling theme, collapsing the sidebar) are real and feel responsive.

## License

Personal portfolio piece. IBM Plex Sans is licensed under the SIL Open Font License.
