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

// ---------- Seeded access lists ----------
// Engineering's flagship uses the exact people shown in the Share screenshot.

const engineeringAccess = {
  people: [
    {
      id: "p-1",
      name: "Robert Fox",
      email: "robert.reid@example.com",
      permission: "View" as const,
    },
    {
      id: "p-2",
      name: "Cameron Williamson",
      email: "cameron.reid@example.com",
      permission: "View" as const,
    },
    {
      id: "p-3",
      name: "Leslie Alexander",
      email: "leslie.reid@example.com",
      permission: "View" as const,
    },
  ],
  teams: [
    { id: "engineering", name: "Engineering", initial: "E", permission: "View" as const },
    { id: "product-design", name: "Design", initial: "D", permission: "Edit" as const },
    { id: "product-x-marketing", name: "Product", initial: "P", permission: "Edit" as const },
  ],
};

const standardAccess = (teamId: string, teamName: string, teamInitial: string) => ({
  people: [
    {
      id: `p-${teamId}-1`,
      name: "Jerome Bell",
      email: "jerome.reid@example.com",
      permission: "Edit" as const,
    },
    {
      id: `p-${teamId}-2`,
      name: "Esther Howard",
      email: "esther.reid@example.com",
      permission: "Comment" as const,
    },
  ],
  teams: [
    { id: teamId, name: teamName, initial: teamInitial, permission: "Edit" as const },
  ],
});

// ---------- Tasks ----------

