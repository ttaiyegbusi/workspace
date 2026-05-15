import type { Contact } from "@/lib/types";

// External people the workspace deals with — vendors, customers, partners, regulators.
// Deliberately seeded with names that exercise the "Ran"/"Ras" search prefix shown in the mockup,
// plus a wider mix.
export const contacts: Contact[] = [
  // "Ran" hits — directly searchable
  {
    id: "ct-1",
    name: "Randy Orton",
    email: "randy.orton@maersk.com",
    company: "Maersk Line",
  },
  {
    id: "ct-2",
    name: "Rand Jessica",
    email: "jessica.rand@dhl.com",
    company: "DHL Express",
  },
  {
    id: "ct-3",
    name: "Rand Martins",
    email: "r.martins@stripe.com",
    company: "Stripe",
  },
  // Vendors
  {
    id: "ct-4",
    name: "Adaeze Okoro",
    email: "a.okoro@apapaport.gov.ng",
    company: "Apapa Port Authority",
  },
  {
    id: "ct-5",
    name: "Tunde Bakare",
    email: "tunde@greenfleet.ng",
    company: "GreenFleet Logistics",
  },
  {
    id: "ct-6",
    name: "Priya Ramanathan",
    email: "priya.r@unilever.com",
    company: "Unilever Nigeria",
  },
  {
    id: "ct-7",
    name: "Chinedu Eze",
    email: "chinedu@coldstore.africa",
    company: "ColdStore Africa",
  },
  {
    id: "ct-8",
    name: "Sarah Klein",
    email: "sarah.klein@dbschenker.com",
    company: "DB Schenker",
  },
  // Customers
  {
    id: "ct-9",
    name: "Olumide Adeyemi",
    email: "olumide@jumia.com.ng",
    company: "Jumia Logistics",
  },
  {
    id: "ct-10",
    name: "Funmi Williams",
    email: "f.williams@konga.com",
    company: "Konga Express",
  },
  {
    id: "ct-11",
    name: "Anita Eboigbe",
    email: "anita@glovo.com",
    company: "Glovo Africa",
  },
  // Regulators / compliance
  {
    id: "ct-12",
    name: "Ibrahim Suleiman",
    email: "isuleiman@customs.gov.ng",
    company: "Nigeria Customs Service",
  },
  {
    id: "ct-13",
    name: "Grace Nwosu",
    email: "g.nwosu@nimasa.gov.ng",
    company: "NIMASA",
  },
  // Professional services
  {
    id: "ct-14",
    name: "James Okeke",
    email: "james@kpmg.com.ng",
    company: "KPMG Nigeria",
  },
  {
    id: "ct-15",
    name: "Linda Mehta",
    email: "linda.mehta@accenture.com",
    company: "Accenture",
  },
  // Tech vendors
  {
    id: "ct-16",
    name: "Karim Hassan",
    email: "karim@flexport.com",
    company: "Flexport",
  },
  {
    id: "ct-17",
    name: "Yuki Tanaka",
    email: "y.tanaka@kobo360.com",
    company: "Kobo360",
  },
];
