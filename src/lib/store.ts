"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Task,
  Comment,
  Activity,
  Team,
  Notification,
  PersonAccess,
  SharePermission,
  InboxReply,
} from "@/lib/types";
import { seedTasks } from "@/data/tasks";
import { teams as seedTeams } from "@/data/workspace";
import { notifications as seedNotifications } from "@/data/notifications";

type AppState = {
  tasks: Task[];
  teams: Team[];
  notifications: Notification[];
  selectedTaskByTeam: Record<string, string | null>;
  selectedInboxId: string | null;
  /** Replies the user has added to inbox items. Indexed by inbox item id. */
  inboxRepliesByItemId: Record<string, InboxReply[]>;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;

  // teams
  addTeam: (input: {
    name: string;
    initial: string;
    locked: boolean;
  }) => string;
  updateTeamColor: (teamId: string, color: string | undefined) => void;
  renameTeam: (teamId: string, name: string) => void;

  // tasks
  addTask: (teamId: string, title: string, createdBy: string) => string;
  selectTask: (teamId: string, taskId: string | null) => void;
  updateTaskTitle: (taskId: string, title: string) => void;
  addComment: (taskId: string, body: string, authorName: string) => void;

  // share
  addPersonAccess: (
    taskId: string,
    person: Omit<PersonAccess, "id"> & { id?: string },
  ) => void;
  removePersonAccess: (taskId: string, personId: string) => void;
  updatePersonPermission: (
    taskId: string,
    personId: string,
    permission: SharePermission,
  ) => void;
  removeTeamAccess: (taskId: string, teamAccessId: string) => void;
  updateTeamAccessPermission: (
    taskId: string,
    teamAccessId: string,
    permission: SharePermission,
  ) => void;

  // inbox
  selectInbox: (id: string | null) => void;
  /** Append a reply to an inbox item. Returns the reply id. */
  addInboxReply: (itemId: string, body: string) => string;
  /** Remove a reply (e.g. for Undo). */
  removeInboxReply: (itemId: string, replyId: string) => void;

  // docs
  /** Ids of docs the user has deleted. Hides them everywhere. */
  deletedDocIds: string[];
  /** Map of docId → user-renamed name. Overrides the seed name. */
  docNameOverrides: Record<string, string>;
  deleteDoc: (id: string) => void;
  /** Restore a deleted doc (used by Undo). */
  restoreDoc: (id: string) => void;
  /** Rename a doc. Empty/whitespace names are ignored. */
  renameDoc: (id: string, name: string) => void;

  // notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // ui
  toggleSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;
};

