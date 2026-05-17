import type { Member } from "@/lib/types";

// Roles drawn from a logistics/operations company context.
const roles = [
  "Operations Lead",
  "Warehouse Supervisor",
  "Logistics Coordinator",
  "Procurement Officer",
  "Inventory Analyst",
  "Fleet Manager",
  "Software Engineer",
  "Product Designer",
  "Marketing Coordinator",
  "Account Executive",
  "Customer Support Lead",
  "Finance Analyst",
  "HR Business Partner",
  "Compliance Officer",
  "Data Analyst",
];

const firstNames = [
  "Aiyegbusi", "Jerome", "Esther", "Kathryn", "Dianne", "Ronald", "Leslie",
  "Theresa", "Cameron", "Eleanor", "Darrell", "Darlene", "Courtney", "Wade",
  "Guy", "Jacob", "Marvin", "Albert", "Floyd", "Jane", "Bessie", "Devon",
  "Brooklyn", "Annette", "Kristin", "Cody", "Savannah", "Robert", "Jenny",
  "Arlene", "Ralph", "Brandon",
];
const lastNames = [
  "Temitope", "Bell", "Howard", "Murphy", "Russell", "Richards", "Alexander",
  "Webb", "Williamson", "Pena", "Steward", "Robertson", "Henry", "Warren",
  "Hawkins", "Jones", "McKinney", "Flores", "Miles", "Cooper", "Black",
  "Lane", "Simmons", "Cooper", "Watson", "Fisher", "Nguyen", "Fox", "Wilson",
  "McCoy", "Edwards", "Berg",
];

const emails = [
  "willie.jennings", "jackson.graham", "deanna.curtis", "kenzi.lawson",
  "debra.holt", "tanya.hill", "nathan.roberts", "michelle.rivera",
  "sara.cruz", "jessica.hanson", "felicia.reid", "tim.jennings",
  "curtis.weaver", "michael.mitc", "alma.lawson", "debbie.baker",
  "bill.sanders", "georgia.young", "dolores.chambers", "nevaeh.simmons",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}

const generated: Member[] = Array.from({ length: 31 }).map((_, i) => {
  const name = `${pick(firstNames, i)} ${pick(lastNames, i + 3)}`;
  const emailUser = pick(emails, i);
  const statusRoll = i % 7;
  const status =
    statusRoll === 5
      ? "Pending"
      : statusRoll === 1 || statusRoll === 3
        ? "Inactive"
        : "Active";
  return {
    id: `m-${i + 2}`,
    name,
    email: `${emailUser}@example.com`,
    status,
    role: pick(roles, i + 2),
  };
});

// Temitope (the current user) lives at the top of the member directory so
// clicking her surfaces the hand-authored profile.
const temitope: Member = {
  id: "m-1",
  name: "Temitope Aiyegbusi",
  email: "temitope@workspace.org",
  status: "Active",
  role: "Product Designer",
  initial: "T",
};

export const members: Member[] = [temitope, ...generated];

export const memberCounts = {
  all: members.length,
  active: members.filter((m) => m.status === "Active").length,
  inactive: members.filter((m) => m.status === "Inactive").length,
  pending: members.filter((m) => m.status === "Pending").length,
};
