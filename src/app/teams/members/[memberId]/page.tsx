"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Plus,
  MapPin,
  Check,
  Smile,
  UserCircle,
  Briefcase,
  FileText,
  Bell,
  Lock,
  ChevronDown,
  Pencil,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { LetterAvatar } from "@/components/letter-avatar";
import { getMemberById, getMemberProfile } from "@/data/member-profile";
import { cn } from "@/lib/utils";

type Tab =
  | "personal"
  | "contact"
  | "work"
  | "documents"
  | "notifications"
  | "security";

const TABS: Array<{
  id: Tab;
  label: string;
  icon: typeof Smile;
}> = [
  { id: "personal", label: "Personal Details", icon: Smile },
  { id: "contact", label: "Contact Information", icon: UserCircle },
  { id: "work", label: "Work Details", icon: Briefcase },
  { id: "documents", label: "Work Documents", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
];

export default function MemberProfilePage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = use(params);
  const router = useRouter();
  const member = getMemberById(memberId);

  const [tab, setTab] = useState<Tab>("personal");
  const [nigerianTime, setNigerianTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        timeZone: "Africa/Lagos",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setNigerianTime(formatted.replace(" ", "").toLowerCase());
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!member) {
    return (
      <>
        <TopBar title="Member not found" />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <h2 className="text-[15px] font-medium mb-1.5">
              We couldn&rsquo;t find that member
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
              They may have been removed, or the URL is wrong.
            </p>
            <Link
              href="/teams"
              className="inline-flex h-8 items-center px-3 rounded text-[13px] font-medium bg-[var(--text)] text-[var(--surface)] hover:opacity-90"
            >
              Back to teams
            </Link>
          </div>
        </div>
      </>
    );
  }

  const profile = getMemberProfile(member);
  const initial = (member.initial ?? member.name.charAt(0)).toUpperCase();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/teams");
    }
  }

  return (
    <>
      <TopBar title="Teams" />

      {/* Secondary header row */}
      <div className="flex items-center justify-between px-5 md:px-8 py-3 border-b border-[var(--border)]">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <ChevronLeft size={14} />
          <span>Back</span>
        </button>
        <button className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
          <span>Invite New</span>
          <Plus size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin">
        {/* No max-width — content fills the viewport with gutters */}
        <div className="px-5 md:px-8 py-5 md:py-6">
          {/* Hero + Stats row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-4 mb-6">
            <HeroCard
              member={member}
              initial={initial}
              nigerianTime={nigerianTime}
            />
            <div className="flex flex-col gap-3">
              <StatTile label="Line Manager" value={profile.lineManager} />
              <StatTile label="Department(s)" value={profile.department} />
              <StatTile
                label="Leave Balance"
                value={String(profile.leaveBalance)}
                cta="See All"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--border)] flex items-center gap-1 overflow-x-auto scroll-thin mb-6">
            {TABS.map((t) => (
              <TabBtn
                key={t.id}
                active={tab === t.id}
                icon={t.icon}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </TabBtn>
            ))}
          </div>

          {tab === "personal" && <PersonalDetailsTab profile={profile} />}
          {tab !== "personal" && <ComingSoonTab label={tabLabel(tab)} />}
        </div>
      </div>
    </>
  );
}

function tabLabel(id: Tab): string {
  return TABS.find((t) => t.id === id)?.label ?? "";
}

// ---------- Hero card ----------

function HeroCard({
  member,
  initial,
  nigerianTime,
}: {
  member: NonNullable<ReturnType<typeof getMemberById>>;
  initial: string;
  nigerianTime: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-[var(--border)]",
        "bg-[var(--surface-2)]",
      )}
    >
      {/* Repeating icon-pattern background. Tiled across the card. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-repeat opacity-[0.45] dark:opacity-[0.12] dark:invert"
        style={{
          backgroundImage: "url(/profile-bg.png)",
          backgroundSize: "auto 88px",
        }}
      />

      {/* Content */}
      <div className="relative px-5 md:px-7 pt-6 pb-5 flex items-end gap-4 min-h-[230px]">
        {/* Left column: avatar, location, name, role */}
        <div className="flex-1 min-w-0">
          {/* Avatar with status dot */}
          <div className="relative inline-block mb-4">
            <LetterAvatar
              letter={initial}
              size="lg"
              className="!h-[88px] !w-[88px] !text-3xl !rounded-full !bg-[var(--surface)] border-2 border-[var(--surface)] shadow-[var(--shadow-sm)]"
            />
            {member.status === "Active" && (
              <span
                aria-label="Active"
                className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-[#16a34a] border-2 border-[var(--surface-2)]"
              />
            )}
          </div>

          {/* Location + time */}
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)] mb-2">
            <MapPin size={12} />
            <span>
              {nigerianTime ? `${nigerianTime}, Nigerian Time` : "Nigerian Time"}
            </span>
          </div>

          {/* Name + status pill */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl md:text-2xl font-medium tracking-tight">
              {member.name}
            </h1>
            {member.status === "Active" && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[11px] font-medium bg-[#dcfce7] dark:bg-[#14532d] text-[#166534] dark:text-[#86efac]">
                <Check size={10} strokeWidth={2.5} />
                <span>Active</span>
              </span>
            )}
            {member.status === "Inactive" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[11px] font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
                Inactive
              </span>
            )}
            {member.status === "Pending" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[11px] font-medium bg-[#fef9c3] dark:bg-[#713f12] text-[#854d0e] dark:text-[#fde68a]">
                Pending
              </span>
            )}
          </div>

          {/* Role */}
          <div className="text-sm text-[var(--text-muted)]">{member.role}</div>
        </div>

        {/* Right: Edit Image, aligned to bottom-right */}
        <button className="h-8 px-3 rounded border border-[var(--border-strong)] bg-[var(--surface)] text-[12px] text-[var(--text)] hover:bg-[var(--hover)] flex-shrink-0 self-end">
          Edit Image
        </button>
      </div>
    </div>
  );
}

