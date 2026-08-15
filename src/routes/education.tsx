import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/nextpath/shell";
import { NeedsProfile } from "@/components/nextpath/guard";
import { Badge } from "@/components/ui/badge";
import { DATA_VERIFIED_ON, PROGRAMMES } from "@/data/nextpath";
import { programmeFit, programmesForCareer, targetCareer } from "@/lib/matching";
import { useProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education pathways — NextPath" },
      {
        name: "description",
        content:
          "South African university and college pathways for your target career, with example subject requirements and official sources.",
      },
      { property: "og:title", content: "Education pathways — NextPath" },
      {
        property: "og:description",
        content: "University and college pathways with example requirements and official sources.",
      },
    ],
  }),
  component: EducationPage,
});

function EducationPage() {
  const { profile } = useProfile();
  if (!profile) {
    return (
      <AppShell>
        <NeedsProfile />
      </AppShell>
    );
  }

  const career = targetCareer(profile);
  const relevant = career ? programmesForCareer(career) : [];
  const others = PROGRAMMES.filter((p) => !relevant.some((r) => r.id === p.id));

  return (
    <AppShell>
      <PageHeader
        eyebrow={career?.title}
        title="Education pathways"
        description="Where this pathway can be studied in South Africa, and how your current marks compare to example requirements."
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/10 p-4 text-sm">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          These are example requirements captured from public admissions pages and verified{" "}
          {DATA_VERIFIED_ON}. Requirements change every year — always verify current requirements
          with the institution before applying.
        </p>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Pathways for {career?.title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {relevant.map((p) => {
          const fit = programmeFit(profile, p);
          return (
            <div key={p.id} className="panel flex flex-col p-6">
              <p className="text-sm text-muted-foreground">{p.university}</p>
              <h3 className="mt-1 font-semibold">{p.programme}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary">{p.degree}</Badge>
                <Badge variant="outline">{p.duration}</Badge>
                <Badge variant="outline">APS {p.aps}</Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Faculty: {p.faculty}</p>
              <ul className="mt-3 space-y-1 text-xs">
                {fit.rows.map((r) => (
                  <li key={r.subject} className="flex items-center gap-2">
                    {r.current !== null && r.current >= r.min ? (
                      <CheckCircle2 className="size-3.5 text-success" />
                    ) : (
                      <AlertTriangle className="size-3.5 text-warning" />
                    )}
                    {r.subject} {r.min}% — you:{" "}
                    {r.current === null ? "not captured" : `${r.current}%`}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                {fit.meets
                  ? "Your current marks already reach these example requirements."
                  : "Your current profile does not yet meet these example requirements — see your improvement plan."}
              </p>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Official source <ExternalLink className="size-3" />
              </a>
              <p className="text-[11px] text-muted-foreground">Verified: {p.verified}</p>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Other programmes in the dataset</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {others.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-border bg-surface p-4 text-sm transition-colors hover:border-primary/50"
          >
            <p className="text-xs text-muted-foreground">{p.university}</p>
            <p className="font-medium">{p.programme}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              APS {p.aps} ·{" "}
              {p.requiredSubjects.map((r) => `${r.subject} ${r.min}%`).join(", ")}
            </p>
          </a>
        ))}
      </div>
    </AppShell>
  );
}