function nowISO() {
  return new Date().toISOString();
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: seedTasks,
      teams: seedTeams,
      notifications: seedNotifications,
      selectedTaskByTeam: Object.fromEntries(
        seedTasks.map((t) => [t.teamId, t.id]),
      ),
      selectedInboxId: null,
      inboxRepliesByItemId: {},
      deletedDocIds: [],
      docNameOverrides: {},
      sidebarCollapsed: false,
      mobileSidebarOpen: false,

      addTeam: ({ name, initial, locked }) => {
        const baseId = slugify(name);
        const existing = new Set(get().teams.map((t) => t.id));
        let id = baseId || `team-${Date.now()}`;
        let n = 2;
        while (existing.has(id)) {
          id = `${baseId}-${n++}`;
        }
        const team: Team = {
          id,
          name,
          initial: initial.charAt(0).toUpperCase() || "?",
          locked,
        };
        set((s) => ({
          teams: [...s.teams, team],
          selectedTaskByTeam: { ...s.selectedTaskByTeam, [id]: null },
        }));
        return id;
      },

      updateTeamColor: (teamId, color) =>
        set((s) => ({
          teams: s.teams.map((t) =>
            t.id === teamId ? { ...t, color } : t,
          ),
        })),

      renameTeam: (teamId, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        // Also update the team's initial if it was auto-derived from the old name
        set((s) => ({
          teams: s.teams.map((t) => {
            if (t.id !== teamId) return t;
            // Heuristic: if current initial was the first char of the current name (case-insensitive),
            // re-derive from the new name. Otherwise leave initial alone (user explicitly set it).
            const initial =
              t.initial.toLowerCase() === t.name.charAt(0).toLowerCase()
                ? trimmed.charAt(0).toUpperCase()
                : t.initial;
            return { ...t, name: trimmed, initial };
          }),
        }));
      },

      addTask: (teamId, title, createdBy) => {
        const id = `task-${Date.now()}`;
        const newTask: Task = {
          id,
          teamId,
          title,
          description: "",
          createdBy,
          createdAt: nowISO(),
          priority: "Medium",
          dueDate: nowISO(),
          tags: [],
          attachedDocIds: [],
          peopleAccess: [],
          teamAccess: [],
          comments: [],
          activities: [
            {
              id: `a-${Date.now()}`,
              authorName: createdBy,
              action: "created a Task",
              createdAt: nowISO(),
            },
          ],
        };
        set((s) => ({
          tasks: [newTask, ...s.tasks],
          selectedTaskByTeam: { ...s.selectedTaskByTeam, [teamId]: id },
        }));
        return id;
      },

      selectTask: (teamId, taskId) =>
        set((s) => ({
          selectedTaskByTeam: { ...s.selectedTaskByTeam, [teamId]: taskId },
        })),

      updateTaskTitle: (taskId, title) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, title } : t)),
        })),

      addComment: (taskId, body, authorName) => {
        const comment: Comment = {
          id: `c-${Date.now()}`,
          authorName,
          createdAt: nowISO(),
          body,
        };
        const activity: Activity = {
          id: `a-${Date.now()}`,
          authorName,
          action: "made a comment",
          createdAt: nowISO(),
        };
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [...t.comments, comment],
                  activities: [...t.activities, activity],
                }
              : t,
          ),
        }));
      },

      addPersonAccess: (taskId, person) => {
        const id = person.id ?? `p-${Date.now()}`;
        const activity: Activity = {
          id: `a-${Date.now()}`,
          authorName: "Temitope Aiyegbusi",
          action: `shared with ${person.email}`,
          createdAt: nowISO(),
        };
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t;
            // Don't duplicate if email already present
            if (
              t.peopleAccess.some(
                (p) => p.email.toLowerCase() === person.email.toLowerCase(),
              )
            ) {
              return t;
            }
            return {
              ...t,
              peopleAccess: [...t.peopleAccess, { ...person, id }],
              activities: [...t.activities, activity],
            };
          }),
        }));
      },

      removePersonAccess: (taskId, personId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  peopleAccess: t.peopleAccess.filter((p) => p.id !== personId),
                }
              : t,
          ),
        })),

      updatePersonPermission: (taskId, personId, permission) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  peopleAccess: t.peopleAccess.map((p) =>
                    p.id === personId ? { ...p, permission } : p,
                  ),
                }
              : t,
          ),
        })),

      removeTeamAccess: (taskId, teamAccessId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  teamAccess: t.teamAccess.filter(
                    (ta) => ta.id !== teamAccessId,
                  ),
                }
              : t,
          ),
        })),

      updateTeamAccessPermission: (taskId, teamAccessId, permission) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  teamAccess: t.teamAccess.map((ta) =>
                    ta.id === teamAccessId ? { ...ta, permission } : ta,
                  ),
                }
              : t,
          ),
        })),

      selectInbox: (id) => set({ selectedInboxId: id }),

      addInboxReply: (itemId, body) => {
        const id = `reply-${Date.now()}`;
        const reply: InboxReply = {
          id,
          body,
          sentAt: nowISO(),
          authorName: "Temitope Aiyegbusi",
        };
        set((s) => ({
          inboxRepliesByItemId: {
            ...s.inboxRepliesByItemId,
            [itemId]: [...(s.inboxRepliesByItemId[itemId] ?? []), reply],
          },
        }));
        return id;
      },

      removeInboxReply: (itemId, replyId) =>
        set((s) => ({
          inboxRepliesByItemId: {
            ...s.inboxRepliesByItemId,
            [itemId]: (s.inboxRepliesByItemId[itemId] ?? []).filter(
              (r) => r.id !== replyId,
            ),
          },
        })),

      deleteDoc: (id) =>
        set((s) =>
          s.deletedDocIds.includes(id)
            ? s
            : { deletedDocIds: [...s.deletedDocIds, id] },
        ),

      restoreDoc: (id) =>
        set((s) => ({
          deletedDocIds: s.deletedDocIds.filter((d) => d !== id),
        })),

      renameDoc: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((s) => ({
          docNameOverrides: { ...s.docNameOverrides, [id]: trimmed },
        }));
      },

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setMobileSidebar: (open) => set({ mobileSidebarOpen: open }),
    }),
    {
      name: "workspace-app-state-v6",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        tasks: s.tasks,
        teams: s.teams,
        notifications: s.notifications,
        selectedTaskByTeam: s.selectedTaskByTeam,
        inboxRepliesByItemId: s.inboxRepliesByItemId,
        deletedDocIds: s.deletedDocIds,
        docNameOverrides: s.docNameOverrides,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
      // Defensive merge: persisted tasks from older schema versions may lack
      // peopleAccess / teamAccess / comments / activities. Backfill them as
      // empty arrays so consumers never hit `undefined.length`.
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<AppState>;
        const tasks = (persisted.tasks ?? currentState.tasks).map((t) => ({
          ...t,
          peopleAccess: Array.isArray(t.peopleAccess) ? t.peopleAccess : [],
          teamAccess: Array.isArray(t.teamAccess) ? t.teamAccess : [],
          comments: Array.isArray(t.comments) ? t.comments : [],
          activities: Array.isArray(t.activities) ? t.activities : [],
          tags: Array.isArray(t.tags) ? t.tags : [],
          attachedDocIds: Array.isArray(t.attachedDocIds)
            ? t.attachedDocIds
            : [],
        }));
        return {
          ...currentState,
          ...persisted,
          tasks,
          inboxRepliesByItemId:
            persisted.inboxRepliesByItemId &&
            typeof persisted.inboxRepliesByItemId === "object"
              ? persisted.inboxRepliesByItemId
              : {},
          deletedDocIds: Array.isArray(persisted.deletedDocIds)
            ? persisted.deletedDocIds
            : [],
          docNameOverrides:
            persisted.docNameOverrides &&
            typeof persisted.docNameOverrides === "object"
              ? persisted.docNameOverrides
              : {},
        };
      },
    },
  ),
);
