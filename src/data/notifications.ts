import type { Notification } from "@/lib/types";

function isoMinsAgo(m: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - m);
  return d.toISOString();
}
function isoHoursAgo(h: number) {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
}
function isoDaysAgo(d: number) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

export const notifications: Notification[] = [
  // ---------- Today ----------
  {
    id: "nt-1",
    type: "New Comment",
    authorName: "Nickolas Akpas",
    context: "Engineering Team",
    taskId: "task-eng-1",
    preview:
      "Design a visually appealing and user-friendly landing page that effectively communicates key information, drives engagement, and encourages conversions based on the business goals.",
    createdAt: isoHoursAgo(2),
    read: false,
  },
  {
    id: "nt-2",
    type: "Mentioned you",
    authorName: "Jessica Levi",
    context: "Engineering Team",
    taskId: "task-eng-1",
    preview: "@Temitope Aiyegbusi can you walk us through the prototype on Thursday?",
    createdAt: isoHoursAgo(2),
    read: false,
  },
  {
    id: "nt-3",
    type: "New Reply",
    authorName: "Adaeze Okoro",
    context: "Customer Experience",
    taskId: "task-cx-1",
    preview:
      "Tagging in here — Apapa Port can shift our berth window if we commit to a Tuesday discharge.",
    createdAt: isoHoursAgo(3),
    read: false,
  },
  {
    id: "nt-4",
    type: "Task Assigned",
    authorName: "Floyd Miles",
    context: "Accounting",
    taskId: "task-acc-1",
    preview: "You've been assigned 'Close the books for September FY25'.",
    createdAt: isoHoursAgo(4),
    read: false,
  },
  {
    id: "nt-5",
    type: "New Comment",
    authorName: "Albert Flores",
    context: "Product Design",
    taskId: "task-pd-1",
    preview:
      "Pulled the Mixpanel funnels — confirms the 38% drop at document upload. Sharing the dashboard in the channel.",
    createdAt: isoHoursAgo(5),
    read: false,
  },
  {
    id: "nt-6",
    type: "Status Changed",
    authorName: "Darlene Robertson",
    context: "Sales",
    taskId: "task-sl-1",
    preview: "Moved 'Q4 enterprise pipeline' from In Review to In Progress.",
    createdAt: isoHoursAgo(7),
    read: false,
  },

  // ---------- Yesterday ----------
  {
    id: "nt-7",
    type: "New Reply",
    authorName: "Stephen Keshi",
    context: "Engineering Team",
    taskId: "task-eng-1",
    preview:
      "Hope you've been good! I've been counting down to the weekend like it's Christmas, and I just wanted to lock in our plans before either of us gets swallowed by 'I'll rest this weekend' lies again.",
    createdAt: isoDaysAgo(1),
    read: false,
  },
  {
    id: "nt-8",
    type: "Mentioned you",
    authorName: "Lola Ademosu",
    context: "Engineering Team",
    taskId: "task-eng-1",
    preview: "@Temitope Aiyegbusi the truck clearance angle on frame 12 — your call?",
    createdAt: isoDaysAgo(1),
    read: false,
  },
  {
    id: "nt-9",
    type: "New Comment",
    authorName: "Eleanor Pena",
    context: "Product X Marketing",
    taskId: "task-mkt-1",
    preview:
      "Three customers locked in for the launch reference programme. Drafting case studies this week.",
    createdAt: isoDaysAgo(1),
    read: false,
  },
  {
    id: "nt-10",
    type: "Mentioned you",
    authorName: "Wade Warren",
    context: "Customer Experience",
    taskId: "task-cx-1",
    preview:
      "@Temitope Aiyegbusi audit's done — found 14 routing rules that send tickets to the wrong queue.",
    createdAt: isoDaysAgo(1),
    read: false,
  },
  {
    id: "nt-11",
    type: "New Reply",
    authorName: "Kathryn Murphy",
    context: "Product X Marketing",
    taskId: "task-mkt-1",
    preview:
      "Let's align the case study narrative with the hero pillars before drafting goes too far.",
    createdAt: isoDaysAgo(1),
    read: true,
  },

  // ---------- Last 7 days ----------
  {
    id: "nt-12",
    type: "Task Assigned",
    authorName: "Jerome Bell",
    context: "Engineering Team",
    preview: "You've been assigned 'Draft revised fleet rotation policy'.",
    createdAt: isoDaysAgo(3),
    read: true,
  },
  {
    id: "nt-13",
    type: "New Comment",
    authorName: "Esther Howard",
    context: "Product Design",
    taskId: "task-pd-1",
    preview:
      "Initial wires are in. Pushing for the 'complete later' compliance pattern — would love a gut check before usability.",
    createdAt: isoDaysAgo(3),
    read: true,
  },
  {
    id: "nt-14",
    type: "Mentioned you",
    authorName: "Ronald Richards",
    context: "Audit",
    taskId: "task-aud-1",
    preview:
      "@Temitope Aiyegbusi kicking off the SOC 2 gap analysis next week — need 30 minutes from you on access controls.",
    createdAt: isoDaysAgo(4),
    read: true,
  },
  {
    id: "nt-15",
    type: "Status Changed",
    authorName: "Courtney Henry",
    context: "Customer Experience",
    taskId: "task-cx-1",
    preview: "Moved 'Reduce average first-response time' to In Progress.",
    createdAt: isoDaysAgo(4),
    read: true,
  },
  {
    id: "nt-16",
    type: "New Reply",
    authorName: "Floyd Miles",
    context: "Accounting",
    taskId: "task-acc-1",
    preview: "AR aging review is wrapped. Filed in the Q3 close folder.",
    createdAt: isoDaysAgo(5),
    read: true,
  },
  {
    id: "nt-17",
    type: "New Comment",
    authorName: "Jane Cooper",
    context: "Product Design",
    taskId: "task-pd-1",
    preview:
      "Spent the morning with three drivers in Lekki — the document upload is brutal. Notes attached.",
    createdAt: isoDaysAgo(5),
    read: true,
  },
  {
    id: "nt-18",
    type: "Mentioned you",
    authorName: "Darlene Robertson",
    context: "Sales",
    taskId: "task-sl-1",
    preview:
      "@Temitope Aiyegbusi Glovo wants a security questionnaire by Friday. Can your team prep?",
    createdAt: isoDaysAgo(6),
    read: true,
  },
  {
    id: "nt-19",
    type: "New Reply",
    authorName: "Ronald Richards",
    context: "Audit",
    taskId: "task-aud-1",
    preview:
      "Scope is locked. CC1.0–CC9.0 plus availability and confidentiality controls.",
    createdAt: isoDaysAgo(6),
    read: true,
  },

  // ---------- Older ----------
  {
    id: "nt-20",
    type: "New Comment",
    authorName: "Marvin McKinney",
    context: "Engineering Team",
    taskId: "task-eng-1",
    preview:
      "Reviewed the CTA copy — 'Get started' is doing too much work. Suggest split-testing 'See it work' against it.",
    createdAt: isoDaysAgo(10),
    read: true,
  },
  {
    id: "nt-21",
    type: "Status Changed",
    authorName: "Esther Howard",
    context: "Product Design",
    taskId: "task-pd-1",
    preview: "Moved 'Driver app onboarding flow' to In Review.",
    createdAt: isoDaysAgo(12),
    read: true,
  },
  {
    id: "nt-22",
    type: "Mentioned you",
    authorName: "Kathryn Murphy",
    context: "Product X Marketing",
    taskId: "task-mkt-1",
    preview:
      "@Temitope Aiyegbusi need a quick read on the analyst briefing pack before I send it out.",
    createdAt: isoDaysAgo(14),
    read: true,
  },
  {
    id: "nt-23",
    type: "New Comment",
    authorName: "Wade Warren",
    context: "Sales",
    taskId: "task-sl-1",
    preview:
      "Konga pilot results are in. Throughput up 22% on the routes we A/B tested. Writing up the case.",
    createdAt: isoDaysAgo(18),
    read: true,
  },
  {
    id: "nt-24",
    type: "New Reply",
    authorName: "Albert Flores",
    context: "Product Design",
    taskId: "task-pd-1",
    preview:
      "Edge-detection on document upload looks viable on iOS. Android needs a fallback path.",
    createdAt: isoDaysAgo(22),
    read: true,
  },
];

export const unreadCount = notifications.filter((n) => !n.read).length;
