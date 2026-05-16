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
  "Aiyegbusi",
  "Jerome",
  "Esther",
  "Kathryn",
  "Dianne",
  "Ronald",
  "Leslie",
  "Theresa",
  "Cameron",
  "Eleanor",
  "Darrell",
  "Darlene",
  "Courtney",
  "Wade",
  "Guy",
  "Jacob",
  "Marvin",
  "Albert",
  "Floyd",
  "Jane",
  "Bessie",
  "Devon",
  "Brooklyn",
  "Annette",
  "Kristin",
  "Cody",
  "Savannah",
  "Robert",
  "Jenny",
  "Arlene",
  "Ralph",
  "Brandon",
];
const lastNames = [
  "Temitope",
  "Bell",
  "Howard",
  "Murphy",
  "Russell",
  "Richards",
  "Alexander",
  "Webb",
  "Williamson",
  "Pena",
  "Steward",
  "Robertson",
  "Henry",
  "Warren",
  "Hawkins",
  "Jones",
  "McKinney",
  "Flores",
  "Miles",
  "Cooper",
  "Black",
  "Lane",
  "Simmons",
  "Cooper",
  "Watson",
  "Fisher",
  "Nguyen",
  "Fox",
  "Wilson",
  "McCoy",
  "Edwards",
  "Berg",
];

const emails = [
  "willie.jennings",
  "jackson.graham",
  "deanna.curtis",
  "kenzi.lawson",
  "debra.holt",
  "tanya.hill",
  "nathan.roberts",
  "michelle.rivera",
  "sara.cruz",
  "jessica.hanson",
  "felicia.reid",
  "tim.jennings",
  "curtis.weaver",
  "michael.mitc",
  "alma.lawson",
  "debbie.baker",
  "bill.sanders",
  "georgia.young",
  "dolores.chambers",
  "nevaeh.simmons",
];

const departments = [
  "Operations",
  "Product Design",
  "Customer Experience",
  "Finance",
  "Human Resources",
  "Compliance",
  "Logistics",
  "Marketing",
  "Engineering",
];

const managers = [
  "Olawale Oguntayo",
  "Amina Yusuf",
  "David Nwachukwu",
  "Kemi Adeyemi",
  "Emeka Chukwu",
  "Efe Akinlabi",
];

const timeZones = ["Nigerian Time", "GMT+1", "GMT+0", "GMT+2", "ET"];

const locations = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];

const phones = [
  "+234 701 234 5678",
  "+234 802 345 6789",
  "+234 803 456 7890",
  "+234 805 678 9012",
  "+234 809 123 4567",
];

const startDates = [
  "Jan 12, 2021",
  "Mar 8, 2022",
  "Jul 19, 2019",
  "Sep 2, 2020",
  "Nov 15, 2023",
];

const offices = [
  "Lagos HQ",
  "Abuja Hub",
  "Port Harcourt Office",
  "Ibadan Satellite",
  "Kano Branch",
];

const employmentTypes = ["Full Time", "Contract", "Part Time"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}

export const members: Member[] = Array.from({ length: 32 }).map((_, i) => {
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
    id: `m-${i + 1}`,
    name,
    email: `${emailUser}@example.com`,
    status,
    role: pick(roles, i + 2),
    department: pick(departments, i),
    lineManager: pick(managers, i + 1),
    leaveBalance: 20 + (i % 7) * 2,
    timeZone: pick(timeZones, i),
    phone: pick(phones, i),
    location: pick(locations, i),
    startDate: pick(startDates, i),
    employmentType: pick(employmentTypes, i),
    office: pick(offices, i),
  };
});

export const memberCounts = {
  all: members.length,
  active: members.filter((m) => m.status === "Active").length,
  inactive: members.filter((m) => m.status === "Inactive").length,
  pending: members.filter((m) => m.status === "Pending").length,
};
