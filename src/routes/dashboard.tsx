import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TrendingUp, Target, BookOpen } from "lucide-react";
import { AppShell } from "@/components/nextpath/shell";
import { MatchRing, NeedsProfile } from "@/components/nextpath/guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { INTERESTS, STRENGTHS } from "@/data/nextpath";
import {
  analyseGaps,
  improvementActions,
  rankCareers,
  roadmapProgress,
  STATUS_LABEL,
  strongestSubjects,
  targetCareer,
} from "@/lib/matching";
import { useProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — NextPath" },
      {
        name: "description",
        content:
          "See your exploration career matches, strongest subjects, areas to improve and your next recommended action.",
      },
      { property: "og:title", content: "Your dashboard — NextPath" },
      {
        property: "og:description",
        content: "Career matches, strengths and your next recommended action in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const labelFor = (list: { id: string; label: string }[], id: string) =>
  list.find((x) => x.id === id)?.label ?? id;

function Dashboard() {
  const { profile } = useProfile();
  if (!profile) {
    return (
      <AppShell>
        <NeedsProfile />
      </AppShell>
    );
  }

  const matches = rankCareers(profile).slice(0, 4);
  const career = targetCareer(profile);
  const gaps = career ? analyseGaps(profile, career) : null;
  const topGap = gaps?.gaps.find((g) => g.current !== null && g.delta > 0);
  const progress = roadmapProgress(profile);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Hi {profile.name || "there"} 👋</p>
        <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Let's discover your path.</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Your exploration matches</h2>
            <Badge variant="secondary">Exploration match — not a guarantee</Badge>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {matches.map((m) => (
              <Link
                key={m.career.id}
                to="/careers/$careerId"
                params={{ careerId: m.career.id }}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface-2 p-4 transition-colors hover:border-primary/50"
              >
                <MatchRing score={m.score} />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {m.career.emoji} {m.career.title}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{m.reasons[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="font-semibold">Roadmap progress</h2>
          <p className="mt-4 text-4xl font-semibold text-primary">{progress}%</p>
          <Progress value={progress} className="mt-3" />
          <p className="mt-3 text-sm text-muted-foreground">
            Complete roadmap steps to move from Grade 9 toward{" "}
            {career ? career.title : "your career"}.
          </p>
          <Button asChild className="mt-5 w-full">
            <Link to="/roadmap">
              Open my roadmap <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="size-4" />
            <h2 className="font-semibold text-foreground">Strongest subjects</h2>
          </div>
          <div className="mt-4 space-y-3">
            {strongestSubjects(profile).map(([subject, mark]) => (
              <div key={subject}>
                <div className="flex justify-between text-sm">
                  <span>{subject}</span>
                  <span className="text-muted-foreground">{mark}%</span>
                </div>
                <Progress value={mark} className="mt-1.5" />
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-4" />
            <h2 className="font-semibold text-foreground">Your strengths & interests</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.strengths.map((s) => (
              <Badge key={s} variant="secondary">
                {labelFor(STRENGTHS, s)}
              </Badge>
            ))}
            {profile.interests.map((i) => (
              <Badge key={i} variant="outline">
                {labelFor(INTERESTS, i)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-2 text-primary">
            <Target className="size-4" />
            <h2 className="font-semibold text-foreground">Next recommended action</h2>
          </div>
          {topGap && career ? (
            <>
              <p className="mt-4 text-sm">
                Improve <span className="font-medium">{topGap.subject}</span> from{" "}
                {topGap.current}% toward the example target of {topGap.target}%+ for{" "}
                {career.title}.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {improvementActions(topGap.subject)
                  .slice(0, 3)
                  .map((a) => (
                    <li key={a} className="flex gap-2">
                      <BookOpen className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {a}
                    </li>
                  ))}
              </ul>
              <Badge className="mt-4" variant="outline">
                {gaps ? STATUS_LABEL[gaps.status] : ""}
              </Badge>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Your marks already reach the example targets for {career?.title}. Start your first
              project to build proof of your skills.
            </p>
          )}
          <Button asChild variant="outline" className="mt-5 w-full">
            <Link to="/ai">Ask NextPath AI what to do next</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
