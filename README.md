# Workspace

A clean, minimal workspace app — a Notion/Linear/ClickUp-adjacent portfolio piece. Built with Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS v4, IBM Plex Sans, and Zustand for client state.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's in here

- **Home, Timesheet, Goals** → tasteful "Coming soon" empty states (placeholder routes).
- **Inbox** → split-pane email-style list with detail view. Time-grouped (Today / Last 7 days / month names). Corporate-context placeholder messages. Mobile collapses to list-then-detail navigation.
- **Teams** → full member directory with All / Active / Inactive / Pending Invitation tabs.
- **Team homepage** (e.g. `/teams/engineering`) → task detail view with inline task creation, editable title, metadata (priority / due / tags / docs), description, an Activities feed and an interactive Comments thread. The other tabs (Getting Started, Board, List View) render polished "Coming soon" inline states.
- **Docs** → file repository list with type-coded file icons.
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
