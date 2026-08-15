import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/nextpath/shell";
import { MatchRing } from "@/components/nextpath/guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CAREERS } from "@/data/nextpath";
import { rankCareers, scoreCareer } from "@/lib/matching";
import { useProfile } from "@/lib/profile-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Explore careers — NextPath" },
      {
        name: "description",
        content:
          "Explore technology, health, engineering and business careers, the subjects they need and the study pathways that lead there.",
      },
      { property: "og:title", content: "Explore careers — NextPath" },
      {
        property: "og:description",
        content: "Discover careers you may never have heard of, matched to your interests.",
      },
    ],
  }),
  component: CareerExplorer,
});

function CareerExplorer() {
  const { profile } = useProfile();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(CAREERS.map((c) => c.category))];
  const ranked = profile ? rankCareers(profile) : CAREERS.map((c) => ({ career: c, score: 0, reasons: [] as string[] }));

  const list = ranked.filter((m) => {
    const matchesQuery =
      !query ||
      m.career.title.toLowerCase().includes(query.toLowerCase()) ||
      m.career.blurb.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === "All" || m.career.category === category;
    return matchesQuery && matchesCat;
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Career discovery"
        title="Explore careers"
        description="Careers you may never have been shown. Each one lists the subjects that support it, the skills to start now and the study pathways that lead there."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search careers…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                category === c
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map(({ career }) => {
          const match = profile ? scoreCareer(profile, career) : null;
          return (
            <div key={career.id} className="panel flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl">{career.emoji}</p>
                  <h2 className="mt-2 text-lg font-semibold">{career.title}</h2>
                  <Badge variant="secondary" className="mt-2">
                    {career.category}
                  </Badge>
                </div>
                {match ? <MatchRing score={match.score} /> : null}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{career.blurb}</p>

              {match ? (
                <p className="mt-3 rounded-lg border border-primary/25 bg-primary/10 p-3 text-xs text-primary">
                  Why it may fit: {match.reasons[0]}
                </p>
              ) : null}

              <dl className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div>
                  <dt className="font-medium text-foreground">Subjects</dt>
                  <dd>
                    {[...career.requiredSubjects, ...career.recommendedSubjects]
                      .slice(0, 4)
                      .join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Start with these skills</dt>
                  <dd>{career.skills.Beginner.slice(0, 3).join(", ")}</dd>
                </div>
              </dl>

              <Button asChild variant="outline" className="mt-5">
                <Link to="/careers/$careerId" params={{ careerId: career.id }}>
                  View my path <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
