import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/nextpath/shell";
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
import {
  CAREERS,
  INTERESTS,
  LANGUAGE_OPTIONS,
  PROVINCES,
  STRENGTHS,
  SUBJECTS,
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
const GOAL_OPTIONS = [
  { id: "known", title: "I know exactly what I want", body: "Pick your career." },
  { id: "idea", title: "I have an idea", body: "Choose a broad career area." },
  { id: "unsure", title: "I'm not sure yet", body: "Let NextPath help me discover careers." },
] as const;

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

  const set = (patch: Partial<LearnerProfile>) => setDraft((current) => ({ ...current, ...patch }));
  const toggle = (key: "subjects" | "interests" | "strengths", value: string) =>
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));

  // local UI state for adding custom items
  const [showSubjectInput, setShowSubjectInput] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [interestInput, setInterestInput] = useState("");
  const [showStrengthInput, setShowStrengthInput] = useState(false);
  const [strengthInput, setStrengthInput] = useState("");

  const canContinue = [
    true,
    draft.name.trim().length > 0 && draft.province.length > 0 && draft.locationType.length > 0,
    draft.subjects.length >= 3,
    draft.interests.length >= 1,
    draft.strengths.length >= 1,
    draft.goalMode === "unsure" || Boolean(draft.targetCareerId) || Boolean(draft.careerArea),
  ][step];

  const finish = () => {
    save({ ...draft, authProvider: "google", createdAt: new Date().toISOString() });
    // After onboarding, send the learner to the roadmap subjects stage
    navigate({ to: "/roadmap" });
  };

  return (
    <AppShell>
      <div className="bg-hero-glow min-h-screen">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
          <span />
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

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
                  Let’s build your Grade 9 career roadmap together.
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
                  onChange={(event) => set({ name: event.target.value })}
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
                  value={draft.preferredLanguage ?? "English"}
                  onValueChange={(value) => set({ preferredLanguage: value })}
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
                <Select value={draft.province} onValueChange={(value) => set({ province: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Area type</Label>
                <Select
                  value={draft.locationType}
                  onValueChange={(value) =>
                    set({ locationType: value as LearnerProfile["locationType"] })
                  }
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

              {/* Area removed — not used in recommendations */}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-6">
              <div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Which subjects are you currently taking? Pick at least three.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((subject) => (
                    <Chip
                      key={subject}
                      active={draft.subjects.includes(subject)}
                      onClick={() => toggle("subjects", subject)}
                    >
                      {subject}
                    </Chip>
                  ))}
                  <Chip active={showSubjectInput} onClick={() => setShowSubjectInput((s) => !s)}>
                    Other
                  </Chip>
                </div>
                {showSubjectInput ? (
                  <div className="mt-3 flex items-center gap-2">
                    <Input
                      placeholder="Add a subject"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        const subj = subjectInput.trim();
                        if (!subj) return;
                        // add to subjects and clear input; marks input will render below
                        setDraft((current) => ({ ...current, subjects: [...current.subjects, subj] }));
                        setSubjectInput("");
                        setShowSubjectInput(false);
                      }}
                    >
                      Add
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  Add your marks if you have them — approximate percentages are fine.
                </p>
                {draft.subjects.map((subject) => (
                  <div key={subject} className="flex items-center gap-4">
                    <Label className="flex-1">{subject}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="w-24"
                        value={draft.marks[subject] ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setDraft((current) => {
                            const marks = { ...current.marks };
                            if (value === "") delete marks[subject];
                            else marks[subject] = Math.max(0, Math.min(100, Number(value)));
                            return { ...current, marks };
                          });
                        }}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                What do you enjoy? Choose as many as you like.
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <Chip
                    key={interest.id}
                    active={draft.interests.includes(interest.id)}
                    onClick={() => toggle("interests", interest.id)}
                  >
                    {interest.emoji} {interest.label}
                  </Chip>
                ))}
                <Chip active={showInterestInput} onClick={() => setShowInterestInput((s) => !s)}>
                  Other
                </Chip>
              </div>
              {showInterestInput ? (
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    placeholder="Add an interest (e.g. Astronomy)"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      const v = interestInput.trim();
                      if (!v) return;
                      // use a simple id for freeform interest
                      const id = v.toLowerCase().replace(/\s+/g, "-");
                      setDraft((current) => ({ ...current, interests: [...current.interests, id] }));
                      setInterestInput("");
                      setShowInterestInput(false);
                    }}
                  >
                    Add
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                What do you think you’re good at?
              </p>
              <div className="flex flex-wrap gap-2">
                {STRENGTHS.map((strength) => (
                  <Chip
                    key={strength.id}
                    active={draft.strengths.includes(strength.id)}
                    onClick={() => toggle("strengths", strength.id)}
                  >
                    {strength.label}
                  </Chip>
                ))}
                <Chip active={showStrengthInput} onClick={() => setShowStrengthInput((s) => !s)}>
                  Other
                </Chip>
              </div>
              {showStrengthInput ? (
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    placeholder="Add a strength (e.g. Public speaking)"
                    value={strengthInput}
                    onChange={(e) => setStrengthInput(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      const v = strengthInput.trim();
                      if (!v) return;
                      const id = v.toLowerCase().replace(/\s+/g, "-");
                      setDraft((current) => ({ ...current, strengths: [...current.strengths, id] }));
                      setStrengthInput("");
                      setShowStrengthInput(false);
                    }}
                  >
                    Add
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">Do you already have a career in mind?</p>

              <div className="grid gap-3">
                {GOAL_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      set({
                        goalMode: option.id as LearnerProfile["goalMode"],
                        targetCareerId: undefined,
                        careerArea: undefined,
                      });
                      // For 'known' and 'idea', take the user to the careers explorer
                      if (option.id === "known" || option.id === "idea") {
                        navigate({ to: "/careers/" });
                      }
                    }}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      draft.goalMode === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface hover:border-primary/40",
                    )}
                  >
                    <p className="font-medium">{option.title}</p>
                    <p className="text-sm text-muted-foreground">{option.body}</p>
                  </button>
                ))}
              </div>

              {draft.goalMode === "known" ? (
                <Select
                  value={draft.targetCareerId ?? ""}
                  onValueChange={(value) => set({ targetCareerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a career" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREERS.map((career) => (
                      <SelectItem key={career.id} value={career.id}>
                        {career.emoji} {career.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}

              {draft.goalMode === "idea" ? (
                <Select
                  value={draft.careerArea ?? ""}
                  onValueChange={(value) => set({ careerArea: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a career area" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set(CAREERS.map((career) => career.category))].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
    </AppShell>
  );
}
