import { DATA_VERIFIED_ON, OPPORTUNITIES } from "@/data/nextpath";
import {
  analyseGaps,
  alternativesFor,
  improvementActions,
  programmesForCareer,
  projectsForCareerId,
  rankCareers,
  roadmapProgress,
  targetCareer,
  type LearnerProfile,
} from "./matching";

/**
 * Context Builder — the grounding step of the NextPath architecture.
 * Profile -> matching engine -> verified data -> context -> LLM.
 */
export function buildAIContext(profile: LearnerProfile): string {
  const career = targetCareer(profile);
  const ranked = rankCareers(profile).slice(0, 5);
  const lines: string[] = [];

  lines.push(`LEARNER PROFILE`);
  lines.push(`Name: ${profile.name || "Learner"}`);
  lines.push(`Grade: ${profile.grade}`);
  lines.push(`Province: ${profile.province || "not given"}${profile.area ? ` (${profile.area})` : ""}`);
  lines.push(`Subjects: ${profile.subjects.join(", ") || "none captured"}`);
  lines.push(
    `Marks: ${
      Object.entries(profile.marks)
        .map(([s, m]) => `${s} ${m}%`)
        .join(", ") || "none captured"
    }`,
  );
  lines.push(`Interests: ${profile.interests.join(", ") || "none"}`);
  lines.push(`Strengths: ${profile.strengths.join(", ") || "none"}`);
  lines.push(`Career goal mode: ${profile.goalMode}`);
  lines.push(`Roadmap progress: ${roadmapProgress(profile)}%`);

  lines.push(`\nEXPLORATION MATCHES (calculated by the NextPath matching engine, not by you)`);
  ranked.forEach((m) => {
    lines.push(`- ${m.career.title}: ${m.score}% exploration match. Why: ${m.reasons.join(" ")}`);
  });

  if (career) {
    const gaps = analyseGaps(profile, career);
    lines.push(`\nTARGET PATHWAY: ${career.title} (${career.category})`);
    lines.push(`Description: ${career.description}`);
    lines.push(`Required school subjects: ${career.requiredSubjects.join(", ") || "no strict requirement"}`);
    lines.push(`Recommended subjects: ${career.recommendedSubjects.join(", ")}`);
    lines.push(`Example mark targets: ${career.markTargets.map((t) => `${t.subject} ${t.target}%+`).join(", ")}`);
    lines.push(`Gap status: ${gaps.status}`);
    gaps.gaps.forEach((g) => {
      lines.push(
        `- GAP ${g.subject}: current ${g.current === null ? "unknown" : `${g.current}%`}, example target ${g.target}%. Focus topics: ${improvementActions(g.subject).join(", ")}`,
      );
    });
    gaps.met.forEach((g) => lines.push(`- MET ${g.subject}: ${g.current}% vs target ${g.target}%`));
    if (gaps.missingSubjects.length)
      lines.push(`- Subjects not currently taken: ${gaps.missingSubjects.join(", ")}`);

    lines.push(
      `Skills: Beginner - ${career.skills.Beginner.join(", ")}; Intermediate - ${career.skills.Intermediate.join(", ")}; Advanced - ${career.skills.Advanced.join(", ")}`,
    );
    lines.push(
      `Projects: ${projectsForCareerId(career.id)
        .map((p) => `${p.title} (${p.level}, ${p.time})`)
        .join("; ")}`,
    );
    lines.push(`EDUCATION PATHWAYS (example requirements, verified ${DATA_VERIFIED_ON}, must be confirmed with the institution):`);
    programmesForCareer(career).forEach((p) => {
      lines.push(
        `- ${p.university}: ${p.programme} (${p.duration}, APS ${p.aps}). Requires ${p.requiredSubjects
          .map((r) => `${r.subject} ${r.min}%`)
          .join(", ")}. Source: ${p.url}`,
      );
    });

    const alts = alternativesFor(profile, career);
    lines.push(
      `ALTERNATIVE PATHWAYS: ${alts.map((a) => `${a.career.title} (${a.score}% match — ${a.reasons[0]})`).join("; ")}`,
    );

    const opps = OPPORTUNITIES.filter((o) =>
      o.areas.some((a) => career.opportunityAreas.includes(a)),
    ).slice(0, 6);
    lines.push(`VERIFIED OPPORTUNITIES:`);
    opps.forEach((o) =>
      lines.push(
        `- ${o.name} (${o.organisation}, ${o.type}). Eligibility: ${o.eligibility} Closing: ${o.closing} Link: ${o.url}`,
      ),
    );
  }

  return lines.join("\n");
}
