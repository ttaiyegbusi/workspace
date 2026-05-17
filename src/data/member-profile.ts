import type { Member, MemberProfile } from "@/lib/types";
import { members } from "@/data/members";

/** Nigerian states paired with one plausible LGA for each — used for synthesis. */
const stateLga: Array<[string, string]> = [
  ["Lagos", "Ikeja"],
  ["Lagos", "Eti-Osa"],
  ["Ogun", "Ikenne"],
  ["Ogun", "Abeokuta South"],
  ["Oyo", "Ibadan North"],
  ["Kwara", "Ilorin West"],
  ["Edo", "Oredo"],
  ["Anambra", "Awka South"],
  ["Rivers", "Port Harcourt"],
  ["Enugu", "Enugu South"],
  ["Kaduna", "Kaduna North"],
  ["Plateau", "Jos North"],
];

const cities = [
  "Lagos",
  "Ibadan",
  "Abeokuta",
  "Ilorin",
  "Benin City",
  "Awka",
  "Port Harcourt",
  "Enugu",
  "Kaduna",
  "Jos",
  "Abuja",
  "Owerri",
];

const lineManagers = [
  "Olawale Oguntayo",
  "Adaeze Okonkwo",
  "Babatunde Adeyemi",
  "Chinedu Eze",
  "Folake Ajayi",
  "Ibrahim Bello",
];

const departments = [
  "Product Design",
  "Engineering",
  "Operations",
  "Customer Experience",
  "Marketing",
  "Finance",
  "People Operations",
];

const bloodGroups: MemberProfile["bloodGroup"][] = [
  "O+",
  "O-",
  "A+",
  "B+",
  "AB+",
];

const maritalStatuses: MemberProfile["maritalStatus"][] = [
  "Single",
  "Married",
  "Married",
  "Single",
];

/** Deterministic hash so the same member always gets the same fake profile. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickFrom<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]!;
}

/** Synthesize a plausible profile from a member's name + id. */
function synthesizeProfile(member: Member): MemberProfile {
  const h = hash(member.id + member.name);
  const parts = member.name.split(" ");
  const firstName = parts[0] ?? member.name;
  const lastName = parts[parts.length - 1] ?? "";
  const [state, lga] = stateLga[h % stateLga.length]!;
  const married = pickFrom(maritalStatuses, h >> 3) === "Married";
  const title: MemberProfile["title"] = married && h % 5 === 0 ? "Mrs" : "Mr";

  // Birth year between 1980 and 1998
  const year = 1980 + (h % 19);
  const month = ((h >> 5) % 12) + 1;
  const day = ((h >> 9) % 27) + 1;
  const dob = new Date(year, month - 1, day);

  return {
    firstName,
    middleName: pickFrom(
      ["Adeola", "Chukwuma", "Olufemi", "Ngozi", "Tunde", "Adaeze"],
      h >> 7,
    ),
    lastName,
    maritalStatus: married ? "Married" : "Single",
    stateOfOrigin: state,
    lga,
    nationality: "Nigerian",
    dateOfBirth: dob.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    title,
    placeOfBirth: pickFrom(cities, h >> 11),
    nextOfKin: married
      ? title === "Mrs"
        ? `${firstName} ${lastName}`
        : `${pickFrom(["Adunni", "Fatima", "Chioma", "Bisi"], h >> 13)} ${lastName}`
      : `${pickFrom(["Adunni", "Chinedu", "Folake", "Tunde"], h >> 13)} ${lastName}`,
    nextOfKinRelationship: married
      ? "Spouse"
      : pickFrom(["Brother", "Sister", "Mother", "Father"], h >> 15),
    mothersMaidenName: pickFrom(
      ["Adeleke", "Okafor", "Bamidele", "Eze", "Olawale", "Adekunle"],
      h >> 17,
    ),
    spouseName: married
      ? `${pickFrom(["Adunni", "Chinedu", "Folake", "Tunde", "Bisi"], h >> 19)} ${lastName}`
      : null,
    noOfChildren: married ? h % 4 : null,
    bloodGroup: pickFrom(bloodGroups, h >> 21),

    lineManager: pickFrom(lineManagers, h >> 23),
    department: pickFrom(departments, h >> 25),
    leaveBalance: 15 + (h % 16),
  };
}

/** Hand-authored profile for the current user (Temitope). */
const temitopeProfile: MemberProfile = {
  firstName: "Temitope",
  middleName: "Ayokunle",
  lastName: "Aiyegbusi",
  maritalStatus: "Single",
  stateOfOrigin: "Ogun",
  lga: "Ikenne",
  nationality: "Nigerian",
  dateOfBirth: "3rd November, 1991",
  title: "Mr",
  placeOfBirth: "Ibadan",
  nextOfKin: "Ayobami Aiyegbusi",
  nextOfKinRelationship: "Brother",
  mothersMaidenName: "Omolola",
  spouseName: null,
  noOfChildren: null,
  bloodGroup: "O+",

  lineManager: "Olawale Oguntayo",
  department: "Product Design",
  leaveBalance: 25,
};

/** Get a member's profile, falling back to a synthesized one. */
export function getMemberProfile(member: Member): MemberProfile {
  if (member.profile) return member.profile;
  // Temitope is the protagonist — hand-authored profile when she's referenced by name
  if (member.name.toLowerCase().includes("temitope")) {
    return temitopeProfile;
  }
  return synthesizeProfile(member);
}

/** Get a member by id, including a profile. Returns null if not found. */
export function getMemberById(id: string): Member | null {
  return members.find((m) => m.id === id) ?? null;
}
