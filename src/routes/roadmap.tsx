import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Circle, ExternalLink, MapPin } from "lucide-react";
import { AppShell, PageHeader } from "@/components/nextpath/shell";
import { NeedsProfile } from "@/components/nextpath/guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OPPORTUNITIES } from "@/data/nextpath";
import {
  programmesForCareer,
  projectsForCareerId,
  roadmapProgress,
  ROADMAP_STAGES,
  targetCareer,
} from "@/lib/matching";
import { useProfile } from "@/lib/profile-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "My roadmap — NextPath" },
      {
        name: "description",
        content:
          "Your visual roadmap from Grade 9 to your target career: subjects, skills, projects, education and opportunities.",
      },
      { property: "og:title", content: "My roadmap — NextPath" },
      {
        property: "og:description",
        content: "Every stage from Grade 9 to your future career, in one visual roadmap.",
      },
    ],
  }),
  component: Roadmap,
});

function Roadmap() {
  const { profile, toggleStep } = useProfile();
  const [open, setOpen] = useState<string>("profile");

  if (!profile) {
    return (
      <AppShell>
        <NeedsProfile />
      </AppShell>
    );
  }

  const career = targetCareer(profile);
  const progress = roadmapProgress(profile);
  const projects = career ? projectsForCareerId(career.id) : [];
  const programmes = career ? programmesForCareer(career) : [];
  const opportunities = career
    ? OPPORTUNITIES.filter((o) => o.areas.some((a) => career.opportunityAreas.includes(a)))
    : [];

  const content: Record<string, React.ReactNode> = {
    profile: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          {profile.name}, {profile.grade}
          {profile.province ? ` · ${profile.province}` : ""}
        </p>
        <p>Subjects: {profile.subjects.join(", ")}</p>
        <p>
          Marks:{" "}
          {Object.entries(profile.marks)
            .map(([s, m]) => `${s} ${m}%`)
            .join(" · ")}
        </p>
      </div>
    ),
    subjects: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          Keep or choose for Grade 10:{" "}
          <span className="text-foreground">
            {career ? [...career.requiredSubjects, ...career.recommendedSubjects].join(", ") : "—"}
          </span>
        </p>
        <p>Required subjects cannot be swapped later without closing this pathway.</p>
      </div>
    ),
    skills: (
      <div className="flex flex-wrap gap-2">
        {career?.skills.Beginner.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
    ),
    projects: (
      <ul className="space-y-2 text-sm text-muted-foreground">
        {projects.slice(0, 3).map((p) => (
          <li key={p.id}>
            • {p.title} — {p.level}, {p.time}
          </li>
        ))}
      </ul>
    ),
    education: (
      <ul className="space-y-2 text-sm text-muted-foreground">
        {programmes.slice(0, 3).map((p) => (
          <li key={p.id}>
            • {p.programme}, {p.university} (APS {p.aps}) —{" "}
            <a href={p.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              source <ExternalLink className="inline size-3" />
            </a>
          </li>
        ))}
      </ul>
    ),
    career: (
      <div className="text-sm text-muted-foreground">
        <p className="text-foreground">
          {career?.emoji} {career?.title}
        </p>
        <p className="mt-1">{career?.description}</p>
        {career ? (
          <Button asChild variant="link" className="mt-1 h-auto p-0">
            <Link to="/careers/$careerId" params={{ careerId: career.id }}>
              Open gap analysis
            </Link>
          </Button>
        ) : null}
      </div>
    ),
    opportunities: (
      <ul className="space-y-2 text-sm text-muted-foreground">
        {opportunities.slice(0, 3).map((o) => (
          <li key={o.id}>
            • {o.name} — {o.organisation} ({o.type})
          </li>
        ))}
      </ul>
    ),
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Core product"
        title="My roadmap"
        description={`From Grade 9 to ${career?.title ?? "your future career"}. Tap a stage to see what it means and tick it off as you go.`}
        action={
          <div className="w-56">
            <p className="text-sm text-muted-foreground">Roadmap progress</p>
            <p className="text-2xl font-semibold text-primary">{progress}%</p>
            <Progress value={progress} className="mt-2" />
          </div>
        }
      />

      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border sm:left-[23px]" />
        <div className="space-y-4">
          {ROADMAP_STAGES.map((stage, index) => {
            const done = profile.completedSteps.includes(stage.id);
            const current = !done && index === profile.completedSteps.length;
            const isOpen = open === stage.id;
            return (
              <div key={stage.id} className="relative pl-12 sm:pl-16">
                <button
                  onClick={() => toggleStep(stage.id)}
                  aria-label={`Toggle ${stage.title} complete`}
                  className={cn(
                    "absolute left-0 top-3 grid size-10 place-items-center rounded-full border-2 transition-colors sm:size-12",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : current
                        ? "border-primary bg-background text-primary"
                        : "border-border bg-surface text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-5" /> : <Circle className="size-4" />}
                </button>

                <button
                  onClick={() => setOpen(isOpen ? "" : stage.id)}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-colors",
                    isOpen ? "border-primary/50 bg-surface-2" : "border-border bg-surface",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {index === 0 ? <MapPin className="size-4 text-primary" /> : null}
                    <p className="font-semibold">{stage.title}</p>
                    <Badge variant={done ? "default" : current ? "secondary" : "outline"}>
                      {done ? "Completed" : current ? "Current" : "Upcoming"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{stage.subtitle}</p>
                  {isOpen ? <div className="mt-4">{content[stage.id]}</div> : null}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/ai">Ask NextPath AI about my roadmap</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/opportunities">See opportunities</Link>
        </Button>
      </div>
    </AppShell>
  );
}
