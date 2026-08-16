import { useCallback, useEffect, useState } from "react";
import dataService from "./data-service";
import type { Career, Programme } from "@/data/nextpath";

type Datasets = {
  careers: Career[];
  programmes: Programme[];
  projects: any[];
  interests: any[];
  strengths: any[];
  subjects: any[];
};

export default function useDataService() {
  const [careers, setCareers] = useState<Career[]>(() => dataService.getCareers());
  const [programmes, setProgrammes] = useState<Programme[]>(() => dataService.getProgrammes());
  const [projects, setProjects] = useState<any[]>(() => dataService.getProjects());
  const [interests, setInterests] = useState<any[]>(() => dataService.getInterests());
  const [strengths, setStrengths] = useState<any[]>(() => dataService.getStrengths());
  const [subjects, setSubjects] = useState<any[]>(() => dataService.getSubjects());

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dataService.refreshFromFirestore();
      setCareers(dataService.getCareers());
      setProgrammes(dataService.getProgrammes());
      setProjects(dataService.getProjects());
      setInterests(dataService.getInterests());
      setStrengths(dataService.getStrengths());
      setSubjects(dataService.getSubjects());
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // only run on client
    if (typeof window === "undefined") return;
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const datasets: Datasets = {
    careers,
    programmes,
    projects,
    interests,
    strengths,
    subjects,
  };

  return { ...datasets, loading, error, refresh } as const;
}
