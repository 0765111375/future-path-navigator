import {
  CAREERS,
  PROGRAMMES,
  PROJECTS,
  careerById,
  type Career,
  type Programme,
} from "@/data/nextpath";

export type LearnerProfile = {
  name: string;
  grade: string;
  province: string;
  area: string;
  subjects: string[];
  marks: Record<string, number>;
  interests: string[];
  strengths: string[];
  goalMode: "known" | "idea" | "unsure";
  targetCareerId?: string;
  careerArea?: string;
  completedSteps: string[];
  createdAt: string;
};

export const emptyProfile = (): LearnerProfile => ({
  name: "",
  grade: "Grade 9",
  province: "",
  area: "",
  subjects: [],
  marks: {},
  interests: [],
  strengths: [],
  goalMode: "unsure",
  completedSteps: [],
  createdAt: new Date().toISOString(),
});

const mark = (profile: LearnerProfile, subject: string): number | null => {
  const value = profile.marks[subject];
  return typeof value === "number" ? value : null;
};

export type CareerMatch = {
  career: Career;
  score: number;
  reasons: string[];
};

const overlap = (a: string[], b: string[]) => a.filter((x) => b.includes(x));

/**
 * Deterministic matching engine. The AI never computes this — it only explains it.
 * Score is an EXPLORATION match, not a prediction of suitability.
 */
export function scoreCareer(profile: LearnerProfile, career: Career): CareerMatch {
  const interestHits = overlap(profile.interests, career.interests);
  const strengthHits = overlap(profile.strengths, career.strengths);
  const subjectHits = overlap(profile.subjects, [
    ...career.requiredSubjects,
    ...career.recommendedSubjects,
  ]);

  const interestScore = career.interests.length
    ? (interestHits.length / Math.min(career.interests.length, 4)) * 38
    : 0;
  const strengthScore = career.strengths.length
    ? (strengthHits.length / Math.min(career.strengths.length, 4)) * 28
    : 0;
  const subjectScore = subjectHits.length
    ? (subjectHits.length / Math.max(1, career.requiredSubjects.length + 2)) * 18
    : 0;

  let markScore = 0;
  let markCount = 0;
  for (const t of career.markTargets) {
    const value = mark(profile, t.subject);
    if (value !== null) {
      markCount += 1;
      markScore += Math.max(0, Math.min(1, value / t.target));
    }
  }
  const marksComponent = markCount ? (markScore / markCount) * 16 : 8;

  const score = Math.round(
    Math.min(97, interestScore + strengthScore + subjectScore + marksComponent),
  );

  const reasons: string[] = [];
  if (interestHits.length)
    reasons.push(`You said you enjoy ${interestHits.slice(0, 3).join(", ")}.`);
  if (strengthHits.length)
    reasons.push(`You rated yourself strong in ${strengthHits.slice(0, 3).join(", ")}.`);
  if (subjectHits.length)
    reasons.push(`You already take ${subjectHits.slice(0, 3).join(", ")}.`);
  const strongMark = career.markTargets.find((t) => (mark(profile, t.subject) ?? -1) >= t.target);
  if (strongMark)
    reasons.push(
      `Your ${strongMark.subject} mark (${mark(profile, strongMark.subject)}%) already reaches the example target of ${strongMark.target}%.`,
    );
  if (!reasons.length) reasons.push("This pathway is worth exploring to widen your options.");

  return { career, score, reasons };
}

export function rankCareers(profile: LearnerProfile): CareerMatch[] {
  return CAREERS.map((c) => scoreCareer(profile, c)).sort((a, b) => b.score - a.score);
}

export type Gap = {
  subject: string;
  current: number | null;
  target: number;
  delta: number;
};

export type GapAnalysis = {
  status: "on-track" | "close" | "needs-improvement" | "not-enough-data";
  gaps: Gap[];
  met: Gap[];
  missingSubjects: string[];
};

