import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { LetterAvatar } from "@/components/letter-avatar";
import { members } from "@/data/members";
import { initials } from "@/lib/utils";

export default function MemberDetailPage(props: any) {
  const { params } = props;
  const member = members.find((item) => item.id === params.memberId);

  if (!member) {
    return (
      <>
        <TopBar title="Teams" />
        <div className="flex-1 min-h-0 px-5 md:px-8 lg:px-10 py-6">
          <div className="max-w-4xl mx-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Member not found.
            </p>
            <Link
              href="/teams"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--text)] hover:text-[var(--text-muted)]"
            >
              <ArrowLeft size={16} /> Back to members
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Teams" />

      <div className="flex-1 min-h-0 px-5 md:px-8 lg:px-10 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/teams"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <ArrowLeft size={14} /> Back to members
              </Link>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)]">
                {member.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Full-page member detail view with a clean back path and profile
                overview.
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-muted)]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                Office
              </p>
              <p className="mt-1 text-[14px] text-[var(--text)]">
                {member.office}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                Employment type
              </p>
              <p className="mt-1 text-[14px] text-[var(--text)]">
                {member.employmentType}
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <LetterAvatar
                  letter={initials(member.name).charAt(0)}
                  size="lg"
                  className="h-20 w-20 text-2xl"
                />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                    {member.status}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                    Line manager
                  </p>
                  <p className="mt-2 text-[15px] text-[var(--text)]">
                    {member.lineManager}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                    Leave balance
                  </p>
                  <p className="mt-2 text-[15px] text-[var(--text)]">
                    {member.leaveBalance} days
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h2 className="text-sm font-semibold text-[var(--text)]">
                  Contact & work details
                </h2>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                      Email
                    </dt>
                    <dd className="mt-2 text-sm text-[var(--text)] break-all">
                      {member.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                      Phone
                    </dt>
                    <dd className="mt-2 text-sm text-[var(--text)]">
                      {member.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                      Department
                    </dt>
                    <dd className="mt-2 text-sm text-[var(--text)]">
                      {member.department}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                      Location
                    </dt>
                    <dd className="mt-2 text-sm text-[var(--text)]">
                      {member.location}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h2 className="text-sm font-semibold text-[var(--text)]">
                  Status summary
                </h2>
                <dl className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
                    <dt className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                      Start date
                    </dt>
                    <dd className="mt-2 text-[15px] text-[var(--text)]">
                      {member.startDate}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
                    <dt className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                      Time zone
                    </dt>
                    <dd className="mt-2 text-[15px] text-[var(--text)]">
                      {member.timeZone}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