// ---------- Stat tile ----------

function StatTile({
  label,
  value,
  cta,
}: {
  label: string;
  value: string;
  cta?: string;
}) {
  return (
    <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-md px-4 py-3">
      <div className="text-[11px] text-[var(--text-muted)] mb-1">{label}</div>
      <div className="text-[15px] font-medium tracking-tight">{value}</div>
      {cta && (
        <button className="absolute top-3 right-3 inline-flex items-center gap-0.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--text)]">
          <span>{cta}</span>
          <span aria-hidden>›</span>
        </button>
      )}
    </div>
  );
}

// ---------- Tab button ----------

function TabBtn({
  active,
  icon: Icon,
  onClick,
  children,
}: {
  active: boolean;
  icon: typeof Smile;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative h-10 px-3 inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap transition-colors",
        active
          ? "text-[var(--text)]"
          : "text-[var(--text-muted)] hover:text-[var(--text)]",
      )}
    >
      <Icon size={13} strokeWidth={1.6} />
      <span>{children}</span>
      {active && (
        <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-[var(--text)] rounded-sm" />
      )}
    </button>
  );
}

// ---------- Personal Details tab ----------

function PersonalDetailsTab({
  profile,
}: {
  profile: ReturnType<typeof getMemberProfile>;
}) {
  return (
    <section>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[15px] font-medium">Personal Details</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Update your personal details information
          </p>
        </div>
        <button className="h-8 px-3 rounded border border-[var(--border-strong)] text-[12px] text-[var(--text)] hover:bg-[var(--hover)] inline-flex items-center gap-1.5">
          <span>Edit</span>
          <Pencil size={11} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
        <Field label="First Name" value={profile.firstName} />
        <Field label="Middle Name" value={profile.middleName} />
        <Field label="Last Name" value={profile.lastName} />
        <Field label="Marital Status" value={profile.maritalStatus} dropdown />

        <Field label="State of Origin" value={profile.stateOfOrigin} dropdown />
        <Field label="Local Government Area" value={profile.lga} dropdown />
        <Field label="Nationality" value={profile.nationality} dropdown />
        <Field label="Date of Birth" value={profile.dateOfBirth} dropdown />

        <Field label="Title" value={profile.title} dropdown />
        <Field label="Place of Birth" value={profile.placeOfBirth} />
        <Field label="Next of Kin" value={profile.nextOfKin} />
        <Field
          label="Relationship with Next of Kin"
          value={profile.nextOfKinRelationship}
        />

        <Field label="Mother's Maiden Name" value={profile.mothersMaidenName} />
        <Field label="Spouse Name" value={profile.spouseName ?? "-"} />
        <Field
          label="No of Children"
          value={
            profile.noOfChildren === null ? "-" : String(profile.noOfChildren)
          }
        />
        <Field label="Blood Group" value={profile.bloodGroup} dropdown />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  dropdown = false,
}: {
  label: string;
  value: string;
  dropdown?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] text-[var(--text-muted)] mb-1.5">{label}</div>
      <div className="h-9 rounded border border-[var(--border)] bg-[var(--surface)] px-3 flex items-center justify-between text-[13px]">
        <span className="truncate">{value}</span>
        {dropdown && (
          <ChevronDown
            size={13}
            className="text-[var(--text-subtle)] flex-shrink-0"
          />
        )}
      </div>
    </div>
  );
}

// ---------- Coming-soon for other tabs ----------

function ComingSoonTab({ label }: { label: string }) {
  return (
    <div className="py-16 text-center">
      <div className="text-[10px] tracking-[0.18em] text-[var(--text-subtle)] mb-2">
        {label.toUpperCase()}
      </div>
      <div className="text-[15px] font-medium mb-1.5">Coming soon</div>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm mx-auto">
        We&rsquo;re focusing on Personal Details first. This tab will come in
        a future pass.
      </p>
    </div>
  );
}