export function analyseGaps(profile: LearnerProfile, career: Career): GapAnalysis {
  const gaps: Gap[] = [];
  const met: Gap[] = [];
  let known = 0;

  for (const t of career.markTargets) {
    const current = mark(profile, t.subject);
    const row: Gap = {
      subject: t.subject,
      current,
      target: t.target,
      delta: current === null ? 0 : Math.max(0, t.target - current),
    };
    if (current === null) {
      gaps.push(row);
      continue;
    }
    known += 1;
    if (current >= t.target) met.push(row);
    else gaps.push(row);
  }

  const missingSubjects = career.requiredSubjects.filter((s) => !profile.subjects.includes(s));
  const realGaps = gaps.filter((g) => g.current !== null && g.delta > 0);

  let status: GapAnalysis["status"] = "on-track";
  if (!known) status = "not-enough-data";
  else if (missingSubjects.length || realGaps.some((g) => g.delta > 10)) status = "needs-improvement";
  else if (realGaps.length) status = "close";

  return { status, gaps, met, missingSubjects };
}

export const STATUS_LABEL: Record<GapAnalysis["status"], string> = {
  "on-track": "On track",
  close: "Almost there",
  "needs-improvement": "Needs improvement",
  "not-enough-data": "Add more marks",
};

/** Focus topics per subject — used in the improvement plan. */
export const FOCUS_TOPICS: Record<string, string[]> = {
  Mathematics: ["Algebra", "Functions & graphs", "Word problems", "Weekly past-paper practice"],
  "Physical Sciences": ["Mechanics", "Chemical equations", "Practical experiments"],
  "Life Sciences": ["Cells & systems", "Diagrams and labelling", "Exam terminology"],
  English: ["Reading comprehension", "Essay structure", "Vocabulary journal"],
  Accounting: ["Ledgers", "Financial statements", "Weekly problem sets"],
  "Information Technology": ["Basic programming logic", "Debugging practice", "Small daily projects"],
};

export function improvementActions(subject: string) {
  return (
    FOCUS_TOPICS[subject] ?? [
      "Identify the two weakest topics with your teacher",
      "Practise 20 minutes a day",
      "Redo past papers and mark yourself",
    ]
  );
}

export function alternativesFor(profile: LearnerProfile, career: Career): CareerMatch[] {
  const relatedIds = new Set(career.related);
  const scored = rankCareers(profile).filter((m) => m.career.id !== career.id);
  const related = scored.filter((m) => relatedIds.has(m.career.id));
  const others = scored.filter((m) => !relatedIds.has(m.career.id));
  const combined = [...related, ...others].filter((m) => {
    const a = analyseGaps(profile, m.career);
    return a.status !== "needs-improvement" || relatedIds.has(m.career.id);
  });
  return combined.slice(0, 4);
}

export function programmesForCareer(career: Career): Programme[] {
  return career.programmes
    .map((id) => PROGRAMMES.find((p) => p.id === id))
    .filter((p): p is Programme => Boolean(p));
}

export function programmeFit(profile: LearnerProfile, programme: Programme) {
  const rows = programme.requiredSubjects.map((r) => ({
    ...r,
    current: mark(profile, r.subject),
  }));
  const unmet = rows.filter((r) => r.current !== null && r.current < r.min);
  const unknown = rows.filter((r) => r.current === null);
  return { rows, unmet, unknown, meets: unmet.length === 0 && unknown.length === 0 };
}

export const ROADMAP_STAGES = [
  { id: "profile", title: "You are here", subtitle: "Grade 9 profile" },
  { id: "subjects", title: "Subject path", subtitle: "Grade 10 subject choice" },
  { id: "skills", title: "Skills", subtitle: "Start building now" },
  { id: "projects", title: "Projects", subtitle: "Prove what you can do" },
  { id: "education", title: "Education", subtitle: "University or college" },
  { id: "career", title: "Career", subtitle: "Your target pathway" },
  { id: "opportunities", title: "Opportunities", subtitle: "Bursaries & programmes" },
] as const;

export function roadmapProgress(profile: LearnerProfile) {
  const total = ROADMAP_STAGES.length * 2;
  const base = 2; // profile complete
  const done = base + profile.completedSteps.length;
  return Math.min(100, Math.round((done / total) * 100));
}

export function targetCareer(profile: LearnerProfile): Career | undefined {
  if (profile.targetCareerId) return careerById(profile.targetCareerId);
  const ranked = rankCareers(profile);
  return ranked[0]?.career;
}

export function strongestSubjects(profile: LearnerProfile) {
  return Object.entries(profile.marks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
}

export function projectsForCareerId(id: string) {
  return PROJECTS.filter((p) => p.careers.includes(id));
}
