import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Save, Sparkles, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { BrandMark } from "@/components/nextpath/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INTERESTS, PROVINCES, STRENGTHS, SUBJECTS } from "@/data/nextpath";
import { useProfile } from "@/lib/profile-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My profile — NextPath" },
      {
        name: "description",
        content: "Update your learner profile and keep your NextPath recommendations current.",
      },
    ],
  }),
  component: ProfilePage,
});

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

function parseTranscriptMarks(rawText: string) {
  const text = rawText.replace(/\r/g, " ");
  const marks: Record<string, number> = {};
  const chosenSubjects = new Set<string>();
  const subjectNames = [
    "Mathematics",
    "Mathematical Literacy",
    "Physical Sciences",
    "Life Sciences",
    "Geography",
    "Accounting",
    "Business Studies",
    "Economics",
    "Information Technology",
    "Computer Applications Technology",
    "English",
    "Afrikaans",
    "isiZulu",
    "Sesotho",
    "Visual Arts",
    "History",
  ];

  for (const subject of subjectNames) {
    const subjectPattern = new RegExp(
      `(${subject.replace(/[-/\[\]{}()*+?.\\^$|]/g, "\\$&")})\\s*[:\-]?\\s*(\\d{1,3})(?:\\s*%|\\s*$)`,
      "i",
    );
    const match = text.match(subjectPattern);
    if (match) {
      const score = Number(match[2]);
      if (score >= 0 && score <= 100) {
        marks[subject] = score;
        chosenSubjects.add(subject);
      }
    }
  }

  const genericPattern = /([A-Za-z][A-Za-z\s&()/-]+?)\s*[:\-]?\s*(\d{1,3})\s*%?/gi;
  let match: RegExpExecArray | null;
  while ((match = genericPattern.exec(text)) !== null) {
    const label = match[1].trim();
    const score = Number(match[2]);
    const matchSubject = subjectNames.find(
      (subject) =>
        subject.toLowerCase() === label.toLowerCase() ||
        label.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(label.toLowerCase()),
    );

    if (matchSubject && score >= 0 && score <= 100) {
      marks[matchSubject] = score;
      chosenSubjects.add(matchSubject);
    }
  }

  return { subjects: [...chosenSubjects], marks };
}

function ProfilePage() {
  const navigate = useNavigate();
  const { profile, save } = useProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState(
    profile ?? {
      name: "Annah Mlimi",
      grade: "Grade 9",
      province: "",
      area: "",
      locationType: "",
      subjects: [],
      marks: {},
      interests: [],
      strengths: [],
      goalMode: "unsure",
      completedSteps: [],
      createdAt: new Date().toISOString(),
    },
  );
  const [uploadStatus, setUploadStatus] = useState("");

  const toggler = (key: "subjects" | "interests" | "strengths", value: string) =>
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));

  const completeness = useMemo(() => {
    const pieces = [
      !!draft.name.trim(),
      !!draft.province,
      !!draft.locationType,
      draft.subjects.length >= 3,
      draft.interests.length >= 1,
      draft.strengths.length >= 1,
      draft.goalMode !== "unsure" || true,
    ];
    return Math.round((pieces.filter(Boolean).length / pieces.length) * 100);
  }, [draft]);

  const saveProfile = async () => {
    await save({ ...draft, createdAt: new Date().toISOString() });
    navigate({ to: "/roadmap" });
  };

  const handleTranscriptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseTranscriptMarks(text);

      if (parsed.subjects.length === 0) {
        setUploadStatus(
          "We couldn't detect marks from that file. You can still add subjects and marks manually.",
        );
        event.target.value = "";
        return;
      }

      setDraft((current) => ({
        ...current,
        subjects: Array.from(new Set([...current.subjects, ...parsed.subjects])),
        marks: { ...current.marks, ...parsed.marks },
      }));

      setUploadStatus(`Imported ${parsed.subjects.length} subjects and marks from ${file.name}.`);
    } catch {
      setUploadStatus("This file could not be read. Please try a text or PDF export.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <BrandMark />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/onboarding">Rebuild profile</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              My profile
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Update your learner profile</h1>
          </div>
          <div className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground">
            {completeness}% complete
          </div>
        </div>

        <div className="panel space-y-8 p-6 sm:p-8">
          <section className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={(e) => setDraft((current) => ({ ...current, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Grade</Label>
              <Input value={draft.grade} readOnly className="text-muted-foreground" />
            </div>
            <div className="grid gap-2">
              <Label>Province</Label>
              <Select
                value={draft.province}
                onValueChange={(v) => setDraft((c) => ({ ...c, province: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose province" />
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
                onValueChange={(v) => setDraft((c) => ({ ...c, locationType: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rural or urban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                  <SelectItem value="peri-urban">Peri-urban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Current school subjects</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose all subjects you are taking.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.csv,.doc,.docx,.rtf"
                  className="hidden"
                  onChange={handleTranscriptUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 size-4" />
                  Upload report
                </Button>
              </div>
            </div>

            {uploadStatus ? (
              <p className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
                {uploadStatus}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <Chip
                  key={subject}
                  active={draft.subjects.includes(subject)}
                  onClick={() => toggler("subjects", subject)}
                >
                  {subject}
                </Chip>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Marks</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add any scores you know for the selected subjects.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {draft.subjects.map((subject) => (
                <div
                  key={subject}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <Label className="flex-1">{subject}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={draft.marks[subject] ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDraft((current) => {
                          const marks = { ...current.marks };
                          if (value === "") delete marks[subject];
                          else marks[subject] = Math.max(0, Math.min(100, Number(value)));
                          return { ...current, marks };
                        });
                      }}
                      className="w-24"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Interests</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                What topics or activities spark your curiosity?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <Chip
                  key={interest.id}
                  active={draft.interests.includes(interest.id)}
                  onClick={() => toggler("interests", interest.id)}
                >
                  {interest.emoji} {interest.label}
                </Chip>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Strengths</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                What do you feel confident doing?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {STRENGTHS.map((strength) => (
                <Chip
                  key={strength.id}
                  active={draft.strengths.includes(strength.id)}
                  onClick={() => toggler("strengths", strength.id)}
                >
                  {strength.label}
                </Chip>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Career direction</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick the option that best matches where you are right now.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                { id: "known", title: "I know what I want", body: "Choose a specific career." },
                { id: "idea", title: "I have an idea", body: "Choose a broad area to explore." },
                { id: "unsure", title: "Help me explore", body: "Let NextPath recommend options." },
              ].map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      goalMode: option.id as "known" | "idea" | "unsure",
                    }))
                  }
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all",
                    draft.goalMode === option.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{option.title}</p>
                      <p className="text-sm text-muted-foreground">{option.body}</p>
                    </div>
                    {draft.goalMode === option.id ? (
                      <Check className="size-4 text-primary" />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button asChild variant="outline">
              <Link to="/dashboard">View dashboard</Link>
            </Button>
            <Button onClick={saveProfile} size="lg">
              <Save className="mr-2 size-4" />
              Save profile
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
