import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Rocket, Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/nextpath/shell";
import { NeedsProfile } from "@/components/nextpath/guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Level } from "@/data/nextpath";
import { projectsForCareerId, targetCareer } from "@/lib/matching";
import { useProfile } from "@/lib/profile-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & projects — NextPath" },
      {
        name: "description",
        content:
          "The skills to start building in Grade 9 and beginner to advanced projects that prove what you can do.",
      },
      { property: "og:title", content: "Skills & projects — NextPath" },
      {
        property: "og:description",
        content: "Beginner, intermediate and advanced skills and projects for your pathway.",
      },
    ],
  }),
  component: SkillsPage,
});

const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

function SkillsPage() {
  const { profile, toggleStep } = useProfile();
  const [level, setLevel] = useState<Level>("Beginner");

  if (!profile) {
    return (
      <AppShell>
        <NeedsProfile />
      </AppShell>
    );
  }

  const career = targetCareer(profile);
  const projects = career ? projectsForCareerId(career.id) : [];
  const filtered = projects.filter((p) => p.level === level);

  return (
    <AppShell>
      <PageHeader
        eyebrow={career?.title}
        title="Skills & projects"
        description="You don't have to wait until university. These are the things you can start this term."
      />

      <div className="mb-6 flex gap-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              level === l
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">{level} skills for {career?.title}</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {career?.skills[level].map((s) => (
            <Badge key={s} variant="secondary" className="px-3 py-1.5 text-sm">
              {s}
            </Badge>
          ))}
        </div>
      </section>

      <h2 className="mt-8 text-xl font-semibold">{level} projects</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length ? (
          filtered.map((p) => (
            <div key={p.id} className="panel flex flex-col p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{p.title}</h3>
                <Badge variant="outline">{p.level}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> {p.time}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
              <Button
                className="mt-5"
                onClick={() => {
                  toggleStep("projects");
                  toast.success(`Nice! "${p.title}" added to your roadmap progress.`);
                }}
              >
                <Rocket className="size-4" /> Start this project
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No {level.toLowerCase()} projects in the dataset for this pathway yet — try another
            level.
          </p>
        )}
      </div>
    </AppShell>
  );
}
