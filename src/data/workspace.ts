import type { Team } from "@/lib/types";

export const workspace = {
  name: "Workspace",
  email: "admin@workspace.org",
  plan: "Premium" as const,
  role: "Admin" as const,
  initial: "W",
};

export const currentUser = {
  name: "Tope A.",
  fullName: "Temitope Aiyegbusi",
  email: "temitope@workspace.org",
  initial: "T",
};

export const teams: Team[] = [
  { id: "engineering", name: "Engineering", initial: "E", locked: true },
  { id: "marketing", name: "Product X Marketing", initial: "P", locked: false },
  { id: "cx", name: "Customer Experience", initial: "C", locked: false },
  { id: "accounting", name: "Accounting", initial: "A", locked: false },
  { id: "product-design", name: "Product Design", initial: "P", locked: true },
  { id: "audit", name: "Audit", initial: "A", locked: false },
  { id: "sales", name: "Sales", initial: "S", locked: true },
];
