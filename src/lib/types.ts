export type WorkspaceRole = "Admin" | "Member";

export type MemberStatus = "Active" | "Inactive" | "Pending";

/** Detailed profile shown on the member profile page. Optional — for members
 *  without a hand-authored blob, we auto-generate plausible values at runtime. */
export type MemberProfile = {
  // Personal
  firstName: string;
  middleName: string;
  lastName: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  stateOfOrigin: string;
  lga: string;
  nationality: string;
  dateOfBirth: string;
  title: "Mr" | "Mrs" | "Ms" | "Dr";
  placeOfBirth: string;
  nextOfKin: string;
  nextOfKinRelationship: string;
  mothersMaidenName: string;
  spouseName: string | null;
  noOfChildren: number | null;
  bloodGroup: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";

  // Stats column
  lineManager: string;
  department: string;
  leaveBalance: number;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
  role: string;
  initial?: string;
  /** Detailed profile. When omitted we synthesise one. */
  profile?: MemberProfile;
};

export type Team = {
  id: string;
  name: string;
  initial: string;
  locked: boolean;
  /** Optional accent color. When set, the team's letter avatar uses this as background. */
  color?: string;
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

export type InboxReply = {
  id: string;
  body: string;
  sentAt: string;
  authorName: string;
};

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
  replies: InboxReply[];
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
