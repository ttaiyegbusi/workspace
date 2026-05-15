"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, Comment, Activity } from "@/lib/types";
import { seedTasks } from "@/data/tasks";

type AppState = {
  tasks: Task[];
  selectedTaskByTeam: Record<string, string>; // teamId -> taskId
  selectedInboxId: string | null;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;

  // tasks
  addTask: (teamId: string, title: string, createdBy: string) => string;
  selectTask: (teamId: string, taskId: string) => void;
  updateTaskTitle: (taskId: string, title: string) => void;
  addComment: (taskId: string, body: string, authorName: string) => void;

  // inbox
  selectInbox: (id: string | null) => void;

  // ui
  toggleSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;
};

function nowISO() {
  return new Date().toISOString();
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: seedTasks,
      selectedTaskByTeam: Object.fromEntries(
        seedTasks.map((t) => [t.teamId, t.id]),
      ),
      selectedInboxId: null,
      sidebarCollapsed: false,
      mobileSidebarOpen: false,

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

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setMobileSidebar: (open) => set({ mobileSidebarOpen: open }),
    }),
    {
      name: "workspace-app-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        tasks: s.tasks,
        selectedTaskByTeam: s.selectedTaskByTeam,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    },
  ),
);
