import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "./firebase";
import { emptyProfile, type LearnerProfile } from "./matching";

function toProfile(data: Partial<LearnerProfile> | undefined | null): LearnerProfile | null {
  if (!data) return null;

  return {
    uid: data.uid,
    email: data.email,
    photoURL: data.photoURL,
    name: data.name ?? "",
    grade: data.grade ?? "Grade 9",
    preferredLanguage: data.preferredLanguage ?? "English",
    province: data.province ?? "",
    area: data.area ?? "",
    locationType: data.locationType ?? "",
    subjects: data.subjects ?? [],
    marks: data.marks ?? {},
    interests: data.interests ?? [],
    strengths: data.strengths ?? [],
    subjectSource: data.subjectSource ?? "manual",
    reportFileName: data.reportFileName,
    goalMode: data.goalMode ?? "unsure",
    targetCareerId: data.targetCareerId,
    careerArea: data.careerArea,
    authProvider: data.authProvider ?? "google",
    completedSteps: data.completedSteps ?? [],
    onboardingComplete: data.onboardingComplete ?? false,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? data.createdAt ?? new Date().toISOString(),
  };
}

export async function saveProfile(profile: LearnerProfile) {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);
  const payload = {
    ...profile,
    uid: user.uid,
    email: user.email ?? profile.email ?? "",
    photoURL: user.photoURL ?? profile.photoURL ?? "",
    onboardingComplete: profile.onboardingComplete ?? false,
    updatedAt: serverTimestamp(),
  };

  // Remove any undefined fields before sending to Firestore. Firestore rejects
  // writes containing `undefined` as a field value.
  const sanitized = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );

  await setDoc(userRef, sanitized as any, { merge: true });

  const saved = await getDoc(userRef);
  return saved.exists() ? toProfile(saved.data() as Partial<LearnerProfile>) : profile;
}

export function clearProfile() {
  return null;
}

export function useProfile() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async (uid: string) => {
      const userRef = doc(db, "users", uid);
      const snapshot = await getDoc(userRef);
      if (!cancelled) {
        setProfile(snapshot.exists() ? toProfile(snapshot.data() as Partial<LearnerProfile>) : null);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (!cancelled) setProfile(null);
        return;
      }

      void hydrate(user.uid);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const update = useCallback(
    async (patch: Partial<LearnerProfile>) => {
      const base = profile ?? emptyProfile();
      const next = { ...base, ...patch };
      const saved = await saveProfile(next);
      if (saved) setProfile(saved);
    },
    [profile],
  );

  const toggleStep = useCallback(
    async (step: string) => {
      const base = profile ?? emptyProfile();
      const has = base.completedSteps.includes(step);
      const next = {
        ...base,
        completedSteps: has
          ? base.completedSteps.filter((value) => value !== step)
          : [...base.completedSteps, step],
      };
      const saved = await saveProfile(next);
      if (saved) setProfile(saved);
    },
    [profile],
  );

  const save = useCallback(
    async (nextProfile: LearnerProfile) => {
      const saved = await saveProfile(nextProfile);
      if (saved) setProfile(saved);
    },
    [],
  );

  return { profile, update, toggleStep, save, reset: clearProfile };
}

export const DEMO_PROFILE: LearnerProfile = {
  name: "Thandi",
  grade: "Grade 9",
  preferredLanguage: "English",
  province: "Limpopo",
  area: "Rural village near Tzaneen",
  locationType: "rural",
  authProvider: "google",
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
