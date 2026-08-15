import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandMark } from "@/components/nextpath/shell";
import {
  CAREERS,
  GRADE9_SUBJECTS,
  INTERESTS,
  LANGUAGE_OPTIONS,
  PROVINCES,
  STRENGTHS,
} from "@/data/nextpath";
import { emptyProfile, type LearnerProfile } from "@/lib/matching";
import { useProfile } from "@/lib/profile-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Build your path — NextPath onboarding" },
      {
        name: "description",
        content:
          "Tell NextPath your subjects, marks, interests and strengths and get a personalised Grade 9 career roadmap.",
      },
      { property: "og:title", content: "Build your path — NextPath onboarding" },
      {
        property: "og:description",
        content: "Six quick steps to your personalised Grade 9 career roadmap.",
      },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["Welcome", "About you", "Subjects & marks", "Interests", "Strengths", "Career goal"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-all",
        active
          ? "border-primary bg-primary/15 text-primary shadow-elevated"
          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const { save } = useProfile();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<LearnerProfile>(() => {
    const initial = emptyProfile();
    const sessionName =
      typeof window !== "undefined" ? window.localStorage.getItem("nextpath.auth.v1") : null;
    if (sessionName) {
      try {
        const parsed = JSON.parse(sessionName) as { name?: string };
        if (parsed.name) initial.name = parsed.name;
      } catch {
        // ignore invalid session data
      }
    }
    initial.authProvider = "google";
    return initial;
  });

  const set = (patch: Partial<LearnerProfile>) => setDraft((d) => ({ ...d, ...patch }));
  const toggle = (key: "subjects" | "interests" | "strengths", value: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const canContinue = [
<<<<<<< HEAD
    draft.name.trim().length > 0 && draft.province.length > 0,
    draft.subjects.length >= 3 || Boolean(draft.reportFileName),
    Object.keys(draft.marks).length >= 1,
=======
    true,
    draft.name.trim().length > 0 && draft.province.length > 0 && draft.locationType.length > 0,
    draft.subjects.length >= 3,
>>>>>>> bcd0498 (Authentication)
    draft.interests.length >= 1,
    draft.strengths.length >= 1,
    draft.goalMode === "unsure" || Boolean(draft.targetCareerId) || Boolean(draft.careerArea),
  ][step];

  const finish = () => {
    save({ ...draft, authProvider: "google", createdAt: new Date().toISOString() });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="bg-hero-glow min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <BrandMark />
        <span className="text-sm text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </span>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-20">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          {step === 0 ? "Welcome to NextPath 👋" : "Let's build your path."}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {step === 0
            ? "Let's build your Grade 9 career roadmap."
            : `${STEPS[step]} — this stays on your device and powers every recommendation.`}
        </p>

        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-6" />

        <div className="panel mt-6 p-6 sm:p-8">
          {step === 0 ? (
            <div className="grid gap-5">
              <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                <Check className="size-4" />
                Google account connected
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">Welcome to NextPath 👋</h2>
                <p className="text-muted-foreground">
                  Let's build your Grade 9 career roadmap together.
                </p>
              </div>
              <div className="grid gap-3 rounded-xl border border-border bg-surface px-4 py-4 text-sm text-muted-foreground">
                <p>We’ll collect the essentials to personalise your next steps:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Your name, province and area</li>
                  <li>Your current subjects and marks</li>
                  <li>Your interests, strengths and career direction</li>
                </ul>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={draft.name}
                  placeholder="e.g. Aphiwe"
                  onChange={(e) => set({ name: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  This is pulled from your Google account when available.
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Grade</Label>
                <Input value="Grade 9" readOnly className="text-muted-foreground" />
              </div>
              <div className="grid gap-2">
                <Label>Preferred language</Label>
                <Select
                  value={draft.preferredLanguage}
                  onValueChange={(v) => set({ preferredLanguage: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Province</Label>
                <Select value={draft.province} onValueChange={(v) => set({ province: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Area type</Label>
                <Select
                  value={draft.locationType}
                  onValueChange={(v) => set({ locationType: v as LearnerProfile["locationType"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rural or urban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                    <SelectItem value="peri-urban">Peri-urban</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="area">Area (optional)</Label>
                <Input
                  id="area"
                  value={draft.area}
                  placeholder="Township, village, town or suburb"
                  onChange={(e) => set({ area: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  We only use this to personalise your recommendations and community context.
                </p>
              </div>
            </div>
          ) : null}

<<<<<<< HEAD
          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  How would you like to tell us your Grade 9 subjects?
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "manual", label: "Choose my subjects" },
                    { id: "upload", label: "Upload a report or timetable" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => set({ subjectSource: option.id as "manual" | "upload" })}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all",
                        draft.subjectSource === option.id
                          ? "border-primary bg-primary/15 text-primary shadow-elevated"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
=======
          {step === 2 ? (
            <div className="grid gap-6">
              <div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Which subjects are you currently taking? Pick at least three.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <Chip
                      key={s}
                      active={draft.subjects.includes(s)}
                      onClick={() => toggle("subjects", s)}
                    >
                      {s}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  Add your marks if you have them — approximate percentages are fine.
                </p>
                {draft.subjects.map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <Label className="flex-1">{s}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="w-24"
                        value={draft.marks[s] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDraft((d) => {
                            const marks = { ...d.marks };
                            if (value === "") delete marks[s];
                            else marks[s] = Math.max(0, Math.min(100, Number(value)));
                            return { ...d, marks };
                          });
                        }}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
>>>>>>> bcd0498 (Authentication)
              </div>

              {draft.subjectSource === "manual" ? (
                <div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Which Grade 9 subjects are you currently taking? Pick at least three, including
                    your home language and core subjects.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {GRADE9_SUBJECTS.map((s) => (
                      <Chip
                        key={s}
                        active={draft.subjects.includes(s)}
                        onClick={() => toggle("subjects", s)}
                      >
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Upload a school report, progress report, or timetable. We will use it to help
                    suggest the right subjects and pathways.
                  </p>
                  <div className="rounded-xl border border-dashed border-border bg-surface p-4">
                    <Input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          set({ reportFileName: file.name, subjectSource: "upload" });
                        }
                      }}
                    />
                    {draft.reportFileName ? (
                      <p className="mt-3 text-sm text-primary">Selected file: {draft.reportFileName}</p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                What do you enjoy? Choose as many as you like.
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <Chip
                    key={i.id}
                    active={draft.interests.includes(i.id)}
                    onClick={() => toggle("interests", i.id)}
                  >
                    {i.emoji} {i.label}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                What do you think you're good at?
              </p>
              <div className="flex flex-wrap gap-2">
                {STRENGTHS.map((s) => (
                  <Chip
                    key={s.id}
                    active={draft.strengths.includes(s.id)}
                    onClick={() => toggle("strengths", s.id)}
                  >
                    {s.label}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">Do you already have a career in mind?</p>
              <div className="grid gap-3">
                {[
                  { id: "known", title: "I know exactly what I want", body: "Pick your career." },
                  { id: "idea", title: "I have an idea", body: "Choose a broad career area." },
                  {
                    id: "unsure",
                    title: "I'm not sure yet",
                    body: "Let NextPath help me discover careers.",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      set({
                        goalMode: opt.id as LearnerProfile["goalMode"],
                        targetCareerId: undefined,
                        careerArea: undefined,
                      })
                    }
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      draft.goalMode === opt.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface hover:border-primary/40",
                    )}
                  >
                    <p className="font-medium">{opt.title}</p>
                    <p className="text-sm text-muted-foreground">{opt.body}</p>
                  </button>
                ))}
              </div>

              {draft.goalMode === "known" ? (
                <Select
                  value={draft.targetCareerId ?? ""}
                  onValueChange={(v) => set({ targetCareerId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a career" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREERS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.emoji} {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}

              {draft.goalMode === "idea" ? (
                <Select
                  value={draft.careerArea ?? ""}
                  onValueChange={(v) => set({ careerArea: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a career area" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set(CAREERS.map((c) => c.category))].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(step - 1))}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step === STEPS.length - 1 ? (
            <Button size="lg" disabled={!canContinue} onClick={finish}>
              <Check className="size-4" /> Generate my roadmap
            </Button>
          ) : (
            <Button size="lg" disabled={!canContinue} onClick={() => setStep(step + 1)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
