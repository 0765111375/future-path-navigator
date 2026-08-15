import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Building2,
  Compass,
  GraduationCap,
  Hammer,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/nextpath/shell";
import { CAREERS } from "@/data/nextpath";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NextPath — Your roadmap from Grade 9 to your future" },
      {
        name: "description",
        content:
          "NextPath helps Grade 9 learners in South Africa discover careers, choose the right subjects and build a personalised roadmap to their future.",
      },
      { property: "og:title", content: "NextPath — Your roadmap from Grade 9 to your future" },
      {
        property: "og:description",
        content:
          "Discover careers, choose subjects with confidence and get a personalised roadmap, improvement plan and alternatives.",
      },
    ],
  }),
  component: Landing,
});

const JOURNEY = [
  { label: "Grade 9", icon: MapPin },
  { label: "Subjects", icon: BookOpen },
  { label: "Skills", icon: Braces },
  { label: "Education", icon: GraduationCap },
  { label: "Projects", icon: Hammer },
  { label: "Career", icon: Compass },
  { label: "Opportunity", icon: Trophy },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <BrandMark />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/careers">Explore careers</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/login">Continue with Google</Link>
          </Button>
        </div>
      </header>

      <section className="bg-hero-glow relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> Built for Grade 9 learners in South Africa
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Your future shouldn't depend on{" "}
            <span className="text-gradient-primary">what you've been exposed to.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            NextPath helps Grade 9 learners discover careers, make informed subject choices and
            build a roadmap toward their future — with an honest view of what to improve and what
            alternatives exist.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group">
              <Link to="/login">
                Continue with Google
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/careers">Explore Careers</Link>
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-2">
            {JOURNEY.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm">
                  <step.icon className="size-4 text-primary" />
                  {step.label}
                </div>
                {i < JOURNEY.length - 1 ? (
                  <ArrowRight className="size-4 text-muted-foreground" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="panel grid gap-8 p-8 md:grid-cols-2 md:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              The problem
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              One of the biggest decisions of your life, made at 15.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Many learners, especially in rural and underserved communities, are making important
              academic decisions without seeing the full range of careers available to them. Choose
              the wrong subjects in Grade 9 and doors quietly close in Grade 12.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "What careers exist in the field I like?",
              "Which subjects should I choose next year?",
              "What marks do I actually need?",
              "What if I don't qualify — is that the end?",
            ].map((q) => (
              <div
                key={q}
                className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-muted-foreground"
              >
                “{q}”
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          NextPath doesn't tell you what to become.
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          It shows your strongest pathways, why they fit, what you need to improve, and which
          alternatives are open to you.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Career discovery",
              body: "Careers matched to your interests, strengths, subjects and marks — including ones you've never heard of.",
            },
            {
              icon: ShieldCheck,
              title: "Honest gap analysis",
              body: "See exactly where you stand against example pathway requirements, and a concrete improvement plan.",
            },
            {
              icon: Building2,
              title: "Grounded, not guessed",
              body: "Our matching engine compares your profile to verified pathway data first. AI only explains the result.",
            },
          ].map((f) => (
            <div key={f.title} className="panel p-6">
              <f.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="panel p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Careers in the MVP dataset
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {CAREERS.map((c) => (
              <Link
                key={c.id}
                to="/careers/$careerId"
                params={{ careerId: c.id }}
                className="rounded-full border border-border bg-surface-2 px-3.5 py-1.5 text-sm transition-colors hover:border-primary/50 hover:text-primary"
              >
                {c.emoji} {c.title}
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-primary/25 bg-primary/10 p-5">
            <p className="text-sm">
              “We don't want a learner's future to be limited by the careers they've been exposed
              to. NextPath shows them what's possible — and gives them a path to get there.”
            </p>
          </div>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link to="/login">Start my journey</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
