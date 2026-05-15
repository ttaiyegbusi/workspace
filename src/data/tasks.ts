import type { Task } from "@/lib/types";

function isoDaysAgo(d: number) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}
function isoDaysAhead(d: number) {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString();
}

export const seedTasks: Task[] = [
  // ENGINEERING — modelled directly on the reference screenshot
  {
    id: "task-eng-1",
    teamId: "engineering",
    title: "Landing page redesign",
    description: `Design a visually appealing and user-friendly landing page that effectively communicates key information, drives engagement, and encourages conversions based on the business goals.

Key Responsibilities:
• Research and analyze target audience preferences, business objectives, and industry trends.
• Create wireframes, prototypes, and high-fidelity UI designs for the landing page.
• Ensure a responsive and mobile-friendly design for seamless accessibility across all devices.
• Optimize layout, typography, and color schemes to enhance visual hierarchy and user experience.
• Incorporate clear call-to-actions (CTAs) to drive user engagement and conversions.
• Collaborate with developers to ensure design feasibility and proper implementation.
• Conduct usability testing and iterate based on feedback to improve effectiveness.
• Ensure consistency with the brand's visual identity and design guidelines.`,
    createdBy: "Temitope Aiyegbusi",
    createdAt: isoDaysAgo(45),
    priority: "High",
    dueDate: isoDaysAhead(14),
    tags: ["Design", "Design Engineering"],
    attachedDocIds: ["doc-9"],
    comments: [
      {
        id: "c-1",
        authorName: "Alex Luther",
        createdAt: isoDaysAgo(32),
        body: "Hey team! We need to finalize the landing page design this week. How's everything coming along?",
      },
      {
        id: "c-2",
        authorName: "Temitope Aiyegbusi",
        createdAt: isoDaysAgo(32),
        body: "Hey Alex! I've been working on the wireframes and a few high-fidelity mockups. I tried a clean, modern look with strong CTAs. Want me to share them now?",
      },
      {
        id: "c-3",
        authorName: "Alex Luther",
        createdAt: isoDaysAgo(31),
        body: "Yes, please! Let's review them together.",
      },
      {
        id: "c-4",
        authorName: "Alex Luther",
        createdAt: isoDaysAgo(31),
        body: "Sure! Here's the Figma link: [Figma Link] Let me know your thoughts.",
      },
    ],
    activities: [
      {
        id: "a-1",
        authorName: "Temitope Aiyegbusi",
        action: "created a Task",
        createdAt: isoDaysAgo(45),
      },
      {
        id: "a-2",
        authorName: "Alex Luther",
        action: "made a comment",
        createdAt: isoDaysAgo(32),
      },
      {
        id: "a-3",
        authorName: "Temitope Aiyegbusi",
        action: "made a comment",
        createdAt: isoDaysAgo(32),
      },
      {
        id: "a-4",
        authorName: "Alex Luther",
        action: "made a comment",
        createdAt: isoDaysAgo(31),
      },
    ],
  },

  // MARKETING
  {
    id: "task-mkt-1",
    teamId: "marketing",
    title: "Q4 product launch campaign",
    description: `Plan and execute the integrated marketing campaign for the Q4 launch of our new last-mile tracking product. The campaign should land across owned, earned, and paid channels with consistent messaging.

Key deliverables:
• Campaign narrative and messaging hierarchy
• Hero video script and storyboard
• Press release and analyst briefing pack
• Performance media plan (LinkedIn, Google, sector trades)
• Customer reference programme — 3 named case studies
• Internal enablement deck for sales`,
    createdBy: "Kathryn Murphy",
    createdAt: isoDaysAgo(20),
    priority: "Urgent",
    dueDate: isoDaysAhead(28),
    tags: ["Campaign", "Launch"],
    attachedDocIds: ["doc-15"],
    comments: [
      {
        id: "c-m-1",
        authorName: "Eleanor Pena",
        createdAt: isoDaysAgo(8),
        body: "We've locked in three customers willing to go on the record. Drafting the case studies this week.",
      },
      {
        id: "c-m-2",
        authorName: "Kathryn Murphy",
        createdAt: isoDaysAgo(7),
        body: "Great — let's align the case study narrative with the hero pillars before drafting goes too far.",
      },
    ],
    activities: [
      {
        id: "a-m-1",
        authorName: "Kathryn Murphy",
        action: "created a Task",
        createdAt: isoDaysAgo(20),
      },
      {
        id: "a-m-2",
        authorName: "Eleanor Pena",
        action: "made a comment",
        createdAt: isoDaysAgo(8),
      },
    ],
  },

  // CUSTOMER EXPERIENCE
  {
    id: "task-cx-1",
    teamId: "cx",
    title: "Reduce average first-response time below 2 hours",
    description: `Our current first-response time across email and in-app channels is sitting at 3h 42m on weekdays and 6h+ over weekends. The target for this quarter is to bring weekday FRT below 2 hours and weekend FRT below 4 hours, without growing headcount.

Approach:
• Audit current ticket routing rules and identify dead-ends
• Build macro library for the 12 most common ticket types
• Pilot a weekend shadow shift with two CX agents
• Roll out the new SLA scorecard to the team`,
    createdBy: "Courtney Henry",
    createdAt: isoDaysAgo(12),
    priority: "Medium",
    dueDate: isoDaysAhead(45),
    tags: ["SLA", "Operations"],
    attachedDocIds: ["doc-20"],
    comments: [
      {
        id: "c-cx-1",
        authorName: "Wade Warren",
        createdAt: isoDaysAgo(6),
        body: "Audit done. Found 14 routing rules that send tickets to the wrong queue.",
      },
    ],
    activities: [
      {
        id: "a-cx-1",
        authorName: "Courtney Henry",
        action: "created a Task",
        createdAt: isoDaysAgo(12),
      },
    ],
  },

  // ACCOUNTING
  {
    id: "task-acc-1",
    teamId: "accounting",
    title: "Close the books for September FY25",
    description: `Lead the September month-end close. Targeting close by day 5 of October.

Owners:
• AP reconciliations — Dianne
• AR aging review — Floyd
• Fixed asset additions — Darlene
• Inter-company eliminations — Tope

Submit a draft P&L by Oct 3 and final by Oct 5.`,
    createdBy: "Floyd Miles",
    createdAt: isoDaysAgo(8),
    priority: "High",
    dueDate: isoDaysAhead(7),
    tags: ["Month-end", "Close"],
    attachedDocIds: ["doc-11"],
    comments: [],
    activities: [
      {
        id: "a-acc-1",
        authorName: "Floyd Miles",
        action: "created a Task",
        createdAt: isoDaysAgo(8),
      },
    ],
  },

  // PRODUCT DESIGN
  {
    id: "task-pd-1",
    teamId: "product-design",
    title: "Driver app onboarding flow",
    description: `Design a new onboarding flow for the Driver app that gets a new driver from first-launch to their first accepted delivery in under 10 minutes.

The current flow takes ~24 minutes and has a 38% drop-off at the document upload step. We need to simplify document capture (auto-detect edges, allow batch upload), and break compliance into a "complete now / complete later" pattern.`,
    createdBy: "Jane Cooper",
    createdAt: isoDaysAgo(15),
    priority: "Medium",
    dueDate: isoDaysAhead(21),
    tags: ["Mobile", "Onboarding"],
    attachedDocIds: ["doc-23"],
    comments: [
      {
        id: "c-pd-1",
        authorName: "Albert Flores",
        createdAt: isoDaysAgo(9),
        body: "Pulled Mixpanel funnels for the last 90 days — confirms the 38% drop at document upload. Sharing the dashboard in the channel.",
      },
    ],
    activities: [
      {
        id: "a-pd-1",
        authorName: "Jane Cooper",
        action: "created a Task",
        createdAt: isoDaysAgo(15),
      },
    ],
  },

  // AUDIT
  {
    id: "task-aud-1",
    teamId: "audit",
    title: "Annual SOC 2 Type II readiness assessment",
    description: `Conduct a readiness assessment ahead of the SOC 2 Type II audit window beginning January.

Scope:
• Security controls (CC1.0 – CC9.0)
• Availability controls
• Confidentiality controls

Deliverables:
• Gap analysis document
• Remediation tracker
• Evidence collection plan`,
    createdBy: "Ronald Richards",
    createdAt: isoDaysAgo(30),
    priority: "High",
    dueDate: isoDaysAhead(60),
    tags: ["Compliance", "SOC 2"],
    attachedDocIds: ["doc-7"],
    comments: [],
    activities: [
      {
        id: "a-aud-1",
        authorName: "Ronald Richards",
        action: "created a Task",
        createdAt: isoDaysAgo(30),
      },
    ],
  },

  // SALES
  {
    id: "task-sl-1",
    teamId: "sales",
    title: "Close Q4 enterprise pipeline — $4.2M target",
    description: `Drive the Q4 enterprise pipeline to close. Currently sitting at $3.1M weighted, $4.2M target.

Top-3 deals to focus on this week:
• Glovo Africa — final security review
• Jumia Logistics — commercial terms
• Konga Express — pilot to full rollout`,
    createdBy: "Darlene Robertson",
    createdAt: isoDaysAgo(10),
    priority: "Urgent",
    dueDate: isoDaysAhead(40),
    tags: ["Pipeline", "Enterprise"],
    attachedDocIds: ["doc-15"],
    comments: [
      {
        id: "c-sl-1",
        authorName: "Wade Warren",
        createdAt: isoDaysAgo(3),
        body: "Glovo signed the MSA this morning. Implementation kickoff scheduled for next Tuesday.",
      },
    ],
    activities: [
      {
        id: "a-sl-1",
        authorName: "Darlene Robertson",
        action: "created a Task",
        createdAt: isoDaysAgo(10),
      },
      {
        id: "a-sl-2",
        authorName: "Wade Warren",
        action: "made a comment",
        createdAt: isoDaysAgo(3),
      },
    ],
  },
];