export const seedTasks: Task[] = [
  // ============ ENGINEERING (3 tasks) ============
  {
    id: "task-eng-1",
    teamId: "engineering",
    title: "Send Money Feature Implementation",
    description: `Build a peer-to-peer "Send Money" flow inside the wallet app — recipient lookup by phone, amount entry with daily-limit validation, two-factor confirmation, and an idempotent transfer endpoint backed by the ledger service.

Key Responsibilities:
• Design the API contract for /transfers and align with the ledger team on idempotency keys.
• Implement recipient search by phone, email, or tag with sub-200ms response time.
• Wire up real-time balance updates on the sender screen post-transfer.
• Enforce the daily transfer cap and surface clear error states for limit breaches.
• Add a confirmation modal with the recipient name, amount, and transfer reference.
• Instrument the flow end-to-end in Datadog with success/failure breakdowns.
• Cover happy-path and rollback scenarios with integration tests.
• Coordinate with Risk on the fraud-scoring hook before public launch.`,
    createdBy: "Temitope Aiyegbusi",
    createdAt: isoDaysAgo(45),
    priority: "High",
    dueDate: isoDaysAhead(14),
    tags: ["Backend", "Payments"],
    attachedDocIds: ["doc-9"],
    peopleAccess: engineeringAccess.people,
    teamAccess: engineeringAccess.teams,
    comments: [
      {
        id: "c-eng-1-1",
        authorName: "Alex Luther",
        createdAt: isoDaysAgo(32),
        body: "Hey team! We need to finalize the API contract this week. How's everything coming along?",
      },
      {
        id: "c-eng-1-2",
        authorName: "Temitope Aiyegbusi",
        createdAt: isoDaysAgo(32),
        body: "Hey Alex! I've drafted the /transfers contract and the idempotency proposal. Want me to share it now for review?",
      },
      {
        id: "c-eng-1-3",
        authorName: "Alex Luther",
        createdAt: isoDaysAgo(31),
        body: "Yes, please! Let's review them together.",
      },
      {
        id: "c-eng-1-4",
        authorName: "Alex Luther",
        createdAt: isoDaysAgo(31),
        body: "Sure! Here's the Figma link: [Figma Link] Let me know your thoughts.",
      },
    ],
    activities: [
      { id: "a-eng-1-1", authorName: "Temitope Aiyegbusi", action: "created a Task", createdAt: isoDaysAgo(45) },
      { id: "a-eng-1-2", authorName: "Alex Luther", action: "made a comment", createdAt: isoDaysAgo(32) },
      { id: "a-eng-1-3", authorName: "Temitope Aiyegbusi", action: "made a comment", createdAt: isoDaysAgo(32) },
      { id: "a-eng-1-4", authorName: "Alex Luther", action: "made a comment", createdAt: isoDaysAgo(31) },
    ],
  },
  {
    id: "task-eng-2",
    teamId: "engineering",
    title: "Migrate auth service to Postgres 16",
    description: `Move the auth service from Postgres 13 to Postgres 16 with zero downtime. The current cluster is approaching end-of-support and we're seeing intermittent vacuum pauses that affect login latency during peak hours.

Approach:
• Spin up a Postgres 16 replica behind the primary
• Run shadow reads for two weeks to verify query parity
• Cut over during the Sunday 02:00–04:00 maintenance window
• Keep the 13 cluster hot for 72 hours as a rollback target`,
    createdBy: "Jerome Bell",
    createdAt: isoDaysAgo(18),
    priority: "Medium",
    dueDate: isoDaysAhead(35),
    tags: ["Infrastructure", "Database"],
    attachedDocIds: ["doc-15"],
    peopleAccess: standardAccess("engineering", "Engineering", "E").people,
    teamAccess: standardAccess("engineering", "Engineering", "E").teams,
    comments: [
      {
        id: "c-eng-2-1",
        authorName: "Jerome Bell",
        createdAt: isoDaysAgo(10),
        body: "Replica is up. Shadow reads start Monday — I'll send the dashboard link before EOD.",
      },
    ],
    activities: [
      { id: "a-eng-2-1", authorName: "Jerome Bell", action: "created a Task", createdAt: isoDaysAgo(18) },
      { id: "a-eng-2-2", authorName: "Jerome Bell", action: "made a comment", createdAt: isoDaysAgo(10) },
    ],
  },
  {
    id: "task-eng-3",
    teamId: "engineering",
    title: "Driver app — offline mode for delivery confirmations",
    description: `Drivers in the Apapa corridor lose connectivity for stretches of up to 40 minutes. Build an offline queue for delivery confirmations so drivers can complete drops, capture signatures and photos, and have them sync transparently once the connection returns.

Out of scope: offline route changes, offline customer messaging.`,
    createdBy: "Ronald Richards",
    createdAt: isoDaysAgo(8),
    priority: "Urgent",
    dueDate: isoDaysAhead(10),
    tags: ["Mobile", "Logistics"],
    attachedDocIds: [],
    peopleAccess: standardAccess("engineering", "Engineering", "E").people,
    teamAccess: standardAccess("engineering", "Engineering", "E").teams,
    comments: [],
    activities: [
      { id: "a-eng-3-1", authorName: "Ronald Richards", action: "created a Task", createdAt: isoDaysAgo(8) },
    ],
  },

  // ============ MARKETING (3 tasks) ============
  {
    id: "task-mkt-1",
    teamId: "marketing",
    title: "Q4 last-mile tracking product launch",
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
    peopleAccess: standardAccess("marketing", "Product X Marketing", "P").people,
    teamAccess: standardAccess("marketing", "Product X Marketing", "P").teams,
    comments: [
      {
        id: "c-mkt-1-1",
        authorName: "Eleanor Pena",
        createdAt: isoDaysAgo(8),
        body: "We've locked in three customers willing to go on the record. Drafting case studies this week.",
      },
      {
        id: "c-mkt-1-2",
        authorName: "Kathryn Murphy",
        createdAt: isoDaysAgo(7),
        body: "Great — let's align the case study narrative with the hero pillars before drafting goes too far.",
      },
    ],
    activities: [
      { id: "a-mkt-1-1", authorName: "Kathryn Murphy", action: "created a Task", createdAt: isoDaysAgo(20) },
      { id: "a-mkt-1-2", authorName: "Eleanor Pena", action: "made a comment", createdAt: isoDaysAgo(8) },
    ],
  },
  {
    id: "task-mkt-2",
    teamId: "marketing",
    title: "Refresh the website above-the-fold for shipper segment",
    description: `Our website's hero currently speaks to consumers, but 70% of inbound demos come from shippers. Refresh the above-the-fold to lead with shipper-specific value props: visibility, exception management, and carrier marketplace access.

Run a 50/50 A/B test against the existing hero for four weeks.`,
    createdBy: "Eleanor Pena",
    createdAt: isoDaysAgo(14),
    priority: "Medium",
    dueDate: isoDaysAhead(21),
    tags: ["Website", "Conversion"],
    attachedDocIds: [],
    peopleAccess: standardAccess("marketing", "Product X Marketing", "P").people,
    teamAccess: standardAccess("marketing", "Product X Marketing", "P").teams,
    comments: [],
    activities: [
      { id: "a-mkt-2-1", authorName: "Eleanor Pena", action: "created a Task", createdAt: isoDaysAgo(14) },
    ],
  },

  // ============ CUSTOMER EXPERIENCE (3 tasks) ============
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
    peopleAccess: standardAccess("cx", "Customer Experience", "C").people,
    teamAccess: standardAccess("cx", "Customer Experience", "C").teams,
    comments: [
      {
        id: "c-cx-1-1",
        authorName: "Wade Warren",
        createdAt: isoDaysAgo(6),
        body: "Audit done. Found 14 routing rules that send tickets to the wrong queue.",
      },
    ],
    activities: [
      { id: "a-cx-1-1", authorName: "Courtney Henry", action: "created a Task", createdAt: isoDaysAgo(12) },
      { id: "a-cx-1-2", authorName: "Wade Warren", action: "made a comment", createdAt: isoDaysAgo(6) },
    ],
  },
  {
    id: "task-cx-2",
    teamId: "cx",
    title: "Quarterly CSAT survey — Q3 fielding and analysis",
    description: `Field the Q3 CSAT survey to all customers with at least three shipments in the quarter. Aim for n ≥ 800 responses. Once data is in, segment by SMB / mid-market / enterprise, and write up the top three drivers of dissatisfaction with proposed remediation.`,
    createdBy: "Jane Cooper",
    createdAt: isoDaysAgo(22),
    priority: "Low",
    dueDate: isoDaysAhead(18),
    tags: ["CSAT", "Research"],
    attachedDocIds: ["doc-20"],
    peopleAccess: standardAccess("cx", "Customer Experience", "C").people,
    teamAccess: standardAccess("cx", "Customer Experience", "C").teams,
    comments: [],
    activities: [
      { id: "a-cx-2-1", authorName: "Jane Cooper", action: "created a Task", createdAt: isoDaysAgo(22) },
    ],
  },

  // ============ ACCOUNTING (2 tasks) ============
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
    peopleAccess: standardAccess("accounting", "Accounting", "A").people,
    teamAccess: standardAccess("accounting", "Accounting", "A").teams,
    comments: [],
    activities: [
      { id: "a-acc-1-1", authorName: "Floyd Miles", action: "created a Task", createdAt: isoDaysAgo(8) },
    ],
  },
  {
    id: "task-acc-2",
    teamId: "accounting",
    title: "Carrier rebate reconciliation — Q2 and Q3",
    description: `Reconcile the negotiated volume rebates from our three largest carriers (Maersk, DHL, DB Schenker) for Q2 and Q3. Discrepancies above $5,000 should be flagged and disputed within the contractual window.

A spreadsheet template with last quarter's reconciliations is attached. Expected workload: 2–3 days per carrier.`,
    createdBy: "Darlene Robertson",
    createdAt: isoDaysAgo(16),
    priority: "Medium",
    dueDate: isoDaysAhead(25),
    tags: ["Carriers", "Reconciliation"],
    attachedDocIds: ["doc-11"],
    peopleAccess: standardAccess("accounting", "Accounting", "A").people,
    teamAccess: standardAccess("accounting", "Accounting", "A").teams,
    comments: [],
    activities: [
      { id: "a-acc-2-1", authorName: "Darlene Robertson", action: "created a Task", createdAt: isoDaysAgo(16) },
    ],
  },

  // ============ PRODUCT DESIGN (2 tasks) ============
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
    peopleAccess: standardAccess("product-design", "Product Design", "P").people,
    teamAccess: standardAccess("product-design", "Product Design", "P").teams,
    comments: [
      {
        id: "c-pd-1-1",
        authorName: "Albert Flores",
        createdAt: isoDaysAgo(9),
        body: "Pulled Mixpanel funnels for the last 90 days — confirms the 38% drop at document upload. Sharing the dashboard in the channel.",
      },
    ],
    activities: [
      { id: "a-pd-1-1", authorName: "Jane Cooper", action: "created a Task", createdAt: isoDaysAgo(15) },
      { id: "a-pd-1-2", authorName: "Albert Flores", action: "made a comment", createdAt: isoDaysAgo(9) },
    ],
  },
  {
    id: "task-pd-2",
    teamId: "product-design",
    title: "Design system v2 — typography and color tokens",
    description: `Refactor the design system to use semantic tokens instead of raw values. Today, a button uses #1A1A1A directly; tomorrow it should reference --color-text. This unblocks dark mode work and lets us ship theme variants without touching components.

Deliverables: token map (Figma + JSON), migration guide, and one reference component (Button) fully ported.`,
    createdBy: "Albert Flores",
    createdAt: isoDaysAgo(11),
    priority: "Low",
    dueDate: isoDaysAhead(40),
    tags: ["Design System", "Foundations"],
    attachedDocIds: [],
    peopleAccess: standardAccess("product-design", "Product Design", "P").people,
    teamAccess: standardAccess("product-design", "Product Design", "P").teams,
    comments: [],
    activities: [
      { id: "a-pd-2-1", authorName: "Albert Flores", action: "created a Task", createdAt: isoDaysAgo(11) },
    ],
  },

  // ============ AUDIT (2 tasks) ============
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
    peopleAccess: standardAccess("audit", "Audit", "A").people,
    teamAccess: standardAccess("audit", "Audit", "A").teams,
    comments: [],
    activities: [
      { id: "a-aud-1-1", authorName: "Ronald Richards", action: "created a Task", createdAt: isoDaysAgo(30) },
    ],
  },
  {
    id: "task-aud-2",
    teamId: "audit",
    title: "Q3 cycle count variance investigation — Bay 7",
    description: `The Q3 cycle count for Bay 7 (SKU range 8800–8899) shows a 3.2% variance against the WMS — above the 1.5% control threshold flagged by Internal Audit.

Investigate root cause, document findings, and propose corrective actions. If shrinkage is confirmed, coordinate with Operations on a re-count by an independent team.`,
    createdBy: "Ronald Richards",
    createdAt: isoDaysAgo(20),
    priority: "Medium",
    dueDate: isoDaysAhead(14),
    tags: ["Variance", "Investigation"],
    attachedDocIds: ["doc-19"],
    peopleAccess: standardAccess("audit", "Audit", "A").people,
    teamAccess: standardAccess("audit", "Audit", "A").teams,
    comments: [],
    activities: [
      { id: "a-aud-2-1", authorName: "Ronald Richards", action: "created a Task", createdAt: isoDaysAgo(20) },
    ],
  },

  // ============ SALES (3 tasks) ============
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
    peopleAccess: standardAccess("sales", "Sales", "S").people,
    teamAccess: standardAccess("sales", "Sales", "S").teams,
    comments: [
      {
        id: "c-sl-1-1",
        authorName: "Wade Warren",
        createdAt: isoDaysAgo(3),
        body: "Glovo signed the MSA this morning. Implementation kickoff scheduled for next Tuesday.",
      },
    ],
    activities: [
      { id: "a-sl-1-1", authorName: "Darlene Robertson", action: "created a Task", createdAt: isoDaysAgo(10) },
      { id: "a-sl-1-2", authorName: "Wade Warren", action: "made a comment", createdAt: isoDaysAgo(3) },
    ],
  },
  {
    id: "task-sl-2",
    teamId: "sales",
    title: "Build a sales playbook for the mid-market segment",
    description: `Enterprise has a mature playbook. Mid-market doesn't, and our AEs are improvising. Build a 25–30 page playbook covering:

• Ideal customer profile and disqualification criteria
• Discovery question bank
• Three pricing scenarios with worked examples
• Common objections and proven responses
• Hand-off checklist to Implementation`,
    createdBy: "Wade Warren",
    createdAt: isoDaysAgo(25),
    priority: "Medium",
    dueDate: isoDaysAhead(30),
    tags: ["Enablement", "Mid-market"],
    attachedDocIds: [],
    peopleAccess: standardAccess("sales", "Sales", "S").people,
    teamAccess: standardAccess("sales", "Sales", "S").teams,
    comments: [],
    activities: [
      { id: "a-sl-2-1", authorName: "Wade Warren", action: "created a Task", createdAt: isoDaysAgo(25) },
    ],
  },
  {
    id: "task-sl-3",
    teamId: "sales",
    title: "Renew the Unilever Nigeria account — at risk",
    description: `Unilever's renewal closes in 60 days and the buying committee has shifted twice this year. Run a renewal motion: executive alignment meeting, value review with the new procurement lead, and a written multi-year proposal at 8% list discount.

Recovery is critical — Unilever represents 14% of Lagos region revenue.`,
    createdBy: "Darlene Robertson",
    createdAt: isoDaysAgo(5),
    priority: "Urgent",
    dueDate: isoDaysAhead(60),
    tags: ["Renewal", "At-risk"],
    attachedDocIds: [],
    peopleAccess: standardAccess("sales", "Sales", "S").people,
    teamAccess: standardAccess("sales", "Sales", "S").teams,
    comments: [],
    activities: [
      { id: "a-sl-3-1", authorName: "Darlene Robertson", action: "created a Task", createdAt: isoDaysAgo(5) },
    ],
  },
];
