import { useState, useEffect } from "react";
import type { Idea } from "../types";
import supabase from "../services/supabaseClient";

// Get project list from Supabase
export default function useFetchProjectList() {
  const [projects, setProjects] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("ideas").select("*");
      if (error) {
        setError(error.message);
        setProjects([]);
      } else {
        setProjects(data);
        setError(null);
      }
    };
    fetchProjects();
  }, []);
  return { projects, error };
}

//Get a single project matching the id from Supabase
export function useFetchSingleProject(id: string) {
  const [project, setProject] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("ideas")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        setProject(data || null);
      } catch (err: any) {
        setError(err.message);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  return { project, loading, error };
}

export function useFetchSimilarProjects(
  projectId: string,
  technologies: string[] | undefined
) {
  const [similarProjects, setSimilarProjects] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilterProjects = async () => {
      if (!projectId || !technologies || technologies.length === 0) return;

      try {
        const { data, error: fetchError } = await supabase
          .from("ideas")
          .select("*");

        if (fetchError) {
          setError(fetchError.message);
          setSimilarProjects([]);
        } else {
          const similar = data
            .filter(
              (p) =>
                p.id !== projectId &&
                p.technologies?.some((tech: string) =>
                  technologies.includes(tech)
                )
            )
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          setSimilarProjects(similar);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
        setSimilarProjects([]);
      }
    };

    fetchAndFilterProjects();
  }, [projectId, JSON.stringify(technologies)]);

  return { similarProjects, error };
}
