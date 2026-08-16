import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import * as fallback from "@/data/nextpath";

// In-memory cached datasets (initialised from fallback local data)
let CAREERS = [...fallback.CAREERS];
let PROGRAMMES = [...fallback.PROGRAMMES];
let PROJECTS = [...fallback.PROJECTS];
let INTERESTS = [...(fallback.INTERESTS as any)];
let STRENGTHS = [...(fallback.STRENGTHS as any)];
let SUBJECTS = [...(fallback.SUBJECTS as any)];
let GRADE10_SUBJECTS = [...(fallback.GRADE10_SUBJECTS as any)];

export function getCareers() {
  return CAREERS;
}

export function getProgrammes() {
  return PROGRAMMES;
}

export function getProjects() {
  return PROJECTS;
}

export function getInterests() {
  return INTERESTS;
}

export function getStrengths() {
  return STRENGTHS;
}

export function getSubjects() {
  return SUBJECTS;
}

export function getGrade10Subjects() {
  return GRADE10_SUBJECTS;
}

export function careerById(id: string) {
  return CAREERS.find((c) => c.id === id);
}

export function programmeById(id: string) {
  return PROGRAMMES.find((p) => p.id === id);
}

export function projectsForCareer(id: string) {
  return PROJECTS.filter((p) => p.careers.includes(id));
}

/**
 * Attempt to refresh datasets from Firestore at runtime. If the client is not
 * initialised or the fetch fails, the function leaves the fallback data intact.
 */
export async function refreshFromFirestore() {
  if (typeof window === "undefined") return;
  try {
    // careers
    const careersSnap = await getDocs(collection(db, "careers"));
    const careers: any[] = [];
    careersSnap.forEach((d) => careers.push({ id: d.id, ...d.data() }));
    if (careers.length) CAREERS = careers;

    const programmesSnap = await getDocs(collection(db, "programmes"));
    const programmes: any[] = [];
    programmesSnap.forEach((d) => programmes.push({ id: d.id, ...d.data() }));
    if (programmes.length) PROGRAMMES = programmes;

    const projectsSnap = await getDocs(collection(db, "projects"));
    const projects: any[] = [];
    projectsSnap.forEach((d) => projects.push({ id: d.id, ...d.data() }));
    if (projects.length) PROJECTS = projects;

    const interestsSnap = await getDocs(collection(db, "interests"));
    const interests: any[] = [];
    interestsSnap.forEach((d) => interests.push({ id: d.id, ...d.data() }));
    if (interests.length) INTERESTS = interests as any;

    const strengthsSnap = await getDocs(collection(db, "strengths"));
    const strengths: any[] = [];
    strengthsSnap.forEach((d) => strengths.push({ id: d.id, ...d.data() }));
    if (strengths.length) STRENGTHS = strengths as any;

    const subjectsSnap = await getDocs(collection(db, "subjects"));
    const subjects: any[] = [];
    subjectsSnap.forEach((d) => subjects.push(d.data()));
    if (subjects.length) SUBJECTS = subjects as any;

    console.log("data-service: refreshed datasets from Firestore");
  } catch (err) {
    console.warn("data-service: unable to refresh from Firestore, using local data", err);
  }
}

export default {
  getCareers,
  getProgrammes,
  getProjects,
  getInterests,
  getStrengths,
  getSubjects,
  getGrade10Subjects,
  careerById,
  programmeById,
  projectsForCareer,
  refreshFromFirestore,
};
