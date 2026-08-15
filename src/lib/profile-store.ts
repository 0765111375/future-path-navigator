import { useCallback, useSyncExternalStore } from "react";
import { emptyProfile, type LearnerProfile } from "./matching";

const KEY = "nextpath.profile.v1";

let cache: LearnerProfile | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function read(): LearnerProfile | null {
  if (typeof window === "undefined") return null;
  if (loaded) return cache;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as LearnerProfile) : null;
  } catch {
    cache = null;
  }
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

export function saveProfile(profile: LearnerProfile) {
  cache = profile;
  loaded = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  }
  emit();
}

export function clearProfile() {
  cache = null;
  loaded = true;
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProfile() {
  const profile = useSyncExternalStore(
    subscribe,
    () => read(),
    () => null,
  );

  const update = useCallback((patch: Partial<LearnerProfile>) => {
    const base = read() ?? emptyProfile();
    saveProfile({ ...base, ...patch });
  }, []);

  const toggleStep = useCallback((step: string) => {
    const base = read() ?? emptyProfile();
    const has = base.completedSteps.includes(step);
    saveProfile({
      ...base,
      completedSteps: has
        ? base.completedSteps.filter((s) => s !== step)
        : [...base.completedSteps, step],
    });
  }, []);

  return { profile, update, toggleStep, save: saveProfile, reset: clearProfile };
}

export const DEMO_PROFILE: LearnerProfile = {
  name: "Thandi",
  grade: "Grade 9",
  province: "Limpopo",
  area: "Rural village near Tzaneen",
  subjects: [
    "Mathematics",
    "Physical Sciences",
    "Life Sciences",
    "English",
    "Information Technology",
    "Geography",
  ],
  marks: {
    Mathematics: 58,
    "Physical Sciences": 64,
    "Life Sciences": 71,
    English: 74,
    "Information Technology": 82,
    Geography: 66,
  },
  interests: ["technology", "problem-solving", "building", "games"],
  strengths: ["problem-solving", "technology", "independent", "building"],
  goalMode: "known",
  targetCareerId: "software-engineer",
  completedSteps: ["profile-reviewed"],
  createdAt: new Date().toISOString(),
};
