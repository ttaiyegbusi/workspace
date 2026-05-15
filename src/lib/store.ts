"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Task,
  Comment,
  Activity,
  Team,
  Notification,
} from "@/lib/types";
import { seedTasks } from "@/data/tasks";
import { teams as seedTeams } from "@/data/workspace";
import { notifications as seedNotifications } from "@/data/notifications";

type AppState = {
  tasks: Task[];
  teams: Team[];
  notifications: Notification[];
  selectedTaskByTeam: Record<string, string | null>; // teamId -> taskId | null (null = empty state)
  selectedInboxId: string | null;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;

  // teams
  addTeam: (input: {
    name: string;
    initial: string;
    locked: boolean;
  }) => string;

  // tasks
  addTask: (teamId: string, title: string, createdBy: string) => string;
  selectTask: (teamId: string, taskId: string | null) => void;
  updateTaskTitle: (taskId: string, title: string) => void;
  addComment: (taskId: string, body: string, authorName: string) => void;

  // inbox
  selectInbox: (id: string | null) => void;

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

      selectInbox: (id) => set({ selectedInboxId: id }),

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
      name: "workspace-app-state-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        tasks: s.tasks,
        teams: s.teams,
        notifications: s.notifications,
        selectedTaskByTeam: s.selectedTaskByTeam,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    },
  ),
);
