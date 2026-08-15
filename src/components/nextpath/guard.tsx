import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_PROFILE, useProfile } from "@/lib/profile-store";

export function NeedsProfile() {
  const { save } = useProfile();
  return (
    <div className="panel mx-auto max-w-lg p-8 text-center">
      <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
        <Sparkles className="size-6" />
      </div>
      <h2 className="text-xl font-semibold">Let's build your path first</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        NextPath needs your subjects, marks, interests and strengths before it can build a roadmap
        for you. It takes about two minutes.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/onboarding">Build my path</Link>
        </Button>
        <Button variant="outline" size="lg" onClick={() => save(DEMO_PROFILE)}>
          Load demo learner
        </Button>
      </div>
    </div>
  );
}

export function MatchRing({ score }: { score: number }) {
  return (
    <div className="relative grid size-16 shrink-0 place-items-center">
      <svg viewBox="0 0 36 36" className="absolute size-16 -rotate-90">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 97.4} 97.4`}
        />
      </svg>
      <span className="text-sm font-semibold">{score}%</span>
    </div>
  );
}
