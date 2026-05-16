import type { InboxItem } from "@/lib/types";

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

export const inbox: InboxItem[] = [
  // ---------------- Today ----------------
  {
    id: "in-1",
    sender: "DHL Express",
    subject: "Shipment WX-44102 delivered to Lagos hub",
    preview:
      "Your inbound consignment from Rotterdam has been signed for at Loading Bay 3...",
    body: `Hi Tope,

Your inbound consignment from Rotterdam (Reference WX-44102) has been signed for at Loading Bay 3 at 07:14 GMT.

A scanned proof-of-delivery is attached. Please review and reconcile against PO #PR-2025-0918 within 48 hours.

If you spot any discrepancies on pallet counts or seal integrity, raise a claim through the customer portal before close of business Friday.

Best,
DHL Operations`,
    category: "Work",
    receivedAt: isoMinsAgo(18),
    hasAttachment: true,
    read: false,
    replies: [],
  },
  {
    id: "in-2",
    sender: "Slack",
    subject: "You have 12 unread messages in #ops-night-shift",
    preview:
      "Catch up on what you missed while you were away. Most active threads include...",
    body: `Hi Tope,

You missed some activity in your workspace. Most active threads:

• #ops-night-shift — 6 unread, last message from Jerome Bell
• #incident-2025-21 — 4 unread, last message from Esther Howard
• #procurement — 2 unread

Open Slack to catch up.`,
    category: "Work",
    receivedAt: isoMinsAgo(42),
    hasAttachment: false,
    read: false,
    replies: [],
  },
  {
    id: "in-3",
    sender: "Apple",
    subject: "Your receipt from Apple — Order #MX8821",
    preview:
      "Thanks for your purchase. Your order has been confirmed and a copy of the receipt...",
    body: `Order #MX8821

AirPods Pro (2nd gen) — ₦289,000
Subtotal: ₦289,000
Tax: ₦21,675
Total: ₦310,675

Charged to Visa ending 6411. Expected delivery: Wed, 21 May.`,
    category: "Personal",
    receivedAt: isoHoursAgo(2),
    hasAttachment: true,
    read: true,
    replies: [],
  },
  {
    id: "in-4",
    sender: "Stripe",
    subject: "Payout of $12,480.00 sent to your bank",
    preview:
      "A payout has been initiated to your Stanbic IBTC account ending in 0091...",
    body: `Hi Warehouse Admin,

A payout of $12,480.00 has been initiated to your Stanbic IBTC account ending in 0091.

Expected to arrive within 1–2 business days. View the full transactions on your Stripe dashboard.`,
    category: "Work",
    receivedAt: isoHoursAgo(3),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-5",
    sender: "LinkedIn",
    subject: "Tope, your weekly post performance is up 34%",
    preview:
      "Your recent post about supply-chain resilience reached 4,182 impressions this week...",
    body: `Hi Tope,

Your post "What our distribution network learned during the port strike" earned:

• 4,182 impressions (+34% week-over-week)
• 168 reactions
• 22 comments
• 9 reshares

Keep the momentum going.`,
    category: "Personal",
    receivedAt: isoHoursAgo(5),
    hasAttachment: false,
    read: true,
    replies: [],
  },

  // ---------------- Last 7 days ----------------
  {
    id: "in-6",
    sender: "Notion",
    subject: "Weekly summary: 3 docs edited, 12 comments",
    preview:
      "Here's what happened in your Warehouse Ops workspace this week...",
    body: `This week in your workspace:

• Q3 Warehouse Capacity Report — edited by Esther Howard
• Vendor Onboarding Checklist — 4 new comments
• Loading Bay Redesign — moved to "In review"

11 teammates were active.`,
    category: "Work",
    receivedAt: isoDaysAgo(1),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-7",
    sender: "Maersk",
    subject: "Schedule advisory: vessel Tema Express delayed 36 hours",
    preview:
      "Due to congestion at Tema port, vessel TMX-441 will discharge 36 hours behind schedule...",
    body: `Operations advisory:

Due to ongoing congestion at Tema port, vessel TMX-441 (Tema Express) will discharge approximately 36 hours behind its scheduled berth time.

Affected POs: PR-2025-0918, PR-2025-0921, PR-2025-0934.

We recommend notifying downstream customers of revised ETAs. A revised schedule will be circulated tomorrow.`,
    category: "Work",
    receivedAt: isoDaysAgo(2),
    hasAttachment: true,
    read: true,
    replies: [],
  },
  {
    id: "in-8",
    sender: "Indeed",
    subject: "3 new candidates matched: Warehouse Supervisor",
    preview:
      "We found 3 candidates who match your open role at Warehouse Ops Ltd...",
    body: `New candidates for "Warehouse Supervisor — Lagos":

• Adaeze N. — 6 yrs at DHL, fluent in WMS systems
• Mike O. — 8 yrs at Maersk warehouse, forklift certified
• Funmi B. — 4 yrs, lean operations background

View profiles to invite for interview.`,
    category: "Work",
    receivedAt: isoDaysAgo(3),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-9",
    sender: "GTBank",
    subject: "Transaction alert: ₦184,500.00 debit",
    preview:
      "A debit of ₦184,500.00 has been processed on your account ending 7782...",
    body: `Account ending 7782
Type: Debit
Amount: ₦184,500.00
Description: Filling Station — Lekki Phase 1
Available balance: ₦2,418,201.55

If you did not authorise this, please call us immediately.`,
    category: "Personal",
    receivedAt: isoDaysAgo(4),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-10",
    sender: "Calendly",
    subject: "Meeting confirmed: Quarterly Vendor Review",
    preview:
      "Your meeting with the procurement team has been confirmed for Thursday at 14:00...",
    body: `Quarterly Vendor Review
Thursday, 22 May · 14:00–15:30 WAT
Attendees: Jerome Bell, Esther Howard, Ronald Richards, Tope A.

Agenda attached. A calendar invite has been sent to all parties.`,
    category: "Work",
    receivedAt: isoDaysAgo(5),
    hasAttachment: true,
    read: true,
    replies: [],
  },
  {
    id: "in-11",
    sender: "Spotify",
    subject: "Your Discover Weekly is ready",
    preview:
      "30 new tracks picked just for you — including artists you've never heard before...",
    body: `Your Discover Weekly is ready, Tope.

Featured artists this week: Tems, Burna Boy, Adekunle Gold, Asake, Joeboy.

Open Spotify to listen.`,
    category: "Personal",
    receivedAt: isoDaysAgo(6),
    hasAttachment: false,
    read: true,
    replies: [],
  },

  // ---------------- September ----------------
  {
    id: "in-12",
    sender: "Internal Audit",
    subject: "Cycle count variance flagged — Bay 7",
    preview:
      "The most recent cycle count for Bay 7 shows a 3.2% variance against system records...",
    body: `Finding:

Cycle count for Bay 7 (SKU range 8800–8899) shows a 3.2% variance against the WMS. This exceeds the 1.5% control threshold.

Recommended action: re-count by an independent team within 5 business days and document findings in the audit log.

— Internal Audit`,
    category: "Work",
    receivedAt: isoDaysAgo(28),
    hasAttachment: true,
    read: true,
    replies: [],
  },
  {
    id: "in-13",
    sender: "AWS",
    subject: "Your AWS bill for September 2025 is ready",
    preview:
      "Your invoice of $1,842.16 is now available in the AWS billing console...",
    body: `Invoice summary — September 2025

EC2: $812.04
S3: $244.91
CloudFront: $182.67
RDS: $402.54
Other: $200.00
---
Total: $1,842.16

Auto-pay scheduled for 5 Oct.`,
    category: "Work",
    receivedAt: isoDaysAgo(32),
    hasAttachment: true,
    read: true,
    replies: [],
  },
  {
    id: "in-14",
    sender: "Booking.com",
    subject: "Your stay at Radisson Blu Ikeja is confirmed",
    preview:
      "Reservation #4429-771 confirmed for 14–16 October. Check-in from 14:00...",
    body: `Reservation #4429-771

Radisson Blu Ikeja, Lagos
Check-in: 14 Oct 2025, from 14:00
Check-out: 16 Oct 2025, by 11:00
Room: Deluxe King, Non-smoking
Total: ₦248,000

Free cancellation until 12 Oct.`,
    category: "Personal",
    receivedAt: isoDaysAgo(35),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-15",
    sender: "GitHub",
    subject: "New security advisory affects 2 of your repos",
    preview:
      "A high-severity vulnerability was disclosed in lodash@4.17.20 used in...",
    body: `Security advisory: GHSA-jf85-cpcp-j695

Affected package: lodash@4.17.20
Severity: High
Your repositories using this version:
• warehouse/api-gateway
• warehouse/ops-portal

We recommend upgrading to lodash@4.17.21 immediately.`,
    category: "Work",
    receivedAt: isoDaysAgo(38),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-16",
    sender: "Figma",
    subject: "Esther Howard mentioned you in Loading Bay Redesign",
    preview:
      "Esther left a comment: '@Tope can you check the truck clearance on frame 12?'",
    body: `Esther Howard mentioned you in "Loading Bay Redesign":

"@Tope can you check the truck clearance on frame 12? The proposed angle might not work for the 40-ft trailers we use on the Apapa route."

Click to open the file in Figma.`,
    category: "Work",
    receivedAt: isoDaysAgo(40),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-17",
    sender: "TechCrunch Daily",
    subject: "African logistics startups raised $312M in Q3",
    preview:
      "A roundup of the biggest fundraises and acquisitions in supply-chain tech...",
    body: `Top stories:

• Sendy reorganises after restructure, retains West Africa footprint
• Kobo360 launches cold-chain product
• Sokowatch rebrands to Wasoko, expands to two new countries

Read the full briefing on TechCrunch.`,
    category: "Personal",
    receivedAt: isoDaysAgo(42),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-18",
    sender: "HR @ Warehouse",
    subject: "Reminder: Q3 performance reviews due by Friday",
    preview:
      "Please complete your direct-report reviews in BambooHR before end of week...",
    body: `Hi Tope,

This is a friendly reminder that Q3 performance reviews are due by Friday, 26 September.

You have 7 direct reports awaiting review. Each review should take approximately 20 minutes.

Need help? Reach out to People Ops on #hr-helpdesk.

— HR Team`,
    category: "Work",
    receivedAt: isoDaysAgo(45),
    hasAttachment: false,
    read: true,
    replies: [],
  },

  // ---------------- August ----------------
  {
    id: "in-19",
    sender: "1Password",
    subject: "Watchtower: 3 reused passwords detected",
    preview:
      "Watchtower found 3 passwords reused across multiple sites in your vault...",
    body: `Watchtower report:

3 reused passwords detected:
• Used on Amazon, Jumia, and Konga
• Used on LinkedIn and Indeed
• Used on Slack and Notion (internal — please rotate)

Generate strong unique passwords now.`,
    category: "Personal",
    receivedAt: isoDaysAgo(70),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-20",
    sender: "Legal @ Warehouse",
    subject: "Updated supplier MSA — please review and acknowledge",
    preview:
      "The Master Service Agreement template for new suppliers has been updated...",
    body: `Hi Tope,

The Master Service Agreement template for new suppliers has been updated to reflect:

• New data-residency clause (Section 7.2)
• Revised SLA penalties (Section 11)
• Force majeure language aligned with ICC standard

Please review and acknowledge by 10 August. The redlined version is attached.

— Legal`,
    category: "Work",
    receivedAt: isoDaysAgo(75),
    hasAttachment: true,
    read: true,
    replies: [],
  },
  {
    id: "in-21",
    sender: "Uber Receipts",
    subject: "Your Saturday morning trip with Yusuf",
    preview:
      "Trip from Lekki Phase 1 to Murtala Muhammed Airport — ₦18,400...",
    body: `Trip receipt

Driver: Yusuf
Route: Lekki Phase 1 → Murtala Muhammed Airport
Duration: 47 min
Distance: 24.6 km
Total: ₦18,400 (charged to Mastercard ending 0218)`,
    category: "Personal",
    receivedAt: isoDaysAgo(82),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-22",
    sender: "IT Helpdesk",
    subject: "Your laptop is due for replacement (rolling out in October)",
    preview:
      "You're on the Oct refresh wave. Choose between MacBook Pro 14\" or 16\"...",
    body: `Hi Tope,

Records show your current MacBook is due for replacement this cycle. You're scheduled for the October refresh wave.

Please select your preferred model in the IT portal by 30 August:
• MacBook Pro 14" (M4, 24GB / 1TB)
• MacBook Pro 16" (M4 Pro, 36GB / 1TB)

Your current laptop will be wiped and returned to IT during handover.`,
    category: "Work",
    receivedAt: isoDaysAgo(88),
    hasAttachment: false,
    read: true,
    replies: [],
  },
  {
    id: "in-23",
    sender: "Notion",
    subject: "Action item assigned to you: Update fleet rotation policy",
    preview:
      "Jerome assigned you an action item in the Weekly Ops Sync notes...",
    body: `Jerome Bell assigned you an action item:

"Draft revised fleet rotation policy — quarterly rotation instead of monthly. Target circulation: Sept 15."

From the Weekly Ops Sync notes (Aug 12).`,
    category: "Work",
    receivedAt: isoDaysAgo(94),
    hasAttachment: false,
    read: true,
    replies: [],
  },
];

export const inboxCount = inbox.length;
