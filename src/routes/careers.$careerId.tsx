import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Hammer,
  Lightbulb,
  Target,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/nextpath/shell";
import { MatchRing, NeedsProfile } from "@/components/nextpath/guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { careerById, CAREERS } from "@/data/nextpath";
import {
  alternativesFor,
  analyseGaps,
  improvementActions,
  programmeFit,
  programmesForCareer,
  projectsForCareerId,
  scoreCareer,
  STATUS_LABEL,
} from "@/lib/matching";
import { useProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/careers/$careerId")({
  loader: ({ params }) => {
    const career = careerById(params.careerId);
    if (!career) throw notFound();
    return { career };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.career.title} pathway — NextPath` : "Career — NextPath";
    const description = loaderData
      ? `${loaderData.career.blurb} See the subjects, marks, skills, projects and study pathways for ${loaderData.career.title}.`
      : "Career pathway details on NextPath.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CareerDetail,
});

const STATUS_TONE: Record<string, string> = {
  "on-track": "border-success/40 bg-success/10 text-success",
  close: "border-warning/40 bg-warning/10 text-warning",
  "needs-improvement": "border-warning/40 bg-warning/10 text-warning",
  "not-enough-data": "border-border bg-surface-2 text-muted-foreground",
};

function CareerDetail() {
  const { career } = Route.useLoaderData();
  const { profile, update } = useProfile();

  if (!profile) {
    return (
      <AppShell>
        <NeedsProfile />
      </AppShell>
    );
  }

  const match = scoreCareer(profile, career);
  const gaps = analyseGaps(profile, career);
  const alternatives = alternativesFor(profile, career);
  const programmes = programmesForCareer(career);
  const projects = projectsForCareerId(career.id);
  const realGaps = gaps.gaps.filter((g) => g.current !== null && g.delta > 0);
  const isTarget = profile.targetCareerId === career.id;

  return (
    <AppShell>
      <PageHeader
        eyebrow={career.category}
        title={`${career.emoji} ${career.title}`}
        description={career.description}
        action={
          <div className="flex items-center gap-3">
            <MatchRing score={match.score} />
            <Button
              variant={isTarget ? "secondary" : "default"}
              onClick={() => update({ targetCareerId: career.id, goalMode: "known" })}
            >
              {isTarget ? "This is my target" : "Make this my pathway"}
            </Button>
          </div>
        }
      />

      <Badge variant="outline" className="mb-6">
        Exploration recommendation — not a guarantee of suitability
      </Badge>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-6">
          <h2 className="font-semibold">Why it may fit you</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {match.reasons.map((r) => (
              <li key={r} className="flex gap-2">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-6">
          <h2 className="font-semibold">Subjects that support it</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {career.requiredSubjects.map((s) => (
              <Badge key={s}>{s} · required</Badge>
            ))}
            {career.recommendedSubjects.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
            {!career.requiredSubjects.length ? (
              <p className="text-sm text-muted-foreground">
                No strict subject requirement — but the recommended subjects help a lot.
              </p>
            ) : null}
          </div>
        </div>
        <div className="panel p-6">
          <h2 className="font-semibold">A typical day</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {career.dayToDay.map((d) => (
              <li key={d}>• {d}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* GAP ANALYSIS */}
      <section className="panel mt-8 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Where you stand today</h2>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-sm ${STATUS_TONE[gaps.status] ?? ""}`}
          >
            {STATUS_LABEL[gaps.status]}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[...gaps.met, ...gaps.gaps].map((row) => {
            const ok = row.current !== null && row.current >= row.target;
            return (
              <div key={row.subject} className="rounded-xl border border-border bg-surface-2 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{row.subject}</span>
                  {ok ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : (
                    <AlertTriangle className="size-4 text-warning" />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  You: {row.current === null ? "no mark captured" : `${row.current}%`} · Example
                  target: {row.target}%+
                </p>
                <Progress value={row.current ?? 0} className="mt-3" />
              </div>
            );
          })}
        </div>

        {gaps.missingSubjects.length ? (
          <p className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
            You are not currently taking: {gaps.missingSubjects.join(", ")}. This is a subject you
            would need to choose for Grade 10 to keep this pathway open.
          </p>
        ) : null}

        <p className="mt-4 text-sm text-muted-foreground">
          Your current profile{" "}
          {gaps.status === "on-track"
            ? "already reaches this pathway's example targets."
            : "does not yet meet this pathway's example requirements — that is normal in Grade 9, and here is what you can work on."}
        </p>
      </section>

      {/* IMPROVEMENT PLAN */}
      {realGaps.length ? (
        <section className="panel mt-6 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Your improvement plan</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {realGaps.map((g) => (
              <div key={g.subject} className="rounded-xl border border-border bg-surface-2 p-5">
                <p className="font-medium">{g.subject}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current: {g.current}% → Target: {g.target}%+ ({g.delta} percentage points to go)
                </p>
                <ol className="mt-3 space-y-2 text-sm">
                  {improvementActions(g.subject).map((a, i) => (
                    <li key={a} className="flex gap-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[11px] text-primary">
                        {i + 1}
                      </span>
                      {a}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ALTERNATIVES */}
      <section className="panel mt-6 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">You still have options</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These alternatives are not failures or second-class careers. They share the interests and
          strengths you told us about.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {alternatives.map((alt) => (
            <Link
              key={alt.career.id}
              to="/careers/$careerId"
              params={{ careerId: alt.career.id }}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface-2 p-4 transition-colors hover:border-primary/50"
            >
              <MatchRing score={alt.score} />
              <div>
                <p className="font-medium">
                  {alt.career.emoji} {alt.career.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{alt.reasons.join(" ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SKILLS + PROJECTS */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="panel p-6">
          <h2 className="text-xl font-semibold">Skills to develop</h2>
          {(["Beginner", "Intermediate", "Advanced"] as const).map((level) => (
            <div key={level} className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{level}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {career.skills[level].map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="panel p-6">
          <div className="flex items-center gap-2">
            <Hammer className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Projects you can build now</h2>
          </div>
          <div className="mt-4 space-y-3">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-surface-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{p.title}</p>
                  <Badge variant="outline">{p.level}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {p.time} · Skills: {p.skills.join(", ")}
                </p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/skills">
              See all skills & projects <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      </div>

      {/* EDUCATION */}
      <section className="panel mt-6 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Education pathways</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Example requirements from a verified demo dataset. Always verify current requirements with
          the institution.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {programmes.map((p) => {
            const fit = programmeFit(profile, p);
            return (
              <div key={p.id} className="rounded-xl border border-border bg-surface-2 p-5">
                <p className="text-sm text-muted-foreground">{p.university}</p>
                <p className="font-medium">{p.programme}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.degree} · {p.duration} · APS {p.aps} · {p.faculty}
                </p>
                <ul className="mt-3 space-y-1 text-xs">
                  {fit.rows.map((r) => (
                    <li key={r.subject} className="flex items-center gap-2">
                      {r.current !== null && r.current >= r.min ? (
                        <CheckCircle2 className="size-3.5 text-success" />
                      ) : (
                        <AlertTriangle className="size-3.5 text-warning" />
                      )}
                      {r.subject} {r.min}% (you:{" "}
                      {r.current === null ? "not captured" : `${r.current}%`})
                    </li>
                  ))}
                </ul>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Official source <ExternalLink className="size-3" />
                </a>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Requirements verified: {p.verified}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/roadmap">Open my roadmap</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/ai">Ask NextPath AI about this pathway</Link>
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Related careers in the dataset:{" "}
        {career.related
          .map((id) => CAREERS.find((c) => c.id === id)?.title)
          .filter(Boolean)
          .join(", ")}
      </p>
    </AppShell>
  );
}
