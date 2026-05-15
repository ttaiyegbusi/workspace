import type { DocItem } from "@/lib/types";

const docSeeds: Array<Omit<DocItem, "id" | "uploadedAt" | "uploadedBy">> = [
  { name: "Q3 Warehouse Capacity Report", type: "pdf", size: "2.4mb" },
  { name: "Vendor Onboarding Checklist", type: "doc", size: "184kb" },
  { name: "Fleet Maintenance Schedule 2025", type: "xls", size: "612kb" },
  { name: "Loading Bay Redesign", type: "fig", size: "8.2mb" },
  { name: "Inventory Audit — Sept", type: "pdf", size: "1.1mb" },
  { name: "All-Hands Town Hall Recording", type: "audio", size: "42mb" },
  { name: "Cold Storage Compliance Policy", type: "pdf", size: "780kb" },
  { name: "Shipment Anomalies Dashboard", type: "xls", size: "1.8mb" },
  { name: "Brand Refresh — Logo Concepts", type: "fig", size: "14mb" },
  { name: "Driver Safety Training Manual", type: "pdf", size: "3.6mb" },
  { name: "Procurement Forecast — FY26", type: "xls", size: "920kb" },
  { name: "Distribution Center Floor Plan", type: "pdf", size: "5.2mb" },
  { name: "Returns Workflow Diagram", type: "fig", size: "2.1mb" },
  { name: "Weekly Ops Sync Notes", type: "doc", size: "92kb" },
  { name: "Carrier Rate Negotiation Deck", type: "pdf", size: "4.4mb" },
  { name: "Annual Stocktake Photos", type: "zip", size: "120mb" },
  { name: "Workforce Scheduling Template", type: "xls", size: "340kb" },
  { name: "Pallet Tracking System Mockups", type: "fig", size: "11mb" },
  { name: "Loading Dock Incident Report", type: "pdf", size: "640kb" },
  { name: "Quarterly Customer NPS Survey", type: "xls", size: "1.4mb" },
  { name: "Supplier Contract — Lagos Hub", type: "pdf", size: "2.8mb" },
  { name: "Forklift Operator Certification", type: "pdf", size: "1.6mb" },
  { name: "Mobile App Wireframes v2", type: "fig", size: "9.4mb" },
  { name: "Hazmat Handling Procedures", type: "pdf", size: "2.0mb" },
  { name: "Customs Documentation Bundle", type: "zip", size: "38mb" },
];

const authors = [
  "Temitope Aiyegbusi",
  "Jerome Bell",
  "Esther Howard",
  "Kathryn Murphy",
  "Ronald Richards",
];

function isoDaysAgo(d: number) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

export const docs: DocItem[] = docSeeds.map((d, i) => ({
  id: `doc-${i + 1}`,
  ...d,
  uploadedBy: authors[i % authors.length]!,
  uploadedAt: isoDaysAgo(i * 2 + 1),
}));
