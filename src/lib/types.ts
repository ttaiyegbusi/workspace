export type WorkspaceRole = "Admin" | "Member";

export type MemberStatus = "Active" | "Inactive" | "Pending";

export type Member = {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
  role: string;
  initial?: string;
};

export type Team = {
  id: string;
  name: string;
  initial: string;
  locked: boolean;
};

export type DocFileType = "pdf" | "xls" | "fig" | "audio" | "doc" | "img" | "zip";

export type DocItem = {
  id: string;
  name: string;
  type: DocFileType;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
};

export type InboxCategory = "Personal" | "Work";

export type InboxItem = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  category: InboxCategory;
  receivedAt: string; // ISO
  hasAttachment: boolean;
  read: boolean;
};

export type Priority = "Low" | "Medium" | "High" | "Urgent";

export type Comment = {
  id: string;
  authorName: string;
  createdAt: string;
  body: string;
};

export type Activity = {
  id: string;
  authorName: string;
  action: string; // e.g. "created a Task"
  createdAt: string;
};

export type SharePermission = "View" | "Comment" | "Edit";

export type PersonAccess = {
  id: string;
  name: string;
  email: string;
  permission: SharePermission;
};

export type TeamAccess = {
  id: string; // team id (or synthetic for seeded teams not in workspace)
  name: string;
  initial: string;
  permission: SharePermission;
};

export type Task = {
  id: string;
  teamId: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  priority: Priority;
  dueDate: string; // ISO
  tags: string[];
  attachedDocIds: string[];
  comments: Comment[];
  activities: Activity[];
  peopleAccess: PersonAccess[];
  teamAccess: TeamAccess[];
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  company: string;
  initial?: string;
};

export type SearchLink = {
  id: string;
  url: string;
  // where it came from (purely informational — not shown)
  source: "task" | "comment" | "inbox";
};

export type NotificationType =
  | "New Comment"
  | "New Reply"
  | "Mentioned you"
  | "Task Assigned"
  | "Status Changed";

export type Notification = {
  id: string;
  type: NotificationType;
  authorName: string;
  context: string; // e.g. "Engineering Team"
  taskId?: string; // for navigation
  preview: string;
  createdAt: string; // ISO
  read: boolean;
};
